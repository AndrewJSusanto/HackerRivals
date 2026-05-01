import { useState } from 'react';
import { Button } from '@mui/material';
import { SuccessSnackbar } from './SuccessSnackbar';
import { EmptyState } from './EmptyState';
import { MissionListSkeleton, LeaderboardSkeleton } from './SkeletonLoading';

export function UIStatesDemo() {
  const [missionSnackbar, setMissionSnackbar] = useState(false);
  const [friendSnackbar, setFriendSnackbar] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [showMissionSkeleton, setShowMissionSkeleton] = useState(false);
  const [showLeaderboardSkeleton, setShowLeaderboardSkeleton] = useState(false);

  return (
    <div
      className="min-h-screen w-full pb-16 px-4 py-6"
      style={{ backgroundColor: 'var(--surface-1)' }}
    >
      <h2 className="mb-6">UI States Demo</h2>

      <div className="space-y-6">
        {/* Snackbar Demos */}
        <div>
          <h3 className="mb-3">Snackbars</h3>
          <div className="space-y-2">
            <Button
              fullWidth
              variant="contained"
              onClick={() => setMissionSnackbar(true)}
              sx={{
                backgroundColor: 'var(--ocean-blue)',
                color: '#ffffff',
                textTransform: 'none',
              }}
            >
              Show Mission Complete Snackbar
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setFriendSnackbar(true)}
              sx={{
                backgroundColor: 'var(--ocean-blue)',
                color: '#ffffff',
                textTransform: 'none',
              }}
            >
              Show Friend Connected Snackbar
            </Button>
          </div>
        </div>

        {/* Empty State Demo */}
        <div>
          <h3 className="mb-3">Empty State</h3>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setShowEmptyState(!showEmptyState)}
            sx={{
              borderColor: 'var(--ocean-blue)',
              color: 'var(--ocean-blue)',
              textTransform: 'none',
            }}
          >
            {showEmptyState ? 'Hide' : 'Show'} Empty State
          </Button>
          {showEmptyState && (
            <div
              className="mt-4 rounded-2xl"
              style={{
                backgroundColor: 'var(--surface-2)',
                border: '1px solid var(--border-color)',
              }}
            >
              <EmptyState
                icon="explore_off"
                title="No missions available"
                message="No missions available right now. Check back soon!"
              />
            </div>
          )}
        </div>

        {/* Skeleton Loading Demos */}
        <div>
          <h3 className="mb-3">Skeleton Loading</h3>
          <div className="space-y-2">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowMissionSkeleton(!showMissionSkeleton)}
              sx={{
                borderColor: 'var(--ocean-blue)',
                color: 'var(--ocean-blue)',
                textTransform: 'none',
              }}
            >
              {showMissionSkeleton ? 'Hide' : 'Show'} Mission List Skeleton
            </Button>
            {showMissionSkeleton && (
              <div className="mt-4">
                <MissionListSkeleton />
              </div>
            )}

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowLeaderboardSkeleton(!showLeaderboardSkeleton)}
              sx={{
                borderColor: 'var(--ocean-blue)',
                color: 'var(--ocean-blue)',
                textTransform: 'none',
              }}
            >
              {showLeaderboardSkeleton ? 'Hide' : 'Show'} Leaderboard Skeleton
            </Button>
            {showLeaderboardSkeleton && (
              <div className="mt-4">
                <LeaderboardSkeleton />
              </div>
            )}
          </div>
        </div>

        {/* Locked Mission Demo */}
        <div>
          <h3 className="mb-3">Locked Mission Card</h3>
          <div
            className="rounded-2xl p-5 relative"
            style={{
              backgroundColor: 'var(--surface-3)',
              border: '1px solid var(--border-color)',
              opacity: 0.5,
            }}
          >
            <div className="absolute top-4 right-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--surface-1)' }}
              >
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: '24px', color: 'var(--text-muted)' }}
                >
                  lock
                </span>
              </div>
            </div>

            <div className="flex gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--surface-4)' }}
              >
                <span
                  className="material-symbols-rounded"
                  style={{ color: 'var(--text-muted)', fontSize: '24px' }}
                >
                  corporate_fare
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="leading-tight" style={{ color: 'var(--text-muted)' }}>
                    Sponsor Visit
                  </h3>
                  <span
                    className="px-2 py-1 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: 'rgba(136, 136, 136, 0.15)',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    +300
                  </span>
                </div>
                <p
                  className="mb-3"
                  style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5 }}
                >
                  Visit all 10 sponsor booths in the expo hall
                </p>
                <span
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: 'rgba(136, 136, 136, 0.15)',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                  }}
                >
                  Locked
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Snackbars */}
      <SuccessSnackbar
        open={missionSnackbar}
        message="Mission complete!"
        points={150}
        onClose={() => setMissionSnackbar(false)}
      />
      <SuccessSnackbar
        open={friendSnackbar}
        message="You connected with Alex!"
        points={100}
        onClose={() => setFriendSnackbar(false)}
      />
    </div>
  );
}
