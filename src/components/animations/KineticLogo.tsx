'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { animate, spring, stagger } from 'animejs';

interface KineticLogoProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

export const KineticLogo: React.FC<KineticLogoProps> = ({
  className = 'h-5 w-5 text-paper-coral',
  size,
  interactive = true,
}) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const ring0Ref = useRef<SVGGElement>(null);
  const ring1Ref = useRef<SVGGElement>(null);
  const ring2Ref = useRef<SVGGElement>(null);
  const coreRef = useRef<SVGCircleElement>(null);

  const isSpinningRef = useRef(false);

  const getRings = useCallback(() => {
    return [ring0Ref.current, ring1Ref.current, ring2Ref.current].filter(Boolean) as SVGGElement[];
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!interactive || isSpinningRef.current) return;
    const rings = getRings();
    if (!rings.length) return;

    const rotations = [60, -45, 30];
    const scales = [1.14, 1.08, 1.03];

    rings.forEach((ring, idx) => {
      animate(ring, {
        rotate: rotations[idx],
        scale: scales[idx],
        duration: 550,
        delay: stagger(40)(ring, idx, rings),
        ease: spring({ bounce: 0.45, duration: 600 }),
      });
    });

    if (coreRef.current) {
      animate(coreRef.current, {
        scale: 1.35,
        duration: 350,
        ease: spring({ bounce: 0.5, duration: 500 }),
      });
    }
  }, [interactive, getRings]);

  const handleMouseLeave = useCallback(() => {
    if (!interactive || isSpinningRef.current) return;
    const rings = getRings();
    if (!rings.length) return;

    rings.forEach((ring, idx) => {
      animate(ring, {
        rotate: 0,
        scale: 1,
        duration: 450,
        delay: stagger(30, { reversed: true })(ring, idx, rings),
        ease: spring({ bounce: 0.25, duration: 500 }),
      });
    });

    if (coreRef.current) {
      animate(coreRef.current, {
        scale: 1,
        duration: 350,
        ease: spring({ bounce: 0.3, duration: 400 }),
      });
    }
  }, [interactive, getRings]);

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!interactive) return;
      e.stopPropagation();
      isSpinningRef.current = true;

      const rings = getRings();
      if (!rings.length) return;

      const spins = [360, -360, 360];

      rings.forEach((ring, idx) => {
        animate(ring, {
          rotate: `+=${spins[idx]}deg`,
          scale: [
            { to: 1.25, duration: 200, ease: 'easeOutQuad' },
            { to: 1, duration: 600, ease: spring({ bounce: 0.6, duration: 650 }) },
          ],
          delay: stagger(50)(ring, idx, rings),
          onComplete: () => {
            if (idx === rings.length - 1) {
              isSpinningRef.current = false;
            }
          },
        });
      });

      if (coreRef.current) {
        animate(coreRef.current, {
          scale: [
            { to: 1.6, duration: 180, ease: 'easeOutSine' },
            { to: 1, duration: 500, ease: spring({ bounce: 0.55, duration: 600 }) },
          ],
        });
      }
    },
    [interactive, getRings]
  );

  useEffect(() => {
    return () => {
      const rings = getRings();
      rings.forEach((ring) => {
        animate(ring, { rotate: 0, scale: 1, duration: 0 });
      });
    };
  }, [getRings]);

  return (
    <svg
      ref={containerRef}
      className={`${className} cursor-pointer select-none transition-opacity hover:opacity-95`}
      style={size ? { width: size, height: size } : undefined}
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Kinetic Logo"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Center anchor pip */}
      <circle
        ref={coreRef}
        cx="32"
        cy="32"
        r="3"
        fill="currentColor"
        style={{ transformOrigin: '32px 32px' }}
      />

      {/* Innermost ring */}
      <g ref={ring0Ref} style={{ transformOrigin: '32px 32px' }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M32 44.3077C38.7974 44.3077 44.3077 38.7974 44.3077 32C44.3077 25.2027 38.7974 19.6923 32 19.6923C25.2027 19.6923 19.6923 25.2027 19.6923 32C19.6923 38.7974 25.2027 44.3077 32 44.3077ZM41.8462 32C41.8462 37.4379 37.4379 41.8462 32 41.8462C26.5621 41.8462 22.1538 37.4379 22.1538 32C22.1538 26.5621 26.5621 22.1538 32 22.1538C37.4379 22.1538 41.8462 26.5621 41.8462 32Z"
        />
      </g>

      {/* Middle ring */}
      <g ref={ring1Ref} style={{ transformOrigin: '32px 32px' }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M53.3333 32C53.3333 43.7821 43.7821 53.3333 32 53.3333C20.2179 53.3333 10.6667 43.7821 10.6667 32C10.6667 20.2179 20.2179 10.6667 32 10.6667C43.7821 10.6667 53.3333 20.2179 53.3333 32ZM32 49.2308C41.5163 49.2308 49.2308 41.5163 49.2308 32C49.2308 22.4837 41.5163 14.7692 32 14.7692C22.4837 14.7692 14.7692 22.4837 14.7692 32C14.7692 41.5163 22.4837 49.2308 32 49.2308Z"
        />
      </g>

      {/* Outermost ring */}
      <g ref={ring2Ref} style={{ transformOrigin: '32px 32px' }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32ZM32 58.2564C46.501 58.2564 58.2564 46.501 58.2564 32C58.2564 17.499 46.501 5.74359 32 5.74359C17.499 5.74359 5.74359 17.499 5.74359 32C5.74359 46.501 17.499 58.2564 32 58.2564Z"
        />
      </g>
    </svg>
  );
};
