export default function KhandaIcon({ className = '', size = 24 }) {
  return (
    // <svg
    //   viewBox="0 0 100 100"
    //   width={size}
    //   height={size}
    //   className={className}
    //   fill="currentColor"
    //   aria-label="Khanda"
    //   role="img"
    // >
    //   {/* Chakkar */}
    //   <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="5" />
    //   {/* Central Khanda blade */}
    //   <path d="M50 8 L54 8 L52 42 L56 78 L50 88 L44 78 L48 42 Z" />
    //   {/* Khanda hilt */}
    //   <rect x="46" y="78" width="8" height="10" rx="1" />
    //   <rect x="42" y="86" width="16" height="4" rx="1" />
    //   {/* Left Kirpan */}
    //   <path d="M16 52 C16 30, 26 20, 34 26 L32 32 C26 28, 20 36, 20 52 C20 64, 26 72, 32 68 L34 74 C22 80, 16 68, 16 52 Z" />
    //   {/* Right Kirpan */}
    //   <path d="M84 52 C84 30, 74 20, 66 26 L68 32 C74 28, 80 36, 80 52 C80 64, 74 72, 68 68 L66 74 C78 80, 84 68, 84 52 Z" />
    // </svg>

    <img src="/favicon.jpg" alt="Khanda" className={className} width={size} height={size} />
  );
}
