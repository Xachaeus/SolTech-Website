import {
  Component,
  ElementRef,
  afterNextRender,
  DestroyRef,
  inject,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Animated cosmic background: a twinkling star field, drifting nebula glow, and
 * volumetric aurora fog. Each layer is its own <canvas>.
 *
 * Lifecycle notes:
 *  • All canvas/DOM work runs inside afterNextRender, so it only ever executes
 *    in the browser (SSR-safe if SSR is added later).
 *  • Every animation returns a stop() handle; DestroyRef tears them all down,
 *    cancelling rAF loops and removing resize listeners — no leaks on navigation.
 *  • Honours prefers-reduced-motion (draws one static frame, no loop) and
 *    thins particle counts on small screens so phones stay smooth.
 */
@Component({
  selector: 'app-background',
  templateUrl: './background.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './background.css',
})
export class Background {
  private readonly starsRef = viewChild.required<ElementRef<HTMLCanvasElement>>('stars');
  private readonly nebulaRef = viewChild.required<ElementRef<HTMLCanvasElement>>('nebula');
  private readonly fogRef = viewChild.required<ElementRef<HTMLCanvasElement>>('fog');

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      const small = window.innerWidth < 640;

      const stops = [
        initStars(this.starsRef().nativeElement, reduced, small),
        initNebula(this.nebulaRef().nativeElement, reduced),
        initFog(this.fogRef().nativeElement, reduced, small),
      ];

      this.destroyRef.onDestroy(() => stops.forEach((stop) => stop()));
    });
  }
}

/* ── helpers ────────────────────────────────────────────────────────────── */
type RGB = [number, number, number];
type Stop = () => void;

const rnd = (a: number, b: number) => a + (b - a) * Math.random();
const rndI = (a: number, b: number) => Math.floor(rnd(a, b + 1));

/* ── STARS ──────────────────────────────────────────────────────────────── */
interface Star {
  x: number;
  y: number;
  sz: number;
  col: string;
  op: number;
  ts: number;
  tp: number;
}

function initStars(cv: HTMLCanvasElement, reduced: boolean, small: boolean): Stop {
  const ctx = cv.getContext('2d');
  if (!ctx) return () => {};
  const cx: CanvasRenderingContext2D = ctx;

  let W = 0,
    H = 0,
    t = 0,
    raf = 0;
  let stars: Star[] = [];
  const divisor = small ? 5200 : 3200; // larger divisor = fewer stars

  function build(): void {
    stars = [];
    const n = Math.floor((W * H) / divisor);
    for (let i = 0; i < n; i++) {
      const r = Math.random();
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        sz: r < 0.72 ? 0.5 : r < 0.9 ? 1 : 1.5,
        col:
          Math.random() < 0.07 ? '0,229,192' : Math.random() < 0.05 ? '192,96,232' : '200,220,235',
        op: 0.15 + Math.random() * 0.65,
        ts: 0.3 + Math.random() * 1.4,
        tp: Math.random() * Math.PI * 2,
      });
    }
  }
  function resize(): void {
    W = cv.width = innerWidth;
    H = cv.height = innerHeight;
    build();
  }
  function frame(): void {
    cx.clearRect(0, 0, W, H);
    t += 0.01;
    for (const s of stars) {
      cx.globalAlpha = reduced ? s.op : s.op * (0.55 + 0.45 * Math.sin(t * s.ts + s.tp));
      cx.fillStyle = `rgb(${s.col})`;
      cx.beginPath();
      cx.arc(s.x, s.y, s.sz, 0, Math.PI * 2);
      cx.fill();
    }
    cx.globalAlpha = 1;
  }
  function loop(): void {
    frame();
    raf = requestAnimationFrame(loop);
  }

  resize();
  addEventListener('resize', resize);
  reduced ? frame() : loop();

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', resize);
  };
}

/* ── NEBULA ─────────────────────────────────────────────────────────────── */
function initNebula(cv: HTMLCanvasElement, reduced: boolean): Stop {
  const ctx = cv.getContext('2d');
  if (!ctx) return () => {};
  const cx: CanvasRenderingContext2D = ctx;

  let W = 0,
    H = 0,
    t = 0,
    raf = 0;
  function resize(): void {
    W = cv.width = innerWidth;
    H = cv.height = innerHeight;
  }

  function blob(x: number, y: number, r: number, col: string, a: number): void {
    const g = cx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${col},${a})`);
    g.addColorStop(0.5, `rgba(${col},${a * 0.4})`);
    g.addColorStop(1, `rgba(${col},0)`);
    cx.fillStyle = g;
    cx.fillRect(0, 0, W, H);
  }
  function frame(): void {
    cx.clearRect(0, 0, W, H);
    t += 0.003;
    blob(
      W * (0.72 + 0.06 * Math.sin(t * 0.7)),
      H * (0.09 + 0.04 * Math.cos(t * 0.5)),
      W * 0.44,
      '192,96,232',
      0.09 + 0.035 * Math.sin(t * 0.4),
    );
    blob(
      W * (0.18 + 0.05 * Math.sin(t * 0.6)),
      H * (0.22 + 0.05 * Math.cos(t * 0.8)),
      W * 0.36,
      '0,200,180',
      0.06 + 0.025 * Math.sin(t * 0.5),
    );
    blob(
      W * (0.5 + 0.08 * Math.sin(t * 0.4)),
      H * (0.05 + 0.03 * Math.cos(t * 0.6)),
      W * 0.28,
      '0,212,255',
      0.04 + 0.018 * Math.sin(t * 0.35),
    );
  }
  function loop(): void {
    frame();
    raf = requestAnimationFrame(loop);
  }

  resize();
  addEventListener('resize', resize);
  reduced ? frame() : loop();

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', resize);
  };
}

/* ── FOG ────────────────────────────────────────────────────────────────── */
interface Puff {
  bx: number;
  by: number;
  rx: number;
  ry: number;
  rot: number;
  rotV: number;
  col: RGB;
  alpha: number;
  ax: number;
  ax2: number;
  ay: number;
  ay2: number;
  fx: number;
  fx2: number;
  fy: number;
  fy2: number;
  px: number;
  px2: number;
  py: number;
  py2: number;
  sxA: number;
  syA: number;
  sxS: number;
  syS: number;
  sxP: number;
  syP: number;
}
interface Wisp {
  x: number;
  y: number;
  r: number;
  alpha: number;
  vy: number;
  vx: number;
  col: RGB;
  tfx: number;
  tfy: number;
  tpx: number;
  tpy: number;
}

function initFog(cv: HTMLCanvasElement, reduced: boolean, small: boolean): Stop {
  const ctx = cv.getContext('2d');
  if (!ctx) return () => {};
  const cx: CanvasRenderingContext2D = ctx;

  let W = 0,
    H = 0,
    t = 0,
    raf = 0;
  const scale = small ? 0.5 : 1; // thin out particle pools on phones

  const C: { dt: RGB; mt: RGB; bt: RGB; cy: RGB; pu: RGB; wh: RGB } = {
    dt: [0, 95, 78],
    mt: [0, 175, 138],
    bt: [0, 222, 178],
    cy: [0, 198, 248],
    pu: [118, 38, 195],
    wh: [148, 248, 220],
  };

  function resize(): void {
    W = cv.width = innerWidth;
    H = cv.height = Math.round(innerHeight * 0.68);
  }

  function makePuff(tier: number): Puff {
    let yRng: number[], rxRng: number[], ryRng: number[], aRng: number[], cols: RGB[];
    if (tier === 0) {
      // FLOOR
      yRng = [0.68, 1.08];
      rxRng = [320, 580];
      ryRng = [180, 360];
      aRng = [0.22, 0.42];
      cols = [C.dt, C.mt, C.mt];
    } else if (tier === 1) {
      // BODY
      yRng = [0.38, 0.92];
      rxRng = [140, 320];
      ryRng = [80, 210];
      aRng = [0.11, 0.22];
      cols = [C.mt, C.bt, C.cy, C.mt];
    } else {
      // BILLOW
      yRng = [0.08, 0.78];
      rxRng = [50, 150];
      ryRng = [38, 110];
      aRng = [0.06, 0.14];
      cols = [C.bt, C.cy, C.cy, C.pu, C.bt];
    }
    return {
      bx: rnd(-0.12, 1.12) * W,
      by: rnd(yRng[0], yRng[1]) * H,
      rx: rnd(rxRng[0], rxRng[1]),
      ry: rnd(ryRng[0], ryRng[1]),
      rot: rnd(0, Math.PI * 2),
      rotV: rnd(-0.0005, 0.0005),
      col: cols[rndI(0, cols.length - 1)],
      alpha: rnd(aRng[0], aRng[1]),
      ax: rnd(18, 75),
      ax2: rnd(6, 28),
      ay: rnd(7, 34),
      ay2: rnd(4, 18),
      fx: rnd(0.1, 0.4),
      fx2: rnd(0.2, 0.65),
      fy: rnd(0.08, 0.35),
      fy2: rnd(0.15, 0.55),
      px: rnd(0, Math.PI * 2),
      px2: rnd(0, Math.PI * 2),
      py: rnd(0, Math.PI * 2),
      py2: rnd(0, Math.PI * 2),
      sxA: rnd(0.04, 0.15),
      syA: rnd(0.03, 0.12),
      sxS: rnd(0.04, 0.17),
      syS: rnd(0.04, 0.15),
      sxP: rnd(0, Math.PI * 2),
      syP: rnd(0, Math.PI * 2),
    };
  }

  function makeWisp(startY?: number): Wisp {
    const col = Math.random() < 0.6 ? C.bt : Math.random() < 0.65 ? C.cy : C.pu;
    return {
      x: rnd(0, W),
      y: startY ?? rnd(0.4, 1.1) * H,
      r: rnd(16, 48),
      alpha: rnd(0.04, 0.11),
      vy: rnd(0.15, 0.48),
      vx: 0,
      col,
      tfx: rnd(0.28, 0.85),
      tfy: rnd(0.22, 0.7),
      tpx: rnd(0, Math.PI * 2),
      tpy: rnd(0, Math.PI * 2),
    };
  }

  function drawPuff(p: Puff): void {
    const x = p.bx + p.ax * Math.sin(t * p.fx + p.px) + p.ax2 * Math.sin(t * p.fx2 + p.px2);
    const y = p.by + p.ay * Math.cos(t * p.fy + p.py) + p.ay2 * Math.cos(t * p.fy2 + p.py2);

    const yF = Math.max(0, Math.min(1, y / H));
    const a = p.alpha * Math.pow(yF, 1.25);
    if (a < 0.005) return;

    const rx = p.rx * (1 + p.sxA * Math.sin(t * p.sxS + p.sxP));
    const ry = p.ry * (1 + p.syA * Math.cos(t * p.syS + p.syP));
    p.rot += p.rotV;

    cx.save();
    cx.translate(x, y);
    cx.rotate(p.rot);
    cx.scale(1, ry / rx);
    const [r, g, b] = p.col;
    const grad = cx.createRadialGradient(0, 0, 0, 0, 0, rx);
    grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
    grad.addColorStop(0.28, `rgba(${r},${g},${b},${a * 0.82})`);
    grad.addColorStop(0.55, `rgba(${r},${g},${b},${a * 0.52})`);
    grad.addColorStop(0.78, `rgba(${r},${g},${b},${a * 0.22})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    cx.beginPath();
    cx.arc(0, 0, rx, 0, Math.PI * 2);
    cx.fillStyle = grad;
    cx.fill();
    cx.restore();
  }

  function tickWisp(w: Wisp): void {
    w.vx = Math.sin(t * w.tfx + w.tpx) * 0.5 + Math.sin(t * w.tfx * 1.9 + w.tpx) * 0.18;
    w.x += w.vx;
    w.y -= w.vy;
    if (w.y + w.r < 0) Object.assign(w, makeWisp(H + rnd(10, 50)));
    if (w.x < -w.r * 3 || w.x > W + w.r * 3) w.x = rnd(0.1, 0.9) * W;

    const yF = Math.max(0, Math.min(1, w.y / H));
    const a = w.alpha * Math.pow(yF, 1.0);
    if (a < 0.004) return;

    const [r, g, b] = w.col;
    const grad = cx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
    grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${a * 0.45})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    cx.beginPath();
    cx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
    cx.fillStyle = grad;
    cx.fill();
  }

  let floorP: Puff[] = [],
    bodyP: Puff[] = [],
    billowP: Puff[] = [],
    wisps: Wisp[] = [];
  function initPools(): void {
    floorP = Array.from({ length: Math.round(8 * scale) }, () => makePuff(0));
    bodyP = Array.from({ length: Math.round(18 * scale) }, () => makePuff(1));
    billowP = Array.from({ length: Math.round(30 * scale) }, () => makePuff(2));
    wisps = Array.from({ length: Math.round(55 * scale) }, () => makeWisp(rnd(0, H)));
  }

  function frame(): void {
    cx.clearRect(0, 0, W, H);
    for (const p of floorP) drawPuff(p);
    for (const p of bodyP) drawPuff(p);
    for (const p of billowP) drawPuff(p);
    for (const w of wisps) tickWisp(w);

    // Soft top fade so the fog dissolves cleanly into space.
    const fd = cx.createLinearGradient(0, 0, 0, H * 0.24);
    fd.addColorStop(0, 'rgba(2,6,9,1)');
    fd.addColorStop(1, 'rgba(2,6,9,0)');
    cx.fillStyle = fd;
    cx.fillRect(0, 0, W, H * 0.24);

    t += 0.005;
  }
  function loop(): void {
    frame();
    raf = requestAnimationFrame(loop);
  }
  function onResize(): void {
    resize();
    initPools();
  }

  resize();
  initPools();
  addEventListener('resize', onResize);
  reduced ? frame() : loop();

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', onResize);
  };
}
