export function MeetNewFriendsCard({ onOpenScanner }) {
  return (
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
          {/* <div className="flex items-center justify-between">
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {friendsMetCount} {friendsMetCount === 1 ? 'friend' : 'friends'} met
            </span>
          </div> */}

          <button
            onClick={onOpenScanner}
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
  );
}
