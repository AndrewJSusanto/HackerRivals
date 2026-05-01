export function EmptyState({ icon = 'inbox', title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{
          backgroundColor: 'var(--surface-3)',
          border: '2px solid var(--border-color)',
        }}
      >
        <span
          className="material-symbols-rounded"
          style={{
            fontSize: '48px',
            color: 'var(--text-muted)',
          }}
        >
          {icon}
        </span>
      </div>
      <h3 className="mb-3" style={{ color: 'var(--text-secondary)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', maxWidth: '280px' }}>
        {message}
      </p>
    </div>
  );
}
