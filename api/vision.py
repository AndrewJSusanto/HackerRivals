import base64
import json
import os
from http.server import BaseHTTPRequestHandler

import anthropic
from elasticsearch import Elasticsearch


def get_es():
    return Elasticsearch(
        os.environ["ELASTIC_URL"],
        api_key=os.environ["ELASTIC_API_KEY"],
    )


def award_points(es, user_id: str, challenge_id: str, points: int):
    es.index(
        index="hackerrivals-events",
        document={
            "user_id": user_id,
            "challenge_id": challenge_id,
            "challenge_type": "photo",
            "points_earned": points,
            "timestamp": "now",
        },
    )
    es.update(
        index="hackerrivals-users",
        id=user_id,
        script={
            "source": (
                "ctx._source.total_points += params.points;"
                "if (!ctx._source.completed_challenges.contains(params.cid)) {"
                "  ctx._source.completed_challenges.add(params.cid);"
                "}"
            ),
            "params": {"points": points, "cid": challenge_id},
        },
    )


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))

        user_id = body.get("userId")
        challenge_id = body.get("challengeId")
        image_b64 = body.get("image")  # data:image/jpeg;base64,...

        if not all([user_id, challenge_id, image_b64]):
            self._respond(400, {"error": "userId, challengeId, image required"})
            return

        # Strip data URL prefix if present
        if "," in image_b64:
            image_b64 = image_b64.split(",", 1)[1]

        es = get_es()

        # Fetch challenge to get keywords and points
        challenge = es.get(index="hackerrivals-challenges", id=challenge_id)
        if not challenge["found"]:
            self._respond(404, {"error": "Challenge not found"})
            return

        src = challenge["_source"]
        keywords = src.get("keywords", [])
        points = src.get("points", 100)
        description = src.get("description", "")

        # Check duplicate
        user = es.get(index="hackerrivals-users", id=user_id)
        if challenge_id in user["_source"].get("completed_challenges", []):
            self._respond(409, {"error": "Already completed"})
            return

        # Ask Claude to verify the image
        client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
        prompt = (
            f"You are judging a hackathon scavenger hunt photo challenge.\n"
            f"Challenge description: {description}\n"
            f"Required subjects/keywords: {', '.join(keywords)}\n\n"
            f"Look at the image and decide if it satisfies the challenge.\n"
            f"Respond ONLY with valid JSON: "
            f'{{ "passed": true/false, "reason": "one sentence explanation" }}'
        )

        msg = client.messages.create(
            model="claude-opus-4-7",
            max_tokens=256,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": image_b64,
                            },
                        },
                        {"type": "text", "text": prompt},
                    ],
                }
            ],
        )

        verdict = json.loads(msg.content[0].text)
        passed = verdict.get("passed", False)
        reason = verdict.get("reason", "")

        if passed:
            award_points(es, user_id, challenge_id, points)

        self._respond(200, {
            "passed": passed,
            "message": reason,
            "points": points if passed else 0,
        })

    def _respond(self, status: int, data: dict):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
