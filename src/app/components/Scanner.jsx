import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../../lib/api';

const READER_ID = 'hr-qr-reader';

function humanizeCameraError(err) {
  const name = err?.name || '';
  const msg = err?.message || '';
  if (name === 'NotAllowedError' || /permission|denied/i.test(msg)) {
    return 'Camera permission denied. Enable camera access for this site in your browser settings, then try again.';
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return 'No suitable camera found on this device.';
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'Camera is already in use by another app or tab.';
  }
  if (name === 'SecurityError') {
    return 'Camera blocked — the page must be served over HTTPS.';
  }
  return msg || 'Could not access camera';
}

export function Scanner({ onClose, userId, onPairSuccess, onChallengeFound }) {
  const scannerRef = useRef(null);
  const [status, setStatus] = useState('scanning'); // scanning | processing | error
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status !== 'scanning') return;
    let cancelled = false;
    let scanner;

    const start = async () => {
      if (!window.isSecureContext) {
        setError('Camera requires a secure connection. Open this page over HTTPS (or localhost).');
        setStatus('error');
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Your browser does not support camera access.');
        setStatus('error');
        return;
      }

      try {
        const probe = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        probe.getTracks().forEach((t) => t.stop());
        if (cancelled) return;

        const cameras = await Html5Qrcode.getCameras();
        if (cancelled) return;
        if (!cameras?.length) {
          setError('No camera found on this device.');
          setStatus('error');
          return;
        }

        const rear =
          cameras.find((c) => /back|rear|environment/i.test(c.label)) ||
          cameras[cameras.length - 1];

        scanner = new Html5Qrcode(READER_ID);
        scannerRef.current = scanner;

        await scanner.start(
          rear.id,
          { fps: 10, qrbox: { width: 260, height: 260 } },
          async (decodedText) => {
            try { await scanner.stop(); } catch {}
            handleDecoded(decodedText);
          },
          () => {}
        );
      } catch (err) {
        if (cancelled) return;
        setError(humanizeCameraError(err));
        setStatus('error');
      }
    };

    start();

    return () => {
      cancelled = true;
      if (scanner?.isScanning) scanner.stop().catch(() => {});
    };
  }, [status]);

  const handleDecoded = async (token) => {
    setStatus('processing');
    try {
      const { data } = await api.post('/scan', { token, userId });
      if (data.type === 'pair') {
        onPairSuccess?.(data);
      } else {
        onChallengeFound?.(data);
      }
      onClose?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid QR code');
      setStatus('error');
    }
  };

  const restart = () => {
    setError(null);
    setStatus('scanning');
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full" style={{ backgroundColor: '#000' }}>
      <style>{`
        #${READER_ID} { width: 100% !important; height: 100% !important; }
        #${READER_ID} video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
        }
      `}</style>
      <div id={READER_ID} className="absolute inset-0" />

      {status === 'scanning' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute top-0 left-0 right-0 bg-black/70" style={{ height: 'calc(50% - 140px)' }} />
            <div className="absolute left-0 bg-black/70" style={{ top: 'calc(50% - 140px)', bottom: 'calc(50% - 140px)', width: 'calc(50% - 140px)' }} />
            <div className="absolute right-0 bg-black/70" style={{ top: 'calc(50% - 140px)', bottom: 'calc(50% - 140px)', width: 'calc(50% - 140px)' }} />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70" style={{ height: 'calc(50% - 140px)' }} />
          </div>

          <h3
            className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none"
            style={{ color: '#fff', top: 'calc(50% - 180px)' }}
          >
            Scan a QR Code
          </h3>

          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: '280px', height: '280px' }}
          >
            <div className="absolute top-0 left-0 animate-pulse" style={{ width: '40px', height: '40px', borderTop: '4px solid var(--ocean-blue)', borderLeft: '4px solid var(--ocean-blue)', borderTopLeftRadius: '8px' }} />
            <div className="absolute top-0 right-0 animate-pulse" style={{ width: '40px', height: '40px', borderTop: '4px solid var(--ocean-blue)', borderRight: '4px solid var(--ocean-blue)', borderTopRightRadius: '8px' }} />
            <div className="absolute bottom-0 left-0 animate-pulse" style={{ width: '40px', height: '40px', borderBottom: '4px solid var(--ocean-blue)', borderLeft: '4px solid var(--ocean-blue)', borderBottomLeftRadius: '8px' }} />
            <div className="absolute bottom-0 right-0 animate-pulse" style={{ width: '40px', height: '40px', borderBottom: '4px solid var(--ocean-blue)', borderRight: '4px solid var(--ocean-blue)', borderBottomRightRadius: '8px' }} />
          </div>

          <p
            className="absolute left-1/2 -translate-x-1/2 text-center max-w-xs pointer-events-none px-6"
            style={{ color: '#E8E8E8', fontSize: '14px', lineHeight: 1.5, top: 'calc(50% + 160px)' }}
          >
            Point your camera at an attendee's code or a mission QR
          </p>
        </>
      )}

      {status === 'processing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3">
          <div
            className="w-10 h-10 border-2 rounded-full animate-spin"
            style={{ borderColor: 'var(--ocean-blue)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: '#E8E8E8', fontSize: '14px' }}>Reading code...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 px-6 text-center">
          <h3 className="mb-3" style={{ color: '#ff6b6b' }}>{error}</h3>
          <div className="mt-4 flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={restart}
              className="py-3 rounded-xl"
              style={{ backgroundColor: 'var(--ocean-blue)', color: '#fff', fontWeight: 500 }}
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="py-3 rounded-xl"
              style={{ backgroundColor: 'transparent', color: '#E8E8E8', border: '1px solid #444' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        aria-label="Close scanner"
        className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', minWidth: '44px', minHeight: '44px' }}
      >
        <span className="material-symbols-rounded" style={{ color: '#fff', fontSize: '24px' }}>close</span>
      </button>
    </div>
  );
}
