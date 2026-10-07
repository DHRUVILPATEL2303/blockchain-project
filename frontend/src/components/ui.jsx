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
    "inline-flex items-center justify-center font-semibold transition-all duration-200 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-[1px]";

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-4 py-2 rounded-lg gap-2",
    lg: "text-sm px-5 py-2.5 rounded-lg gap-2",
  };

  const variants = {
    primary:
      "bg-gradient-to-r from-violet-300 to-cyan-200 text-slate-950 shadow-[0_8px_28px_rgba(108,92,231,.24)] hover:shadow-[0_10px_34px_rgba(108,92,231,.4)] hover:brightness-105",
    secondary:
      "bg-white/[.045] text-slate-100 border border-white/[.10] hover:bg-white/[.09] hover:border-white/[.16]",
    outline:
      "bg-transparent text-slate-200 border border-white/[.15] hover:bg-white/[.06] hover:text-white",
    ghost:
      "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/[.06]",
    success:
      "bg-emerald-400 hover:bg-emerald-300 text-emerald-950",
    danger:
      "bg-rose-500/10 text-rose-200 border border-rose-400/20 hover:bg-rose-500/15",
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
      className={`rounded-2xl border border-white/[.09] bg-slate-950/55 backdrop-blur-xl p-5 shadow-[0_18px_55px_rgba(0,0,0,.2)] transition-all hover:border-white/[.15] ${className}`}
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
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-xl border border-white/[.09] bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-violet-300/60 focus:ring-4 focus:ring-violet-400/10 ${className}`}
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
