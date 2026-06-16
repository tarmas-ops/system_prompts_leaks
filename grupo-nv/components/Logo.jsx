"use client";

/**
 * Grupo NV monogram, rebuilt as a two-tone "N" mark (the official lockup is
 * navy + taupe; on the dark site the navy half becomes white for legibility).
 * Rounded caps echo the official logo's soft stroke terminals.
 */
export function Monogram({ size = 46 }) {
  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 100 110"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M24 90 L24 22 L50 56"
        stroke="#f6f4f0"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 56 L76 90 L76 22"
        stroke="#b7aea3"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Full stacked lockup: monogram + GRUPO NV wordmark + tagline + rule. */
export function LogoLockup() {
  return (
    <div className="lockup">
      <Monogram size={70} />
      <div className="wordmark">
        <span className="grupo">GRUPO</span>
        <span className="nv">NV</span>
      </div>
      <span className="rule" />
      <div className="tagline">Real Estate Private Equity</div>
    </div>
  );
}
