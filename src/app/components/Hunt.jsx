import { useState, useEffect } from 'react';
import { Chip } from '@mui/material';
import { PhotoMissionSheet } from './PhotoMissionSheet';
import { CodeMissionSheet } from './CodeMissionSheet';
import { EmptyState } from './EmptyState';
import { SuccessSnackbar } from './SuccessSnackbar';
import { MissionListSkeleton } from './SkeletonLoading';
import api from '../../lib/api';

const TYPE_ICONS = {
  booth: 'corporate_fare',
  quiz: 'quiz',
  photo: 'photo_camera',
  social: 'groups',
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'booth', label: 'Booth' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'photo', label: 'Photo' },
  { id: 'social', label: 'Social' },
];

export function Hunt() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMission, setSelectedMission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

  useEffect(() => {
    let cancelled = false;
    api
      .get('/challenges')
      .then((res) => {
        if (cancelled) return;
        const challenges = res.data?.challenges ?? [];
        setMissions(
          challenges.map((c) => ({
            ...c,
            icon: TYPE_ICONS[c.type] || 'flag',
            status: 'available',
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setMissions([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filters = FILTERS;

  const filteredMissions = missions.filter((mission) => {
    if (selectedFilter === 'all') return true;
    return mission.type === selectedFilter;
  });

  const getStatusChip = (status) => {
    const styles = {
      available: {
        bg: 'rgba(61, 120, 171, 0.15)',
        color: 'var(--ocean-blue)',
        label: 'Available',
      },
      completed: {
        bg: 'rgba(46, 204, 113, 0.15)',
        color: '#2ECC71',
        label: 'Completed',
      },
      locked: {
        bg: 'rgba(136, 136, 136, 0.15)',
        color: 'var(--text-muted)',
        label: 'Locked',
      },
    };

    const style = styles[status];

    return (
      <span
        className="px-3 py-1 rounded-full text-xs"
        style={{
          backgroundColor: style.bg,
          color: style.color,
          fontWeight: 500,
        }}
      >
        {style.label}
      </span>
    );
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
        <h2>Hunt</h2>
      </header>

      {/* Filter Chips */}
      <div
        className="sticky top-14 z-30 px-4 py-3 overflow-x-auto"
        style={{
          backgroundColor: 'var(--surface-1)',
          borderBottom: '0.5px solid var(--border-color)',
        }}
      >
        <div className="flex gap-2">
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter.id;
            return (
              <Chip
                key={filter.id}
                label={filter.label}
                onClick={() => setSelectedFilter(filter.id)}
                sx={{
                  backgroundColor: isSelected
                    ? 'var(--ocean-blue)'
                    : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${
                    isSelected ? 'var(--ocean-blue)' : 'var(--border-color)'
                  }`,
                  fontWeight: 500,
                  fontSize: '14px',
                  minHeight: '36px',
                  '&:hover': {
                    backgroundColor: isSelected
                      ? 'var(--ocean-blue)'
                      : 'var(--surface-3)',
                  },
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Persistent Meet Friends Card */}
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
                className="inline-block px-3 py-1 rounded-full text-xs"
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

          <button
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

        {/* Mission Cards */}
        {isLoading ? (
          <MissionListSkeleton />
        ) : filteredMissions.length === 0 ? (
          <EmptyState
            icon="explore_off"
            title="No missions available"
            message="No missions available right now. Check back soon!"
          />
        ) : (
          <div className="space-y-3">
            {filteredMissions.map((mission) => (
              <button
                key={mission.id}
                onClick={() => mission.status !== 'locked' && setSelectedMission(mission)}
                className="w-full rounded-2xl p-5 text-left transition-opacity relative"
                style={{
                  backgroundColor: 'var(--surface-3)',
                  border: '1px solid var(--border-color)',
                  opacity: mission.status === 'locked' ? 0.5 : 1,
                }}
                disabled={mission.status === 'locked'}
              >
                {/* Lock Icon Overlay */}
                {mission.status === 'locked' && (
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
                )}

                <div className="flex gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--surface-4)' }}
                  >
                    <span
                      className="material-symbols-rounded"
                      style={{
                        color: mission.status === 'locked' ? 'var(--text-muted)' : 'var(--ocean-blue)',
                        fontSize: '24px',
                      }}
                    >
                      {mission.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        className="leading-tight"
                        style={{
                          color: mission.status === 'locked' ? 'var(--text-muted)' : 'var(--text-primary)',
                        }}
                      >
                        {mission.title}
                      </h3>
                      <span
                        className="px-2 py-1 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            mission.status === 'locked'
                              ? 'rgba(136, 136, 136, 0.15)'
                              : 'rgba(254, 193, 78, 0.15)',
                          color: mission.status === 'locked' ? 'var(--text-muted)' : 'var(--golden-amber)',
                          fontSize: '12px',
                          fontWeight: 500,
                        }}
                      >
                        +{mission.points}
                      </span>
                    </div>
                    <p
                      className="mb-3"
                      style={{
                        color: mission.status === 'locked' ? 'var(--text-muted)' : 'var(--text-secondary)',
                        fontSize: '14px',
                        lineHeight: 1.5,
                      }}
                    >
                      {mission.description}
                    </p>
                    {getStatusChip(mission.status)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mission Bottom Sheets */}
      {selectedMission?.type === 'photo' && (
        <PhotoMissionSheet
          mission={selectedMission}
          onClose={() => {
            setSelectedMission(null);
            setSnackbar({
              open: true,
              message: 'Mission complete!',
              points: selectedMission.points,
            });
          }}
        />
      )}
      {(selectedMission?.type === 'booth' || selectedMission?.type === 'quiz') && (
        <CodeMissionSheet
          mission={selectedMission}
          onClose={() => {
            setSelectedMission(null);
            setSnackbar({
              open: true,
              message: 'Mission complete!',
              points: selectedMission.points,
            });
          }}
        />
      )}

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
