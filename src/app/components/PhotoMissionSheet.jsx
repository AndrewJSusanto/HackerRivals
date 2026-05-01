import { useState } from 'react';
import { Button } from '@mui/material';

export function PhotoMissionSheet({ mission, onClose }) {
  const [photo, setPhoto] = useState(null);

  const handlePhotoUpload = () => {
    console.log('Open camera/file picker');
    setPhoto('uploaded');
  };

  const handleSubmit = () => {
    console.log('Submit photo for mission:', mission.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-[390px] rounded-t-3xl p-6 pb-8 animate-slide-up"
        style={{ backgroundColor: 'var(--surface-2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center mb-4">
          <div
            className="w-12 h-1 rounded-full"
            style={{ backgroundColor: 'var(--border-color)' }}
          />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h2>{mission.title}</h2>
          <span
            className="px-3 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(254, 193, 78, 0.15)',
              color: 'var(--golden-amber)',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            +{mission.points} pts
          </span>
        </div>

        {/* Description */}
        <p className="mb-6" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {mission.description}
        </p>

        {/* Photo Upload Zone */}
        <button
          onClick={handlePhotoUpload}
          className="w-full rounded-2xl p-8 mb-6 transition-colors hover:bg-surface-3"
          style={{
            backgroundColor: 'var(--surface-3)',
            border: '2px dashed var(--border-color)',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--surface-4)' }}
          >
            <span className="material-symbols-rounded" style={{ color: 'var(--ocean-blue)', fontSize: '32px' }}>
              photo_camera
            </span>
          </div>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            {photo ? 'Photo ready to submit' : 'Tap to take photo or upload'}
          </span>
        </button>

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={!photo}
          sx={{
            backgroundColor: 'var(--ocean-blue)',
            color: '#ffffff',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 500,
            padding: '14px',
            borderRadius: '8px',
            minHeight: '48px',
            '&:hover': {
              backgroundColor: '#2F5F8A',
            },
            '&.Mui-disabled': {
              backgroundColor: 'var(--surface-4)',
              color: 'var(--text-muted)',
            },
          }}
        >
          Submit Photo
        </Button>
      </div>
    </div>
  );
}
