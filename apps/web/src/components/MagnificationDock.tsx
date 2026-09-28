/**
 * MagnificationDock Component
 * 
 * A premium macOS-inspired dock component with fluid magnification effects, 
 * spring physics, and tooltips. Built with Framer Motion.
 * Completely stabilized: zero vertical jumping on hover.
 */

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence
} from 'framer-motion';
import React, { Children, cloneElement, useEffect, useRef, useState } from 'react';

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
};

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return distance + 10;
    return val - (rect.x + rect.width / 2);
  });

  const maxScale = magnification / baseItemSize;
  const targetScale = useTransform(mouseDistance, [-distance, 0, distance], [1, maxScale, 1]);
  const scale = useSpring(targetScale, spring);

  const targetY = useTransform(mouseDistance, [-distance, 0, distance], [0, -8, 0]);
  const y = useSpring(targetY, spring);

  return (
    <div
      ref={ref}
      style={{ width: baseItemSize, height: baseItemSize }}
      className="relative flex items-end justify-center shrink-0 select-none"
    >
      <motion.div
        style={{
          width: baseItemSize,
          height: baseItemSize,
          scale,
          y,
          transformOrigin: 'bottom center'
        }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        onClick={onClick}
        className={`relative flex items-center justify-center rounded-full bg-[var(--color-primary)]/80 hover:bg-[var(--color-secondary)] border-[var(--color-border)] border shadow-md cursor-pointer hover:border-[var(--color-accent)] hover:shadow-lg transition-all ${className}`}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
      >
        {Children.map(children, child =>
          React.isValidElement(child)
            ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
            : child
        )}
      </motion.div>
    </div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: -16, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={`${className} absolute -top-9 left-1/2 w-fit whitespace-pre rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] px-3 py-1 text-[11px] font-bold text-[var(--color-text-primary)] shadow-2xl pointer-events-none z-50 backdrop-blur-xl`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = '' }: DockIconProps) {
  return <div className={`flex items-center justify-center text-[var(--color-text-primary)] pointer-events-none ${className}`}>{children}</div>;
}

export function MagnificationDock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 280, damping: 22 },
  magnification = 68,
  distance = 150,
  panelHeight = 64,
  baseItemSize = 48
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="flex max-w-[calc(100vw-1.5rem)] items-end justify-center pointer-events-auto h-[96px] pt-8 pb-3 overflow-visible">
      <motion.div
        onMouseMove={(e) => {
          mouseX.set(e.clientX);
        }}
        onMouseLeave={() => {
          mouseX.set(Infinity);
        }}
        className={`${className} flex items-end w-fit gap-2 sm:gap-2.5 rounded-[2.2rem] border border-[var(--color-border)] bg-[var(--color-secondary)]/90 backdrop-blur-2xl p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-visible`}
        style={{ minHeight: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </div>
  );
}

export default MagnificationDock;
