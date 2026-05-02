import { useState } from 'react';
import { TextField, Button } from '@mui/material';

const avatarOptions = [
  { id: 1, emoji: '🌊', color: '#4A90E2' },
  { id: 2, emoji: '🎯', color: '#E94B3C' },
  { id: 3, emoji: '🚀', color: '#9B59B6' },
  { id: 4, emoji: '⚡', color: '#F39C12' },
  { id: 5, emoji: '🎨', color: '#1ABC9C' },
  { id: 6, emoji: '🎭', color: '#E84393' },
  { id: 7, emoji: '🎪', color: '#00B894' },
  { id: 8, emoji: '🎬', color: '#6C5CE7' },
  { id: 9, emoji: '🎸', color: '#FD79A8' },
  { id: 10, emoji: '🎲', color: '#FDCB6E' },
];

export function Onboarding({ onComplete, error }) {
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleJoin = () => {
    if (nickname && selectedAvatar !== null) {
      const emoji = avatarOptions.find((a) => a.id === selectedAvatar)?.emoji;
      onComplete?.({ nickname, emoji });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-6 py-12"
      style={{ backgroundColor: 'var(--surface-1)' }}
    >
      {/* Cloud Summit Wordmark */}
      <div className="mt-8 mb-12">
        <div
          className="px-6 py-3 rounded-lg"
          style={{
            backgroundColor: 'var(--surface-3)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded" style={{ color: 'var(--ocean-blue)', fontSize: '28px' }}>
              cloud
            </span>
            <span
              className="tracking-wide"
              style={{
                fontSize: '24px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              CLOUD SUMMIT
            </span>
          </div>
        </div>
      </div>

      {/* Welcome Text */}
      <h2 className="text-center mb-3">Welcome to Cloud Summit</h2>
      <p className="text-center mb-10" style={{ color: 'var(--text-secondary)' }}>
        Choose a nickname and pick your avatar to get started
      </p>

      {/* Nickname Input */}
      <div className="w-full mb-8">
        <TextField
          fullWidth
          variant="outlined"
          label="Your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'var(--surface-2)',
              color: 'var(--text-primary)',
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
          }}
        />
      </div>

      {/* Avatar Picker */}
      <div className="w-full mb-10">
        <p className="mb-4" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Select your avatar
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
          {avatarOptions.map((avatar) => {
            const isSelected = selectedAvatar === avatar.id;
            return (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className="flex-shrink-0 rounded-full transition-all"
                style={{
                  width: '64px',
                  height: '64px',
                  minWidth: '64px',
                  backgroundColor: 'var(--surface-3)',
                  border: isSelected
                    ? '3px solid var(--ocean-blue)'
                    : '2px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  boxShadow: isSelected ? '0 0 0 2px rgba(61, 120, 171, 0.2)' : 'none',
                }}
              >
                {avatar.emoji}
              </button>
            );
          })}
        </div>
      </div>

      {/* Join Button */}
      <div className="w-full mt-auto">
        {error && (
          <p
            className="text-center mb-3"
            style={{ color: '#ff6b6b', fontSize: '14px' }}
          >
            {error}
          </p>
        )}
        <Button
          fullWidth
          variant="contained"
          onClick={handleJoin}
          disabled={!nickname || selectedAvatar === null}
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
            '&:focus-visible': {
              outline: '2px solid var(--ocean-blue)',
              outlineOffset: '2px',
            },
          }}
        >
          Join the Hunt
        </Button>
        <p
          className="text-center mt-3"
          style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
          }}
        >
          By joining you agree to the event community guidelines
        </p>
      </div>
    </div>
  );
}
