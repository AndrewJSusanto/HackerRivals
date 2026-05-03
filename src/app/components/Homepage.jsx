import { useState, useEffect } from 'react';
import { SuccessSnackbar } from './SuccessSnackbar';
import { MeetNewFriendsCard } from './MeetNewFriendsCard';
import api from '../../lib/api';

const TYPE_ICONS = {
  booth: 'corporate_fare',
  quiz: 'quiz',
  photo: 'photo_camera',
  social: 'groups',
};

export function Homepage({ user, userNickname, userAvatar, userRank, onOpenScanner }) {
  console.log(user)
  const totalPoints = user?.total_points ?? 0;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });
  const [missions, setMissions] = useState([]);
  const [missionsLoading, setMissionsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/challenges')
      .then((res) => {
        if (cancelled) return;
        setMissions(res.data?.challenges ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setMissions([]);
      })
      .finally(() => {
        if (!cancelled) setMissionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
              {totalPoints.toLocaleString()} pts
            </h1>
          </div>

          {/* Rank */}
          <p className="text-center" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {userRank ? (
              <>You're ranked <span style={{ color: 'var(--ocean-blue)', fontWeight: 500 }}>#{userRank}</span></>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Loading rank…</span>
            )}
          </p>
        </div>

        {/* Active Missions Section */}
        <div>
          <h3 className="mb-4 px-1">Active Missions</h3>
          {missionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 animate-pulse"
                  style={{
                    backgroundColor: 'var(--surface-3)',
                    border: '1px solid var(--border-color)',
                    height: '140px',
                  }}
                />
              ))}
            </div>
          ) : missions.length === 0 ? (
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                backgroundColor: 'var(--surface-3)',
                border: '1px solid var(--border-color)',
              }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                No active missions right now. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <MeetNewFriendsCard onOpenScanner={onOpenScanner} />
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
                        {TYPE_ICONS[mission.type] || 'flag'}
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
                </div>
              ))}
            </div>
          )}
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
