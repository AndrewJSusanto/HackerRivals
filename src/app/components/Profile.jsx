import { QRCodeSVG } from 'qrcode.react';

export function Profile({ user, userNickname, userAvatar, userQrToken, userRank }) {
  const totalPoints = user?.total_points ?? 0;
  const completedChallenges = (user?.completed_challenges ?? []);
  const stats = {
    missionsDone: completedChallenges.length,
    currentRank: userRank ?? '—',
    friendsMet: user?.friends_met?.length ?? 0,
  };

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
        <h2>Profile</h2>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div
            className="w-18 h-18 rounded-full flex items-center justify-center mb-4"
            style={{
              width: '72px',
              height: '72px',
              backgroundColor: 'var(--surface-3)',
              border: '3px solid var(--ocean-blue)',
              fontSize: '40px',
            }}
          >
            {userAvatar}
          </div>
          <h2 className="mb-2">{userNickname}</h2>
          <span
            className="inline-block px-3 py-1 rounded-full mb-4"
            style={{
              backgroundColor: 'rgba(61, 120, 171, 0.15)',
              color: 'var(--ocean-blue)',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Attendee
          </span>
          <h1
            style={{
              color: 'var(--golden-amber)',
              fontSize: '40px',
              fontWeight: 500,
            }}
          >
            {totalPoints.toLocaleString()} pts
          </h1>
        </div>

        {/* Stats Row */}
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p
                className="mb-1"
                style={{
                  fontSize: '24px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                {stats.missionsDone}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Missions Done
              </p>
            </div>
            <div
              className="text-center"
              style={{
                borderLeft: '1px solid var(--border-color)',
                borderRight: '1px solid var(--border-color)',
              }}
            >
              <p
                className="mb-1"
                style={{
                  fontSize: '24px',
                  fontWeight: 500,
                  color: 'var(--ocean-blue)',
                }}
              >
                #{stats.currentRank}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Current Rank
              </p>
            </div>
            <div className="text-center">
              <p
                className="mb-1"
                style={{
                  fontSize: '24px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                {stats.friendsMet}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Friends Met
              </p>
            </div>
          </div>
        </div>

        {/* Completed Missions */}
        <div>
          <h3 className="mb-4 px-1">Completed Missions</h3>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border-color)',
            }}
          >
            {completedChallenges.map((mission, index) => (
              <div
                key={mission.id}
                className="px-4 py-3"
                style={{
                  borderBottom:
                    index < completedChallenges.length - 1
                      ? '0.5px solid var(--border-color)'
                      : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                    {mission.name}
                  </p>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--golden-amber)',
                    }}
                  >
                    +{mission.points}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {mission.completedAt}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* My QR Code */}
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--border-color)',
          }}
        >
          <h3 className="mb-4 text-center">My QR Code</h3>
          <div
            className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center p-6"
            style={{
              backgroundColor: '#ffffff',
              maxWidth: '240px',
              margin: '0 auto',
            }}
          >
            {userQrToken ? (
              <QRCodeSVG
                value={userQrToken}
                size={192}
                level="M"
                includeMargin={false}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <p style={{ fontSize: '12px', color: '#888' }}>QR unavailable</p>
            )}
          </div>
          <p className="text-center" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Let friends scan your code
          </p>
          {userQrToken && (
            <p
              className="text-center mt-1 font-mono"
              style={{ fontSize: '12px', color: 'var(--text-muted)' }}
            >
              {userQrToken}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
