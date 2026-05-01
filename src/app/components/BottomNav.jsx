export function BottomNav({ activeTab, onTabChange, onScanClick }) {

  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'hunt', label: 'Hunt', icon: 'explore' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-[390px] w-full flex justify-center">
        <button
          onClick={onScanClick}
          className="flex flex-col items-center gap-1 group"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            style={{ backgroundColor: 'var(--ocean-blue)' }}
          >
            <span className="material-symbols-rounded text-white">photo_camera</span>
          </div>
          <span className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            Scan
          </span>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-16 flex items-center justify-around"
        style={{
          backgroundColor: 'var(--surface-2)',
          borderTop: '0.5px solid var(--border-color)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center gap-1 flex-1"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <span
                className="material-symbols-rounded transition-colors"
                style={{
                  fontSize: '24px',
                  color: isActive ? 'var(--ocean-blue)' : 'var(--text-muted)',
                }}
              >
                {tab.icon}
              </span>
              <span
                className="text-caption transition-colors"
                style={{
                  fontSize: '12px',
                  color: isActive ? 'var(--ocean-blue)' : 'var(--text-muted)',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
