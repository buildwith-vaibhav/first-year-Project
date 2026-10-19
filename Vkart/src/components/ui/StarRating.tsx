export function StarRating({
  rating,
  size = 14,
  showValue = false,
  totalReviews,
  className = "",
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  totalReviews?: number;
  className?: string;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 <= rounded;
          return (
            <svg
              key={i}
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "currentColor" : "none"}
              className={filled ? "text-rust" : "text-ink/20"}
              aria-hidden
            >
              {half ? (
                <>
                  <defs>
                    <linearGradient id={`half-${i}-${size}`}>
                      <stop offset="50%" stopColor="currentColor" className="text-rust" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.2L12 17.8 5.6 21.6l1.7-7.2L1.7 9.5l7.4-.6L12 2z"
                    fill={`url(#half-${i}-${size})`}
                    stroke="currentColor"
                    className="text-ink/20"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                <path
                  d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.2L12 17.8 5.6 21.6l1.7-7.2L1.7 9.5l7.4-.6L12 2z"
                  stroke="currentColor"
                  className={filled ? "text-rust" : "text-ink/20"}
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          );
        })}
      </span>
      {showValue && (
        <span className="font-mono text-xs tabular-nums text-ink-soft/70">
          {rating.toFixed(1)}
          {totalReviews !== undefined && (
            <span className="text-stone"> ({totalReviews})</span>
          )}
        </span>
      )}
    </span>
  );
}
