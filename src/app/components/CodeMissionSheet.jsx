import { useState } from 'react';
import { TextField, Button } from '@mui/material';

export function CodeMissionSheet({ mission, onClose }) {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    console.log('Submit code for mission:', mission.id, code);
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

        {/* Code Input Field */}
        <div className="mb-6">
          <TextField
            fullWidth
            variant="outlined"
            label="Enter code here"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--surface-3)',
                color: 'var(--text-primary)',
                fontSize: '18px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                '& fieldset': {
                  borderColor: 'var(--border-color)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--ocean-blue)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--ocean-blue)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-secondary)',
                '&.Mui-focused': {
                  color: 'var(--ocean-blue)',
                },
              },
              '& input': {
                padding: '16px 14px',
              },
            }}
          />
        </div>

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={!code.trim()}
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
          Submit Code
        </Button>
      </div>
    </div>
  );
}
