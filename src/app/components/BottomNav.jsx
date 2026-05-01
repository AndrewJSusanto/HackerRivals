export function BottomNav({ activeTab, onTabChange, onScanClick }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'hunt', label: 'Hunt', icon: 'explore' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  const [left, right] = [tabs.slice(0, 2), tabs.slice(2)];

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-16 flex items-center"
      style={{
        backgroundColor: 'var(--surface-2)',
        borderTop: '0.5px solid var(--border-color)',
      }}
    >
      {left.map((tab) => (
        <NavTab
          key={tab.id}
          tab={tab}
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}

      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={onScanClick}
          aria-label="Scan QR"
          className="rounded-full flex items-center justify-center active:scale-95 transition-transform"
          style={{
            width: '52px',
            height: '52px',
            backgroundColor: 'var(--ocean-blue)',
            boxShadow: '0 4px 14px rgba(61, 120, 171, 0.45)',
            minWidth: '44px',
            minHeight: '44px',
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{ color: '#ffffff', fontSize: '28px' }}
          >
            photo_camera
          </span>
        </button>
      </div>

      {right.map((tab) => (
        <NavTab
          key={tab.id}
          tab={tab}
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </nav>
  );
}

function NavTab({ tab, active, onClick }) {
  const color = active ? 'var(--ocean-blue)' : 'var(--text-muted)';
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-1"
      style={{ minWidth: '44px', minHeight: '44px' }}
    >
      <span
        className="material-symbols-rounded transition-colors"
        style={{ fontSize: '24px', color }}
      >
        {tab.icon}
      </span>
      <span
        className="transition-colors"
        style={{ fontSize: '12px', color }}
      >
        {tab.label}
      </span>
    </button>
  );
}
