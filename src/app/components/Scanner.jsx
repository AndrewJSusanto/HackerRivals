import { Button } from '@mui/material';

export function Scanner({ onClose, onScanFriend, onScanMission }) {
  return (
    <div className="fixed inset-0 z-50 w-full h-full" style={{ backgroundColor: '#000000' }}>
      {/* Camera Viewfinder Simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Simulated camera feed placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="material-symbols-rounded" style={{ fontSize: '120px', color: '#666666' }}>
            photo_camera
          </span>
        </div>
      </div>

      {/* Dark Overlay with Cut-out */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Top overlay */}
        <div className="absolute top-0 left-0 right-0 bg-black/70" style={{ height: 'calc(50% - 140px)' }} />

        {/* Left overlay */}
        <div className="absolute left-0 bg-black/70" style={{ top: 'calc(50% - 140px)', bottom: 'calc(50% - 140px)', width: 'calc(50% - 140px)' }} />

        {/* Right overlay */}
        <div className="absolute right-0 bg-black/70" style={{ top: 'calc(50% - 140px)', bottom: 'calc(50% - 140px)', width: 'calc(50% - 140px)' }} />

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70" style={{ height: 'calc(50% - 140px)' }} />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          minWidth: '44px',
          minHeight: '44px',
        }}
      >
        <span className="material-symbols-rounded" style={{ color: '#ffffff', fontSize: '24px' }}>
          close
        </span>
      </button>

      {/* Scan Frame and Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        {/* Title Above Frame */}
        <h3 className="mb-6 text-center" style={{ color: '#ffffff' }}>
          Scan a QR Code
        </h3>

        {/* Scan Frame */}
        <div className="relative mb-6" style={{ width: '280px', height: '280px' }}>
          {/* Animated Corner Brackets */}
          {/* Top-left corner */}
          <div
            className="absolute top-0 left-0 animate-pulse"
            style={{
              width: '40px',
              height: '40px',
              borderTop: '4px solid var(--ocean-blue)',
              borderLeft: '4px solid var(--ocean-blue)',
              borderTopLeftRadius: '8px',
            }}
          />

          {/* Top-right corner */}
          <div
            className="absolute top-0 right-0 animate-pulse"
            style={{
              width: '40px',
              height: '40px',
              borderTop: '4px solid var(--ocean-blue)',
              borderRight: '4px solid var(--ocean-blue)',
              borderTopRightRadius: '8px',
            }}
          />

          {/* Bottom-left corner */}
          <div
            className="absolute bottom-0 left-0 animate-pulse"
            style={{
              width: '40px',
              height: '40px',
              borderBottom: '4px solid var(--ocean-blue)',
              borderLeft: '4px solid var(--ocean-blue)',
              borderBottomLeftRadius: '8px',
            }}
          />

          {/* Bottom-right corner */}
          <div
            className="absolute bottom-0 right-0 animate-pulse"
            style={{
              width: '40px',
              height: '40px',
              borderBottom: '4px solid var(--ocean-blue)',
              borderRight: '4px solid var(--ocean-blue)',
              borderBottomRightRadius: '8px',
            }}
          />

          {/* Scanning line animation */}
          <div
            className="absolute left-0 right-0 h-1 animate-scan"
            style={{
              top: '50%',
              backgroundColor: 'var(--ocean-blue)',
              boxShadow: '0 0 20px rgba(61, 120, 171, 0.8)',
            }}
          />
        </div>

        {/* Instruction Text Below Frame */}
        <p className="mb-8 text-center max-w-xs" style={{ color: '#E8E8E8', fontSize: '14px', lineHeight: 1.5 }}>
          Point your camera at an attendee's code or a mission QR
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-xs space-y-3">
          <Button
            fullWidth
            variant="outlined"
            onClick={onScanFriend}
            sx={{
              borderColor: 'var(--ocean-blue)',
              color: 'var(--ocean-blue)',
              backgroundColor: 'rgba(61, 120, 171, 0.1)',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              padding: '12px',
              borderRadius: '8px',
              minHeight: '48px',
              '&:hover': {
                backgroundColor: 'rgba(61, 120, 171, 0.2)',
                borderColor: 'var(--ocean-blue)',
              },
            }}
          >
            Scan Friend's Code
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={onScanMission}
            sx={{
              borderColor: 'var(--ocean-blue)',
              color: 'var(--ocean-blue)',
              backgroundColor: 'rgba(61, 120, 171, 0.1)',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              padding: '12px',
              borderRadius: '8px',
              minHeight: '48px',
              '&:hover': {
                backgroundColor: 'rgba(61, 120, 171, 0.2)',
                borderColor: 'var(--ocean-blue)',
              },
            }}
          >
            Scan Mission Code
          </Button>
        </div>
      </div>
    </div>
  );
}
