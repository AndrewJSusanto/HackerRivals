import { useState } from 'react';
import { LinearProgress } from '@mui/material';
import { SuccessSnackbar } from './SuccessSnackbar';

export function Homepage({ userNickname, userAvatar }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });
  const missions = [
    {
      id: 1,
      icon: 'forum',
      title: 'Attend a Workshop',
      description: 'Join any session in the Innovation Track',
      points: 150,
    },
    {
      id: 2,
      icon: 'corporate_fare',
      title: 'Visit 3 Sponsor Booths',
      description: 'Chat with sponsors and learn about their products',
      points: 200,
    },
    {
      id: 3,
      icon: 'share',
      title: 'Share on Social',
      description: 'Post about Cloud Summit with #CloudSummit2026',
      points: 75,
    },
  ];

  const friendsMet = [
    { avatar: '🎯' },
    { avatar: '🚀' },
    { avatar: '⚡' },
  ];

  return (
    <div
      className="min-h-screen w-full pb-16"
      style={{ backgroundColor: 'var(--surface-1)' }}
    >
      {/* Top App Bar */}
      <header
        className="sticky top-0 z-40 w-full px-4 py-3 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--surface-1)',
          borderBottom: '0.5px solid var(--border-color)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-rounded" style={{ color: 'var(--ocean-blue)', fontSize: '24px' }}>
            cloud
          </span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}
          >
            Cloud Summit
          </span>
        </div>
        <button
          className="p-2 rounded-full hover:bg-surface-3 transition-colors"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <span className="material-symbols-rounded" style={{ color: 'var(--text-secondary)' }}>
            notifications
          </span>
        </button>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Hero Points Card */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{
            backgroundColor: 'var(--surface-2)',
          }}
        >
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: 'var(--surface-3)' }}
            >
              {userAvatar}
            </div>
            <div className="flex-1">
              <h3 className="mb-1">{userNickname}</h3>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: 'rgba(61, 120, 171, 0.15)',
                  color: 'var(--ocean-blue)',
                  fontWeight: 500,
                }}
              >
                Attendee
              </span>
            </div>
          </div>

          {/* Points Display */}
          <div className="text-center py-3">
            <h1
              className="mb-1"
              style={{
                color: 'var(--golden-amber)',
                fontSize: '40px',
                fontWeight: 500,
              }}
            >
              1,240 pts
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                260 pts to Gold Tier
              </span>
            </div>
            <LinearProgress
              variant="determinate"
              value={65}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'var(--surface-4)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'var(--ocean-blue)',
                  borderRadius: 4,
                },
              }}
            />
          </div>

          {/* Rank */}
          <p className="text-center" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            You're ranked <span style={{ color: 'var(--ocean-blue)', fontWeight: 500 }}>#14</span>
          </p>
        </div>

        {/* Meet Friends Card */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{
            backgroundColor: 'var(--surface-3)',
            borderLeft: '4px solid var(--ocean-blue)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--surface-4)' }}
            >
              <span className="material-symbols-rounded" style={{ color: 'var(--ocean-blue)', fontSize: '24px' }}>
                handshake
              </span>
            </div>
            <div className="flex-1">
              <h3 className="mb-2">Meet Friends</h3>
              <p className="mb-3" style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
                Scan another attendee's QR code to connect and earn points
              </p>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs mb-3"
                style={{
                  backgroundColor: 'rgba(254, 193, 78, 0.15)',
                  color: 'var(--golden-amber)',
                  fontWeight: 500,
                }}
              >
                +100 pts per friend
              </span>
            </div>
          </div>

          {/* Friends Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {friendsMet.length} friends met
              </span>
              <div className="flex -space-x-2">
                {friendsMet.map((friend, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                    style={{
                      backgroundColor: 'var(--surface-4)',
                      borderColor: 'var(--surface-3)',
                      fontSize: '16px',
                    }}
                  >
                    {friend.avatar}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              setSnackbar({
                open: true,
                message: 'You connected with Taylor!',
                points: 100,
              })
            }
            className="w-full py-3 rounded-lg transition-colors"
            style={{
              backgroundColor: 'rgba(61, 120, 171, 0.15)',
              color: 'var(--ocean-blue)',
              fontWeight: 500,
              minHeight: '44px',
            }}
          >
            Scan a Friend
          </button>
        </div>

        {/* Active Missions Section */}
        <div>
          <h3 className="mb-4 px-1">Active Missions</h3>
          <div className="space-y-3">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: 'var(--surface-3)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div className="flex gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--surface-4)' }}
                  >
                    <span className="material-symbols-rounded" style={{ color: 'var(--ocean-blue)', fontSize: '24px' }}>
                      {mission.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="leading-tight">{mission.title}</h3>
                      <span
                        className="px-2 py-1 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: 'rgba(254, 193, 78, 0.15)',
                          color: 'var(--golden-amber)',
                          fontSize: '12px',
                          fontWeight: 500,
                        }}
                      >
                        +{mission.points}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
                      {mission.description}
                    </p>
                  </div>
                </div>
                <button
                  className="w-full py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'rgba(61, 120, 171, 0.15)',
                    color: 'var(--ocean-blue)',
                    fontWeight: 500,
                    minHeight: '44px',
                  }}
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Snackbar */}
      <SuccessSnackbar
        open={snackbar.open}
        message={snackbar.message}
        points={snackbar.points}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
    </div>
  );
}
