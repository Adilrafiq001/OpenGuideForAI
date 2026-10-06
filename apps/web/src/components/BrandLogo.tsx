interface BrandLogoProps {
  className?: string;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ className = '', showBadge = true, size = 'md' }: BrandLogoProps) {
  const iconSize = size === 'sm' ? 'w-6 h-6 text-[10px]' : size === 'lg' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl md:text-2xl';
  const badgeSize = size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none cursor-pointer group ${className}`}>
      {/* High-Craft OG Monogram Icon */}
      <div 
        className={`${iconSize} rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] shadow-sm flex items-center justify-center font-black tracking-tight text-[var(--color-text-primary)] shrink-0 transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:scale-105`}
      >
        <span className="font-mono font-bold tracking-tighter">OG</span>
      </div>

      {/* Brand Text (responsive on viewports >= 390px) */}
      <span className={`hidden min-[390px]:inline ${textSize} font-black tracking-tight text-[var(--color-text-primary)] transition-colors leading-none`}>
        OpenGuide<span className="text-[var(--color-accent)] font-mono">.</span>
      </span>

      {/* Perfectly Aligned Single-Line Pill Badge */}
      {showBadge && (
        <span 
          className={`hidden sm:inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] font-mono font-semibold tracking-wider uppercase whitespace-nowrap leading-none shrink-0 ${badgeSize}`}
        >
          AI STUDIO
        </span>
      )}
    </div>
  );
}
