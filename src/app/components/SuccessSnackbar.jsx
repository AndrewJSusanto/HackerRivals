import { Snackbar } from '@mui/material';

export function SuccessSnackbar({ open, message, points, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        bottom: '80px !important',
        '& .MuiSnackbarContent-root': {
          backgroundColor: 'var(--ocean-blue)',
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: 500,
          borderRadius: '12px',
          padding: '12px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        },
      }}
      message={
        <div className="flex items-center gap-2">
          <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>
            check_circle
          </span>
          <span>
            {message}
            {points && (
              <span style={{ color: 'var(--golden-amber)', marginLeft: '4px' }}>
                +{points} pts
              </span>
            )}
          </span>
        </div>
      }
    />
  );
}
