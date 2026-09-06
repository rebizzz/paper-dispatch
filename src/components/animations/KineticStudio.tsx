'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  animate,
  createTimeline,
  stagger,
  spring,
  createDraggable,
  scrambleText,
  createDrawable,
  morphTo,
} from 'animejs';
import type { Draggable } from 'animejs';
import {
  Play,
  RotateCcw,
  Sparkles,
  Move,
  PenTool,
  Type,
  Grid3X3,
  Sliders,
  Code2,
  Check,
  Copy,
  ChevronRight,
  Flame,
  Layers,
  Zap,
} from 'lucide-react';

type StudioTab = 'all' | 'physics' | 'svg' | 'scramble' | 'ripple';

interface ChipData {
  id: string;
  name: string;
  physics: string;
  color: string;
  border: string;
  bg: string;
  accent: string;
}

const CHIPS: ChipData[] = [
  {
    id: 'coral',
    name: 'Spring Return',
    physics: 'mass: 1.0, stiffness: 120',
    color: '#f76f53',
    border: 'border-[#f76f53]/40',
    bg: 'bg-[#f76f53]/15',
    accent: 'bg-[#f76f53]',
  },
  {
    id: 'blue',
    name: 'Kinetic Euler',
    physics: 'damping: 12, bounce: 0.55',
    color: '#6287f5',
    border: 'border-[#6287f5]/40',
    bg: 'bg-[#6287f5]/15',
    accent: 'bg-[#6287f5]',
  },
  {
    id: 'green',
    name: 'Damped Vector',
    physics: 'velocityMultiplier: 1.2',
    color: '#63f78b',
    border: 'border-[#63f78b]/40',
    bg: 'bg-[#63f78b]/15',
    accent: 'bg-[#63f78b]',
  },
  {
    id: 'amber',
    name: 'Inertia Snap',
    physics: 'spring({ bounce: 0.5 })',
    color: '#f59e0b',
    border: 'border-[#f59e0b]/40',
    bg: 'bg-[#f59e0b]/15',
    accent: 'bg-[#f59e0b]',
  },
  {
    id: 'purple',
    name: 'Anime.js v4',
    physics: 'createDraggable API',
    color: '#a855f7',
    border: 'border-[#a855f7]/40',
    bg: 'bg-[#a855f7]/15',
    accent: 'bg-[#a855f7]',
  },
];

const SVG_SHAPES = [
  {
    id: 'enso',
    name: 'Kinetic Enso',
    d: 'M 150 25 C 220 25, 265 65, 265 110 C 265 155, 215 185, 150 185 C 85 185, 35 150, 35 105 C 35 60, 80 30, 140 30 C 170 30, 205 38, 225 55',
  },
  {
    id: 'lotus',
    name: 'Sacred Lotus',
    d: 'M 150 175 C 120 155, 85 115, 85 80 C 85 45, 120 30, 150 70 C 180 30, 215 45, 215 80 C 215 115, 180 155, 150 175 Z M 150 175 C 130 135, 110 95, 150 45 C 190 95, 170 135, 150 175 Z',
  },
  {
    id: 'wave',
    name: 'Resonance Wave',
    d: 'M 25 105 C 55 45, 75 45, 100 105 C 125 165, 145 165, 175 105 C 205 45, 225 45, 250 105 C 265 140, 275 140, 285 105',
  },
  {
    id: 'knot',
    name: 'Infinity Knot',
    d: 'M 150 105 C 175 65, 215 65, 240 90 C 265 115, 265 145, 240 170 C 215 195, 175 145, 150 105 C 125 65, 85 15, 60 40 C 35 65, 35 95, 60 120 C 85 145, 125 145, 150 105 Z',
  },
];

const SCRAMBLE_PRESETS = [
  'Breathe into stillness. Physics in motion.',
  'Paper Dispatch: Calm by design, fast by nature.',
  'Anime.js v4: Declarative springs with 60fps physics.',
  'Simplicity is the keynote of all true elegance.',
  'Zero friction interface. Infinite kinetic nuance.',
];

const CHAR_SETS: Record<string, string> = {
  symbols: '!%#_|*+=~^/?$@&',
  blocks: '▀▄█▌▐░▒▓',
  braille: '⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋',
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  binary: '01',
};

export const KineticStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudioTab>('all');
  const [copied, setCopied] = useState<string | null>(null);

  // 1. Draggable Lab State & Refs
  const stageRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const draggablesRef = useRef<Draggable[]>([]);
  const [bounceFactor, setBounceFactor] = useState(0.55);

  // 2. SVG Draw & Morph State & Refs
  const activePathRef = useRef<SVGPathElement>(null);
  const targetEnsoRef = useRef<SVGPathElement>(null);
  const targetLotusRef = useRef<SVGPathElement>(null);
  const targetWaveRef = useRef<SVGPathElement>(null);
  const targetKnotRef = useRef<SVGPathElement>(null);
  const [currentShape, setCurrentShape] = useState<'enso' | 'lotus' | 'wave' | 'knot'>('enso');
  const [strokeColor, setStrokeColor] = useState('#f76f53');
  const [strokeWidth, setStrokeWidth] = useState(3.5);
  const [isDrawing, setIsDrawing] = useState(false);

  // 3. Text Scrambler State & Refs
  const scrambleDisplayRef = useRef<HTMLHeadingElement>(null);
  const [charSetKey, setCharSetKey] = useState<keyof typeof CHAR_SETS>('symbols');
  const [scrambleSpeed, setScrambleSpeed] = useState(900);
  const [customText, setCustomText] = useState('');
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

  // 4. Staggered Ripple Matrix State & Refs
  const gridRef = useRef<HTMLDivElement>(null);
  const [rippleColor, setRippleColor] = useState('#f76f53');
  const [matrixBounce, setMatrixBounce] = useState(0.55);

  // Copy helper
  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // ==========================================
  // LAB 1: Draggable Kinetic Beads
  // ==========================================
  useEffect(() => {
    if (!stageRef.current) return;

    // Clean up any existing draggables
    draggablesRef.current.forEach((d) => {
      try {
        d.revert();
      } catch (_) {}
    });
    draggablesRef.current = [];

    const newDraggables: Draggable[] = [];

    chipRefs.current.forEach((chip) => {
      if (!chip || !stageRef.current) return;

      const d = createDraggable(chip, {
        container: stageRef.current,
        cursor: true,
        releaseMass: 1,
        releaseStiffness: 120,
        releaseDamping: 12,
        releaseEase: spring({ bounce: bounceFactor, duration: 650 }),
        onGrab: (self) => {
          animate(self.$target, {
            scale: 1.12,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
            duration: 180,
            ease: 'outQuad',
          });
        },
        onDrag: (self) => {
          const tilt = Math.max(-16, Math.min(16, self.velocity * 0.35));
          animate(self.$target, {
            rotate: tilt,
            duration: 70,
          });
        },
        onRelease: (self) => {
          animate(self.$target, {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
            ease: spring({ bounce: bounceFactor, duration: 700 }),
            onComplete: () => {
              self.reset();
            },
          });
        },
      });

      newDraggables.push(d);
    });

    draggablesRef.current = newDraggables;

    return () => {
      newDraggables.forEach((d) => {
        try {
          d.revert();
        } catch (_) {}
      });
    };
  }, [bounceFactor, activeTab]);

  const triggerScatterAll = () => {
    const chips = chipRefs.current.filter(Boolean) as HTMLElement[];
    if (!chips.length) return;

    // Scatter outward
    chips.forEach((chip, i) => {
      const angle = (i / chips.length) * Math.PI * 2;
      const dist = 70 + Math.random() * 40;
      const targetX = Math.cos(angle) * dist;
      const targetY = Math.sin(angle) * dist;

      animate(chip, {
        x: targetX,
        y: targetY,
        rotate: (Math.random() - 0.5) * 40,
        scale: 1.05,
        duration: 350,
        ease: 'outBack',
        onComplete: () => {
          // Snap back with spring
          animate(chip, {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            delay: stagger(60)(chip, i, chips),
            ease: spring({ bounce: bounceFactor, duration: 750 }),
            onComplete: () => {
              draggablesRef.current[i]?.reset();
            },
          });
        },
      });
    });
  };

  const triggerWaveCascade = () => {
    const chips = chipRefs.current.filter(Boolean) as HTMLElement[];
    if (!chips.length) return;

    animate(chips, {
      y: [
        { to: -30, duration: 250, ease: 'easeOutQuad' },
        { to: 0, duration: 600, ease: spring({ bounce: 0.6, duration: 650 }) },
      ],
      scale: [
        { to: 1.15, duration: 200, ease: 'easeOutSine' },
        { to: 1, duration: 500, ease: spring({ bounce: 0.4, duration: 550 }) },
      ],
      delay: stagger(80, { from: 'first' }),
      onComplete: () => {
        chips.forEach((_, i) => draggablesRef.current[i]?.reset());
      },
    });
  };

  // ==========================================
  // LAB 2: SVG Path Drawing & Morphing
  // ==========================================
  const triggerDrawPath = useCallback(() => {
    if (!activePathRef.current) return;
    setIsDrawing(true);

    const [drawable] = createDrawable(activePathRef.current, 0, 0);

    animate(drawable, {
      draw: ['0 0', '0 1'],
      duration: 1350,
      ease: 'easeInOutCubic',
      onComplete: () => {
        setIsDrawing(false);
      },
    });
  }, []);

  const triggerMorphTo = (shapeId: 'enso' | 'lotus' | 'wave' | 'knot') => {
    if (!activePathRef.current) return;
    setCurrentShape(shapeId);

    let targetEl: SVGPathElement | null = null;
    if (shapeId === 'enso') targetEl = targetEnsoRef.current;
    if (shapeId === 'lotus') targetEl = targetLotusRef.current;
    if (shapeId === 'wave') targetEl = targetWaveRef.current;
    if (shapeId === 'knot') targetEl = targetKnotRef.current;

    if (!targetEl) return;

    animate(activePathRef.current, {
      d: morphTo(targetEl),
      duration: 1100,
      ease: 'easeInOutCubic',
    });
  };

  const triggerMorphCycle = () => {
    const shapes: ('enso' | 'lotus' | 'wave' | 'knot')[] = ['enso', 'lotus', 'wave', 'knot'];
    const nextIdx = (shapes.indexOf(currentShape) + 1) % shapes.length;
    triggerMorphTo(shapes[nextIdx]);
  };

  // ==========================================
  // LAB 3: Kinetic Text Scrambler
  // ==========================================
  const triggerScramble = useCallback(
    (textToScramble?: string) => {
      if (!scrambleDisplayRef.current) return;

      const targetText = textToScramble ?? SCRAMBLE_PRESETS[activePhraseIndex];
      const chars = CHAR_SETS[charSetKey];

      animate(scrambleDisplayRef.current, {
        textContent: scrambleText({
          text: targetText,
          chars: chars,
          cursor: '_',
          duration: scrambleSpeed,
          ease: 'linear',
        }),
      });
    },
    [activePhraseIndex, charSetKey, scrambleSpeed]
  );

  const handleNextPhrase = () => {
    const nextIdx = (activePhraseIndex + 1) % SCRAMBLE_PRESETS.length;
    setActivePhraseIndex(nextIdx);
    triggerScramble(SCRAMBLE_PRESETS[nextIdx]);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    triggerScramble(customText.trim());
  };

  // Initial scramble trigger on mount
  useEffect(() => {
    if (scrambleDisplayRef.current) {
      triggerScramble();
    }
  }, [triggerScramble]);

  // ==========================================
  // LAB 4: Staggered Ripple Matrix
  // ==========================================
  const triggerRippleAt = (fromTarget: number | 'center' | 'first' | 'last' | 'random') => {
    if (!gridRef.current) return;
    const cells = gridRef.current.querySelectorAll('.ripple-cell');
    if (!cells.length) return;

    animate(cells, {
      scale: [
        { to: 1.65, duration: 180, ease: 'easeOutSine' },
        { to: 1, duration: 550, ease: spring({ bounce: matrixBounce, duration: 600 }) },
      ],
      rotate: [
        { to: 45, duration: 180, ease: 'easeOutQuad' },
        { to: 0, duration: 380, ease: 'easeOutQuad' },
      ],
      backgroundColor: [
        { to: rippleColor, duration: 130 },
        { to: 'rgba(255, 255, 255, 0.08)', duration: 550, ease: 'linear' },
      ],
      borderRadius: ['50%', '28%', '50%'],
      delay: stagger(32, {
        grid: [7, 7],
        from: fromTarget,
      }),
    });
  };

  return (
    <div className="my-10 w-full overflow-hidden rounded-3xl border border-paper-border bg-paper-card/70 backdrop-blur-md shadow-2xl transition-all">
      {/* Studio Header */}
      <div className="border-b border-paper-border/70 bg-paper-subtle/50 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-paper-coral/20 text-paper-coral">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <h2 className="font-sans text-xl font-bold tracking-tight text-paper-ink">
                Kinetic Studio
              </h2>
              <span className="rounded-full bg-paper-coral/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-paper-coral">
                Anime.js v4.5
              </span>
            </div>
            <p className="text-xs text-paper-textSubtle sm:text-sm">
              Authentic spring dynamics, morphic SVG geometry, and staggered kinetic waves.
            </p>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-paper-border bg-paper-bg/60 p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-paper-coral text-white shadow-md'
                  : 'text-paper-textSubtle hover:text-paper-ink hover:bg-paper-subtle'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              All Labs
            </button>
            <button
              onClick={() => setActiveTab('physics')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'physics'
                  ? 'bg-paper-coral text-white shadow-md'
                  : 'text-paper-textSubtle hover:text-paper-ink hover:bg-paper-subtle'
              }`}
            >
              <Move className="h-3.5 w-3.5" />
              Springs
            </button>
            <button
              onClick={() => setActiveTab('svg')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'svg'
                  ? 'bg-paper-coral text-white shadow-md'
                  : 'text-paper-textSubtle hover:text-paper-ink hover:bg-paper-subtle'
              }`}
            >
              <PenTool className="h-3.5 w-3.5" />
              SVG Morph
            </button>
            <button
              onClick={() => setActiveTab('scramble')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'scramble'
                  ? 'bg-paper-coral text-white shadow-md'
                  : 'text-paper-textSubtle hover:text-paper-ink hover:bg-paper-subtle'
              }`}
            >
              <Type className="h-3.5 w-3.5" />
              Scrambler
            </button>
            <button
              onClick={() => setActiveTab('ripple')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'ripple'
                  ? 'bg-paper-coral text-white shadow-md'
                  : 'text-paper-textSubtle hover:text-paper-ink hover:bg-paper-subtle'
              }`}
            >
              <Grid3X3 className="h-3.5 w-3.5" />
              Ripple Grid
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="p-6 sm:p-8">
        {/* ========================================================= */}
        {/* LAB 1: DRAGGABLE KINETIC BEADS (SPRING PHYSICS SNAP-BACK) */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'physics') && (
          <section className="mb-10 rounded-2xl border border-paper-border bg-paper-bg p-6 shadow-sm transition-all">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-paper-coral/15 p-1 text-paper-coral">
                    <Move className="h-4 w-4" />
                  </span>
                  <h3 className="font-sans text-base font-bold text-paper-ink">
                    Draggable Kinetic Beads with Spring Snap-Back
                  </h3>
                </div>
                <p className="text-xs text-paper-textSubtle mt-1">
                  Drag any bead across the stage. Releasing triggers Anime.js v4{' '}
                  <code className="rounded bg-paper-subtle px-1 py-0.5 font-mono text-paper-coral">
                    createDraggable
                  </code>{' '}
                  with Euler spring momentum snap-back to resting socket.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerScatterAll}
                  className="flex items-center gap-1.5 rounded-xl border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-semibold text-paper-ink hover:border-paper-coral/50 hover:text-paper-coral transition-colors"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Scatter & Snap
                </button>
                <button
                  onClick={triggerWaveCascade}
                  className="flex items-center gap-1.5 rounded-xl border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-semibold text-paper-ink hover:border-paper-coral/50 hover:text-paper-coral transition-colors"
                >
                  <Play className="h-3.5 w-3.5" />
                  Cascade Wave
                </button>
              </div>
            </div>

            {/* Stage Canvas #111115 */}
            <div
              ref={stageRef}
              className="relative flex min-h-[220px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#111115] p-6 shadow-inner select-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Floating draggable chips */}
              <div className="flex flex-wrap items-center justify-center gap-4 py-4 z-10">
                {CHIPS.map((chip, idx) => (
                  <div
                    key={chip.id}
                    ref={(el) => {
                      chipRefs.current[idx] = el;
                    }}
                    className={`group relative flex cursor-grab active:cursor-grabbing items-center gap-2.5 rounded-2xl border ${chip.border} ${chip.bg} px-4 py-2.5 backdrop-blur-md shadow-lg transition-shadow hover:shadow-2xl`}
                    style={{ touchAction: 'none' }}
                  >
                    <span
                      className={`h-3 w-3 rounded-full ${chip.accent} shadow-sm animate-pulse`}
                    />
                    <div className="flex flex-col">
                      <span className="font-sans text-xs font-bold text-white tracking-wide">
                        {chip.name}
                      </span>
                      <span className="font-mono text-[10px] text-white/50">{chip.physics}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resting Socket Targets */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-white/5 pt-4">
                {CHIPS.map((chip) => (
                  <div
                    key={`slot-${chip.id}`}
                    className="flex h-10 w-28 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-[10px] font-mono text-white/40"
                  >
                    Resting Socket
                  </div>
                ))}
              </div>
            </div>

            {/* Parameter slider bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-paper-border/40 pt-3 text-xs text-paper-textSubtle">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-semibold text-paper-ink">
                  Spring Elastic Bounce:
                </span>
                <div className="flex items-center gap-2">
                  {[0.2, 0.45, 0.65, 0.85].map((val) => (
                    <button
                      key={val}
                      onClick={() => setBounceFactor(val)}
                      className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition-all ${
                        bounceFactor === val
                          ? 'bg-paper-coral text-white font-bold'
                          : 'bg-paper-subtle text-paper-textSubtle hover:text-paper-ink'
                      }`}
                    >
                      {val === 0.2
                        ? 'Firm (0.2)'
                        : val === 0.45
                        ? 'Balanced (0.45)'
                        : val === 0.65
                        ? 'Bouncy (0.65)'
                        : 'Hyper (0.85)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code peek button */}
              <button
                onClick={() =>
                  handleCopyCode(
                    'physics',
                    `createDraggable(element, {\n  container: stageRef.current,\n  releaseEase: spring({ bounce: ${bounceFactor}, duration: 700 }),\n  onRelease: (self) => {\n    animate(self.$target, {\n      x: 0, y: 0, rotate: 0, scale: 1,\n      ease: spring({ bounce: ${bounceFactor}, duration: 700 }),\n      onComplete: () => self.reset()\n    });\n  }\n});`
                  )
                }
                className="flex items-center gap-1.5 rounded-lg border border-paper-border bg-paper-subtle px-2.5 py-1 text-[11px] font-mono hover:text-paper-coral transition-colors"
              >
                {copied === 'physics' ? (
                  <Check className="h-3 w-3 text-paper-green" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>{copied === 'physics' ? 'Copied Snippet' : 'Copy anime.js v4 API'}</span>
              </button>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* LAB 2: SVG PATH DRAWING & MORPHING CANVAS                 */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'svg') && (
          <section className="mb-10 rounded-2xl border border-paper-border bg-paper-bg p-6 shadow-sm transition-all">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-paper-blue/15 p-1 text-paper-blue">
                    <PenTool className="h-4 w-4" />
                  </span>
                  <h3 className="font-sans text-base font-bold text-paper-ink">
                    SVG Path Drawing & Morphing Canvas
                  </h3>
                </div>
                <p className="text-xs text-paper-textSubtle mt-1">
                  Stroke drawing using{' '}
                  <code className="rounded bg-paper-subtle px-1 py-0.5 font-mono text-paper-blue">
                    createDrawable
                  </code>{' '}
                  combined with geometric interpolation using{' '}
                  <code className="rounded bg-paper-subtle px-1 py-0.5 font-mono text-paper-blue">
                    morphTo
                  </code>
                  .
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerDrawPath}
                  disabled={isDrawing}
                  className="flex items-center gap-1.5 rounded-xl border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-semibold text-paper-ink hover:border-paper-blue/50 hover:text-paper-blue transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Trace Path
                </button>
                <button
                  onClick={triggerMorphCycle}
                  className="flex items-center gap-1.5 rounded-xl border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-semibold text-paper-ink hover:border-paper-blue/50 hover:text-paper-blue transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Morph Cycle
                </button>
              </div>
            </div>

            {/* SVG Stage Canvas #111115 */}
            <div className="relative flex h-[240px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#111115] shadow-inner">
              <svg
                className="h-full w-full max-w-[340px] filter drop-shadow-[0_0_12px_rgba(247,111,83,0.3)]"
                viewBox="0 0 300 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hidden definition paths for morph targets */}
                <defs>
                  <path ref={targetEnsoRef} d={SVG_SHAPES[0].d} />
                  <path ref={targetLotusRef} d={SVG_SHAPES[1].d} />
                  <path ref={targetWaveRef} d={SVG_SHAPES[2].d} />
                  <path ref={targetKnotRef} d={SVG_SHAPES[3].d} />
                </defs>

                {/* Background blueprint guide */}
                <circle cx="150" cy="105" r="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="20" y1="105" x2="280" y2="105" stroke="rgba(255,255,255,0.03)" />
                <line x1="150" y1="20" x2="150" y2="190" stroke="rgba(255,255,255,0.03)" />

                {/* The dynamic active path */}
                <path
                  ref={activePathRef}
                  d={SVG_SHAPES[0].d}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transition: 'stroke 0.3s ease' }}
                />
              </svg>
            </div>

            {/* SVG Shape & Style Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-paper-border/40 pt-3 text-xs">
              {/* Shape selector */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-paper-textSubtle">
                  Geometry:
                </span>
                <div className="flex items-center gap-1.5">
                  {SVG_SHAPES.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() =>
                        triggerMorphTo(shape.id as 'enso' | 'lotus' | 'wave' | 'knot')
                      }
                      className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition-all ${
                        currentShape === shape.id
                          ? 'bg-paper-blue text-white font-bold shadow-sm'
                          : 'bg-paper-subtle text-paper-textSubtle hover:text-paper-ink'
                      }`}
                    >
                      {shape.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color & Stroke Width */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {['#f76f53', '#6287f5', '#63f78b', '#f59e0b', '#a855f7'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setStrokeColor(c)}
                      className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 ${
                        strokeColor === c ? 'border-white scale-110 shadow-sm' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>

                <div className="h-4 w-[1px] bg-paper-border" />

                <div className="flex items-center gap-1">
                  {[2, 3.5, 5].map((w) => (
                    <button
                      key={w}
                      onClick={() => setStrokeWidth(w)}
                      className={`rounded-md px-2 py-0.5 font-mono text-[10px] ${
                        strokeWidth === w
                          ? 'bg-paper-ink text-paper-bg font-bold'
                          : 'bg-paper-subtle text-paper-textSubtle hover:text-paper-ink'
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* LAB 3: KINETIC TEXT SCRAMBLER                             */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'scramble') && (
          <section className="mb-10 rounded-2xl border border-paper-border bg-paper-bg p-6 shadow-sm transition-all">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-paper-green/15 p-1 text-paper-green">
                    <Type className="h-4 w-4" />
                  </span>
                  <h3 className="font-sans text-base font-bold text-paper-ink">
                    Kinetic Text Scrambler Demo
                  </h3>
                </div>
                <p className="text-xs text-paper-textSubtle mt-1">
                  Anime.js v4{' '}
                  <code className="rounded bg-paper-subtle px-1 py-0.5 font-mono text-paper-green">
                    scrambleText
                  </code>{' '}
                  with glyph mutation, dynamic ranges, and character wavefront resolving.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNextPhrase}
                  className="flex items-center gap-1.5 rounded-xl border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-semibold text-paper-ink hover:border-paper-green/50 hover:text-paper-green transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  Next Phrase
                </button>
                <button
                  onClick={() => triggerScramble()}
                  className="flex items-center gap-1.5 rounded-xl border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-semibold text-paper-ink hover:border-paper-green/50 hover:text-paper-green transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Re-Scramble
                </button>
              </div>
            </div>

            {/* Scrambler Visual Display Canvas #111115 */}
            <div className="relative flex min-h-[140px] w-full flex-col justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#111115] px-6 py-8 shadow-inner">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">
                Glyph Matrix Stream • Wave Resolve
              </span>
              <h4
                ref={scrambleDisplayRef}
                className="font-mono text-lg sm:text-2xl font-bold tracking-tight text-white min-h-[2.5rem] select-none"
              >
                {SCRAMBLE_PRESETS[0]}
              </h4>
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleCustomSubmit} className="mt-4 flex gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type your own custom phrase to scramble..."
                className="flex-1 rounded-xl border border-paper-border bg-paper-card/80 px-3.5 py-2 text-xs text-paper-ink placeholder:text-paper-textSubtle/60 focus:border-paper-coral focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-paper-coral px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-paper-coralLight transition-colors"
              >
                Scramble Custom
              </button>
            </form>

            {/* Scrambler Character Sets */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-paper-border/40 pt-3 text-xs text-paper-textSubtle">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-paper-ink">
                  Glyph Set:
                </span>
                <div className="flex items-center gap-1.5">
                  {Object.keys(CHAR_SETS).map((key) => (
                    <button
                      key={key}
                      onClick={() => setCharSetKey(key as keyof typeof CHAR_SETS)}
                      className={`rounded-lg px-2 py-0.5 font-mono text-[11px] capitalize transition-all ${
                        charSetKey === key
                          ? 'bg-paper-green text-black font-bold'
                          : 'bg-paper-subtle text-paper-textSubtle hover:text-paper-ink'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-paper-ink">Duration:</span>
                {[600, 900, 1400].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setScrambleSpeed(dur)}
                    className={`rounded-lg px-2 py-0.5 font-mono text-[11px] ${
                      scrambleSpeed === dur
                        ? 'bg-paper-ink text-paper-bg font-bold'
                        : 'bg-paper-subtle text-paper-textSubtle hover:text-paper-ink'
                    }`}
                  >
                    {dur}ms
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* LAB 4: STAGGERED RIPPLE PARTICLE MATRIX                   */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'ripple') && (
          <section className="rounded-2xl border border-paper-border bg-paper-bg p-6 shadow-sm transition-all">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-paper-purple/15 p-1 text-paper-purple">
                    <Grid3X3 className="h-4 w-4" />
                  </span>
                  <h3 className="font-sans text-base font-bold text-paper-ink">
                    Staggered Ripple Particle Matrix
                  </h3>
                </div>
                <p className="text-xs text-paper-textSubtle mt-1">
                  Click or hover across the 7×7 grid. Triggers Anime.js v4{' '}
                  <code className="rounded bg-paper-subtle px-1 py-0.5 font-mono text-paper-purple">
                    stagger(32, &#123; grid: [7, 7], from: index &#125;)
                  </code>{' '}
                  with 2D distance calculation.
                </p>
              </div>

              {/* Ripple Preset Triggers */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => triggerRippleAt('center')}
                  className="rounded-xl border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-semibold text-paper-ink hover:border-paper-purple/50 hover:text-paper-purple transition-colors"
                >
                  Center Wave
                </button>
                <button
                  onClick={() => triggerRippleAt('first')}
                  className="rounded-xl border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-semibold text-paper-ink hover:border-paper-purple/50 hover:text-paper-purple transition-colors"
                >
                  Corner Wave
                </button>
                <button
                  onClick={() => triggerRippleAt('random')}
                  className="rounded-xl border border-paper-border bg-paper-card px-3 py-1.5 text-xs font-semibold text-paper-ink hover:border-paper-purple/50 hover:text-paper-purple transition-colors"
                >
                  Random Jitter
                </button>
              </div>
            </div>

            {/* Ripple Matrix Stage #111115 */}
            <div className="flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#111115] p-6 shadow-inner">
              <div
                ref={gridRef}
                className="grid grid-cols-7 gap-3 sm:gap-4 select-none"
                style={{ width: 'fit-content' }}
              >
                {Array.from({ length: 49 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => triggerRippleAt(i)}
                    onMouseEnter={() => {
                      // subtle micro bounce on hover
                      const cell = gridRef.current?.children[i] as HTMLElement;
                      if (cell) {
                        animate(cell, {
                          scale: [
                            { to: 1.35, duration: 120, ease: 'easeOutSine' },
                            { to: 1, duration: 350, ease: spring({ bounce: 0.5, duration: 400 }) },
                          ],
                        });
                      }
                    }}
                    className="ripple-cell relative flex h-7 w-7 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-full bg-white/[0.08] border border-white/10 transition-colors hover:border-white/40 focus:outline-none"
                    aria-label={`Matrix cell ${i}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  </button>
                ))}
              </div>
            </div>

            {/* Ripple Color & Elasticity Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-paper-border/40 pt-3 text-xs text-paper-textSubtle">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-paper-ink">
                  Glow Accent:
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { c: '#f76f53', name: 'Paper Coral' },
                    { c: '#6287f5', name: 'Electric Blue' },
                    { c: '#63f78b', name: 'Emerald' },
                    { c: '#a855f7', name: 'Neon Purple' },
                  ].map(({ c, name }) => (
                    <button
                      key={c}
                      onClick={() => setRippleColor(c)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] transition-all ${
                        rippleColor === c
                          ? 'bg-white/15 text-paper-ink font-bold'
                          : 'text-paper-textSubtle hover:text-paper-ink'
                      }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c }} />
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-paper-ink">Bounce:</span>
                {[0.3, 0.55, 0.75].map((b) => (
                  <button
                    key={b}
                    onClick={() => setMatrixBounce(b)}
                    className={`rounded-md px-2 py-0.5 font-mono text-[10px] ${
                      matrixBounce === b
                        ? 'bg-paper-ink text-paper-bg font-bold'
                        : 'bg-paper-subtle text-paper-textSubtle hover:text-paper-ink'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Code Preview Footer */}
      <div className="border-t border-paper-border/70 bg-paper-subtle/30 px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-paper-textSubtle font-mono">
            <Code2 className="h-4 w-4 text-paper-coral" />
            <span>anime.js v4 API: animate, createDraggable, scrambleText, createDrawable, morphTo</span>
          </div>

          <span className="text-[11px] font-mono text-paper-coral font-medium">
            100% Client-Side Physics • 60fps WAAPI Engine
          </span>
        </div>
      </div>
    </div>
  );
};
