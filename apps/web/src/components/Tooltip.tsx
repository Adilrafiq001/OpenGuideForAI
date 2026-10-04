import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  subtitle?: string;
  shortcut?: string;
  position?: TooltipPosition;
  align?: TooltipAlign;
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export function Tooltip({
  children,
  content,
  subtitle,
  shortcut,
  position = 'top',
  align = 'center',
  delay = 120,
  className = '',
  disabled = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [computedAlign, setComputedAlign] = useState<TooltipAlign>(align);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const showTooltip = () => {
    if (disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Auto-detect boundary collision if align is 'center'
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      if (align === 'center') {
        // If trigger is within 140px of right viewport edge, shift alignment to 'end'
        if (rect.right > viewportWidth - 140) {
          setComputedAlign('end');
        } else if (rect.left < 140) {
          // If trigger is within 140px of left viewport edge, shift alignment to 'start'
          setComputedAlign('start');
        } else {
          setComputedAlign('center');
        }
      } else {
        setComputedAlign(align);
      }
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isVisible) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') hideTooltip();
    }

    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        hideTooltip();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isVisible, hideTooltip]);

  // Position classes & motion offsets with full align awareness
  const getPositionConfig = (pos: TooltipPosition, al: TooltipAlign) => {
    switch (pos) {
      case 'top': {
        const wrapperAlign = 
          al === 'end' ? 'bottom-full right-0 mb-2' :
          al === 'start' ? 'bottom-full left-0 mb-2' :
          'bottom-full left-1/2 -translate-x-1/2 mb-2';
        
        const arrowAlign = 
          al === 'end' ? 'top-full right-5 -mt-1' :
          al === 'start' ? 'top-full left-5 -mt-1' :
          'top-full left-1/2 -translate-x-1/2 -mt-1';

        return {
          wrapper: wrapperAlign,
          initial: { opacity: 0, y: 4, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 3, scale: 0.96 },
          arrow: `${arrowAlign} border-t-[var(--color-border)] border-r-transparent border-b-transparent border-l-transparent`
        };
      }
      case 'bottom': {
        const wrapperAlign = 
          al === 'end' ? 'top-full right-0 mt-2' :
          al === 'start' ? 'top-full left-0 mt-2' :
          'top-full left-1/2 -translate-x-1/2 mt-2';
        
        const arrowAlign = 
          al === 'end' ? 'bottom-full right-5 -mb-1' :
          al === 'start' ? 'bottom-full left-5 -mb-1' :
          'bottom-full left-1/2 -translate-x-1/2 -mb-1';

        return {
          wrapper: wrapperAlign,
          initial: { opacity: 0, y: -4, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -3, scale: 0.96 },
          arrow: `${arrowAlign} border-b-[var(--color-border)] border-r-transparent border-t-transparent border-l-transparent`
        };
      }
      case 'left':
        return {
          wrapper: 'right-full top-1/2 -translate-y-1/2 mr-2',
          initial: { opacity: 0, x: 4, scale: 0.96 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: 3, scale: 0.96 },
          arrow: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-[var(--color-border)] border-t-transparent border-b-transparent border-r-transparent'
        };
      case 'right':
        return {
          wrapper: 'left-full top-1/2 -translate-y-1/2 ml-2',
          initial: { opacity: 0, x: -4, scale: 0.96 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: -3, scale: 0.96 },
          arrow: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-[var(--color-border)] border-t-transparent border-b-transparent border-l-transparent'
        };
    }
  };

  const currentCfg = getPositionConfig(position, computedAlign);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onTouchStart={() => {
        if (!isVisible) {
          showTooltip();
        }
      }}
    >
      {/* Target Children */}
      {React.isValidElement(children) ? (
        React.cloneElement(children as React.ReactElement<{ 'aria-describedby'?: string }>, {
          'aria-describedby': isVisible ? tooltipId : undefined
        })
      ) : (
        <span>{children}</span>
      )}

      {/* Animated Popover */}
      <AnimatePresence>
        {isVisible && !disabled && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={currentCfg.initial}
            animate={currentCfg.animate}
            exit={currentCfg.exit}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className={`absolute z-[160] pointer-events-none whitespace-normal select-none ${currentCfg.wrapper}`}
          >
            <div className="relative px-3 py-1.5 rounded-xl bg-[var(--color-secondary,#141416)]/95 border border-[var(--color-border,rgba(255,255,255,0.15))] text-[var(--color-text-primary,#fff)] text-xs shadow-2xl backdrop-blur-2xl w-max max-w-[240px] sm:max-w-[280px] text-center">
              
              {/* Main Content & Shortcut */}
              <div className="flex items-center justify-center gap-2 font-medium">
                <span className="leading-tight">{content}</span>
                {shortcut && (
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-[var(--color-primary,#09090b)]/80 border border-[var(--color-border,rgba(255,255,255,0.15))] text-[var(--color-accent,#10b981)] shadow-inner shrink-0">
                    {shortcut}
                  </kbd>
                )}
              </div>

              {/* Optional Subtitle / Detail */}
              {subtitle && (
                <div className="text-[10px] text-[var(--color-text-secondary,#a1a1aa)] mt-1 leading-normal text-center break-words">
                  {subtitle}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
