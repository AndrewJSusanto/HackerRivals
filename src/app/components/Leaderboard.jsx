import { useState, useEffect } from 'react';
import { LeaderboardSkeleton } from './SkeletonLoading';

export function Leaderboard({ user, currentUserNickname, currentUserAvatar, userRank, refreshRank }) {
  const [isLoading, setIsLoading] = useState(true);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    if (!refreshRank) {
      setIsLoading(false);
      return;
    }
    refreshRank(10).then((data) => {
      if (cancelled) return;
      setTopUsers(data?.top ?? []);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshRank]);

  const leaderboardData = topUsers.map((u, idx) => ({
    rank: idx + 1,
    avatar: u.emoji,
    nickname: u.username,
    points: u.total_points,
    isCurrentUser: u.id === user?.id,
  }));

  const currentUserRank = userRank ?? '—';
  const currentUserPoints = user?.total_points ?? 0;

  const topThree = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3);

  return (
    <div
      className="min-h-screen w-full pb-16"
      style={{ backgroundColor: 'var(--surface-1)' }}
    >
      {/* Top App Bar */}
      <header
        className="sticky top-0 z-40 w-full px-4 py-3"
        style={{
          backgroundColor: 'var(--surface-1)',
          borderBottom: '0.5px solid var(--border-color)',
        }}
      >
        <h2>Leaderboard</h2>
      </header>

      {/* Your Ranking Banner - Pinned */}
      <div
        className="sticky top-14 z-30 px-4 py-3"
        style={{
          backgroundColor: 'var(--surface-1)',
        }}
      >
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: 'var(--surface-2)',
            borderLeft: '4px solid var(--ocean-blue)',
          }}
        >
          <p className="mb-2" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Your current standing
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: 'var(--surface-3)' }}
            >
              {currentUserAvatar}
            </div>
            <div className="flex-1">
              <h3 className="mb-1">{currentUserNickname}</h3>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: 'rgba(61, 120, 171, 0.15)',
                    color: 'var(--ocean-blue)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  #{currentUserRank}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p
                style={{
                  color: 'var(--golden-amber)',
                  fontSize: '20px',
                  fontWeight: 500,
                }}
              >
                {currentUserPoints.toLocaleString()}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>points</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LeaderboardSkeleton />
      ) : leaderboardData.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            No leaderboard data yet — be the first to score points!
          </p>
        </div>
      ) : (
        <div className="px-4 py-6 space-y-6">
          {topThree.length === 3 && (
          <div className="flex items-end justify-center gap-3 pb-8">
          {/* Rank 2 - Left */}
          <div className="flex-1 flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2"
              style={{
                backgroundColor: 'var(--surface-3)',
                border: '2px solid var(--ocean-blue)',
              }}
            >
              {topThree[1].avatar}
            </div>
            <h3 className="mb-1 text-center" style={{ fontSize: '16px' }}>
              {topThree[1].nickname}
            </h3>
            <p
              className="mb-2"
              style={{
                color: 'var(--ocean-blue)',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              {topThree[1].points.toLocaleString()}
            </p>
            <div
              className="w-full rounded-t-lg pt-6 pb-2 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--surface-3)',
                border: '1px solid var(--border-color)',
                minHeight: '60px',
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: 500, color: 'var(--text-primary)' }}>
                2
              </span>
            </div>
          </div>

          {/* Rank 1 - Center (Elevated) */}
          <div className="flex-1 flex flex-col items-center" style={{ marginBottom: '20px' }}>
            <span className="material-symbols-rounded mb-1" style={{ fontSize: '28px', color: 'var(--golden-amber)' }}>
              emoji_events
            </span>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-2"
              style={{
                backgroundColor: 'var(--surface-3)',
                border: '3px solid var(--golden-amber)',
              }}
            >
              {topThree[0].avatar}
            </div>
            <h3 className="mb-1 text-center" style={{ fontSize: '18px', color: 'var(--golden-amber)' }}>
              {topThree[0].nickname}
            </h3>
            <p
              className="mb-2"
              style={{
                color: 'var(--golden-amber)',
                fontSize: '22px',
                fontWeight: 500,
              }}
            >
              {topThree[0].points.toLocaleString()}
            </p>
            <div
              className="w-full rounded-t-lg pt-8 pb-2 flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(254, 193, 78, 0.15)',
                border: '1px solid var(--golden-amber)',
                minHeight: '80px',
              }}
            >
              <span style={{ fontSize: '28px', fontWeight: 500, color: 'var(--golden-amber)' }}>
                1
              </span>
            </div>
          </div>

          {/* Rank 3 - Right */}
          <div className="flex-1 flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2"
              style={{
                backgroundColor: 'var(--surface-3)',
                border: '2px solid var(--ocean-blue)',
              }}
            >
              {topThree[2].avatar}
            </div>
            <h3 className="mb-1 text-center" style={{ fontSize: '16px' }}>
              {topThree[2].nickname}
            </h3>
            <p
              className="mb-2"
              style={{
                color: 'var(--ocean-blue)',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              {topThree[2].points.toLocaleString()}
            </p>
            <div
              className="w-full rounded-t-lg pt-4 pb-2 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--surface-3)',
                border: '1px solid var(--border-color)',
                minHeight: '50px',
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: 500, color: 'var(--text-primary)' }}>
                3
              </span>
            </div>
          </div>
        </div>

        )}
        {/* Ranked List 4-10 */}
        <div className="rounded-2xl overflow-hidden">
          {restOfList.map((user, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={user.rank}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  backgroundColor: isEven ? 'var(--surface-2)' : 'var(--surface-3)',
                  borderLeft: user.isCurrentUser ? '4px solid var(--ocean-blue)' : '4px solid transparent',
                }}
              >
                <span
                  className="w-8 text-center flex-shrink-0"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: user.isCurrentUser ? 'var(--ocean-blue)' : 'var(--text-secondary)',
                  }}
                >
                  {user.rank}
                </span>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: 'var(--surface-4)' }}
                >
                  {user.avatar}
                </div>
                <p
                  className="flex-1"
                  style={{
                    fontSize: '16px',
                    fontWeight: user.isCurrentUser ? 500 : 400,
                    color: user.isCurrentUser ? 'var(--ocean-blue)' : 'var(--text-primary)',
                  }}
                >
                  {user.nickname}
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {user.points.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
        </div>
      )}
    </div>
  );
}
