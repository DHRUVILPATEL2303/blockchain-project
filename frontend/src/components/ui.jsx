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
  const base = "inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-[0.5px]";

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-4 py-2.5 rounded-xl gap-2",
    lg: "text-base px-5 py-3 rounded-xl gap-2.5",
  };

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/25 border border-blue-500/50 hover:shadow-md hover:shadow-blue-500/20",
    secondary:
      "bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 shadow-sm shadow-black/20",
    outline:
      "bg-transparent hover:bg-slate-800/50 text-slate-300 border border-slate-700 hover:text-white",
    ghost:
      "bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200",
    success:
      "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50 shadow-sm shadow-emerald-600/20",
    danger:
      "bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30",
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

export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-xl shadow-black/20 backdrop-blur-md ${
        hover ? "transition-all duration-200 hover:border-slate-700 hover:shadow-black/30" : ""
      } ${className}`}
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
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-xl border border-slate-700/80 bg-[#0d1322] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-rose-400">{error}</p>
      ) : helper ? (
        <p className="mt-1.5 text-xs text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
}

export function Badge({ children, variant = "slate", className = "" }) {
  const variants = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    slate: "bg-slate-800/80 text-slate-300 border-slate-700/60",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        variants[variant] || variants.slate
      } ${className}`}
    >
      {children}
    </span>
  );
}
