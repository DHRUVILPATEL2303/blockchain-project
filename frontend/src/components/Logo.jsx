export default function Logo({ size = 26, className = "" }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-300 via-indigo-300 to-cyan-200 text-slate-950 shrink-0 shadow-[0_0_28px_rgba(139,92,246,.38)] ${className}`}
    >
      <svg
        width={Math.round(size * 0.6)}
        height={Math.round(size * 0.6)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}
