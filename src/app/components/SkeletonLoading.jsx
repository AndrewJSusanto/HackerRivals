export function LeaderboardSkeleton() {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Your Ranking Banner Skeleton */}
      <div
        className="rounded-2xl p-4 animate-pulse"
        style={{
          backgroundColor: 'var(--surface-2)',
        }}
      >
        <div
          className="h-3 w-32 rounded mb-3"
          style={{ backgroundColor: 'var(--surface-4)' }}
        />
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full"
            style={{ backgroundColor: 'var(--surface-4)' }}
          />
          <div className="flex-1 space-y-2">
            <div
              className="h-4 w-24 rounded"
              style={{ backgroundColor: 'var(--surface-4)' }}
            />
            <div
              className="h-3 w-16 rounded"
              style={{ backgroundColor: 'var(--surface-4)' }}
            />
          </div>
          <div className="space-y-2">
            <div
              className="h-5 w-16 rounded"
              style={{ backgroundColor: 'var(--surface-4)' }}
            />
            <div
              className="h-3 w-12 rounded"
              style={{ backgroundColor: 'var(--surface-4)' }}
            />
          </div>
        </div>
      </div>

      {/* Podium Skeleton */}
      <div className="flex items-end justify-center gap-3 pb-8">
        {[60, 80, 50].map((height, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center animate-pulse">
            <div
              className="w-16 h-16 rounded-full mb-2"
              style={{ backgroundColor: 'var(--surface-3)' }}
            />
            <div
              className="h-4 w-20 rounded mb-2"
              style={{ backgroundColor: 'var(--surface-3)' }}
            />
            <div
              className="h-4 w-16 rounded mb-2"
              style={{ backgroundColor: 'var(--surface-3)' }}
            />
            <div
              className="w-full rounded-t-lg"
              style={{
                backgroundColor: 'var(--surface-3)',
                height: `${height}px`,
              }}
            />
          </div>
        ))}
      </div>

      {/* List Skeleton */}
      <div className="rounded-2xl overflow-hidden">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-4 py-3 animate-pulse"
            style={{
              backgroundColor: idx % 2 === 0 ? 'var(--surface-2)' : 'var(--surface-3)',
            }}
          >
            <div
              className="w-8 h-4 rounded"
              style={{ backgroundColor: 'var(--surface-4)' }}
            />
            <div
              className="w-10 h-10 rounded-full"
              style={{ backgroundColor: 'var(--surface-4)' }}
            />
            <div
              className="flex-1 h-4 rounded"
              style={{ backgroundColor: 'var(--surface-4)' }}
            />
            <div
              className="w-16 h-4 rounded"
              style={{ backgroundColor: 'var(--surface-4)' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MissionListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl p-5 animate-pulse"
          style={{
            backgroundColor: 'var(--surface-3)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="flex gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: 'var(--surface-4)' }}
            />
            <div className="flex-1 space-y-2">
              <div
                className="h-5 w-3/4 rounded"
                style={{ backgroundColor: 'var(--surface-4)' }}
              />
              <div
                className="h-4 w-full rounded"
                style={{ backgroundColor: 'var(--surface-4)' }}
              />
              <div
                className="h-3 w-20 rounded"
                style={{ backgroundColor: 'var(--surface-4)' }}
              />
            </div>
          </div>
          <div
            className="h-10 w-full rounded-lg"
            style={{ backgroundColor: 'var(--surface-4)' }}
          />
        </div>
      ))}
    </div>
  );
}
