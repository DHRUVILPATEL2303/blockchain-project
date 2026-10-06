import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium transition select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-[0.5px]";

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-4 py-2 rounded-lg gap-2",
    lg: "text-sm px-5 py-2.5 rounded-lg gap-2",
  };

  const variants = {
    primary:
      "bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold shadow-sm",
    secondary:
      "bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800/80 hover:text-white",
    outline:
      "bg-transparent text-zinc-300 border border-zinc-700/80 hover:bg-zinc-800 hover:text-white",
    ghost:
      "bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
    success:
      "bg-emerald-600 hover:bg-emerald-500 text-white font-medium",
    danger:
      "bg-rose-950/40 text-rose-300 border border-rose-800/50 hover:bg-rose-900/40",
  };

  return (
    <button
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-xl border border-zinc-800 bg-[#111114] p-5 shadow-sm transition-all hover:border-zinc-700/80 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Input({ label, error, helper, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-lg border border-zinc-800 bg-[#0c0c0e] px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500 ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-rose-400">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-xs text-zinc-500">{helper}</p>
      ) : null}
    </div>
  );
}

export function Badge({ children, variant = "zinc", className = "" }) {
  const variants = {
    zinc: "bg-zinc-800 text-zinc-300 border-zinc-700/60",
    emerald: "bg-emerald-950/40 text-emerald-400 border-emerald-800/50",
    amber: "bg-amber-950/40 text-amber-400 border-amber-800/50",
    rose: "bg-rose-950/40 text-rose-400 border-rose-800/50",
    blue: "bg-blue-950/40 text-blue-400 border-blue-800/50",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${
        variants[variant] || variants.zinc
      } ${className}`}
    >
      {children}
    </span>
  );
}
