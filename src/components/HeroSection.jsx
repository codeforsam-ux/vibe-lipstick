import { useEffect, useRef, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── Config ─────────────────────────────────────── */
const TOTAL_FRAMES   = 270
const SCROLL_PX      = 5400        // total pin scroll distance (~20px per frame)
const EAGER_COUNT    = 50          // load these first before background batch
const BATCH_SIZE     = 15          // frames per background batch
const BATCH_DELAY_MS = 60          // ms between background batches
const SRC_W          = 1280
const SRC_H          = 720

const frameSrc = (i) =>
  `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.png`

/* ─── Component ─────────────────────────────────── */
export default function HeroSection() {
  const prefersReduced = useReducedMotion()

  const sectionRef  = useRef(null)
  const canvasRef   = useRef(null)
  const ctxRef      = useRef(null)
  const cssWRef     = useRef(0)
  const cssHRef     = useRef(0)

  /* HTMLImageElement array — universally supported, browser-cached */
  const images      = useRef(new Array(TOTAL_FRAMES).fill(null))
  const loadedSet   = useRef(new Set())
  const curIdx      = useRef(0)
  const rafId       = useRef(null)
  const stRef       = useRef(null)

  /* ─── Draw one frame ─── */
  const draw = useCallback((idx) => {
    const ctx = ctxRef.current
    const img = images.current[idx]
    if (!ctx || !img || !img.complete || img.naturalWidth === 0) return

    const cw = cssWRef.current
    const ch = cssHRef.current
    if (cw === 0 || ch === 0) return

    // contain: maintain 1280×720 aspect, letterbox with brand bg
    const scale = Math.min(cw / SRC_W, ch / SRC_H)
    const dw    = SRC_W * scale
    const dh    = SRC_H * scale
    const dx    = (cw - dw) / 2
    const dy    = (ch - dh) / 2

    ctx.fillStyle = '#0D0A14'
    ctx.fillRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, dw, dh)

    curIdx.current = idx
  }, [])

  /* ─── Schedule a draw on the next animation frame ─── */
  const schedDraw = useCallback((idx) => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      draw(idx)
    })
  }, [draw])

  /* ─── Setup & resize canvas ─── */
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const w   = Math.floor(canvas.getBoundingClientRect().width)
    const h   = Math.floor(canvas.getBoundingClientRect().height)

    if (w === 0 || h === 0) return

    canvas.width  = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    cssWRef.current = w
    cssHRef.current = h

    const ctx = canvas.getContext('2d', { alpha: false })
    ctx.scale(dpr, dpr)
    ctx.fillStyle = '#0D0A14'
    ctx.fillRect(0, 0, w, h)
    ctxRef.current = ctx

    // Re-draw the current frame after resize
    draw(curIdx.current)
  }, [draw])

  /* ─── Load a single frame via HTMLImageElement ─── */
  const loadFrame = useCallback((idx) => {
    if (images.current[idx] || loadedSet.current.has(idx)) return
    loadedSet.current.add(idx)

    const img = new Image()

    img.onload = () => {
      images.current[idx] = img
      // Render the very first frame as soon as it arrives
      if (idx === 0) schedDraw(0)
    }

    img.onerror = () => {
      loadedSet.current.delete(idx) // allow retry
    }

    // Decode hint: async decode so it doesn't block the main thread
    img.decoding = 'async'
    img.src = frameSrc(idx)
  }, [schedDraw])

  /* ─── Progressive loading ─── */
  useEffect(() => {
    // Phase 1 — eager: first EAGER_COUNT frames in parallel
    for (let i = 0; i < Math.min(EAGER_COUNT, TOTAL_FRAMES); i++) {
      loadFrame(i)
    }

    // Phase 2 — background: remaining frames in small batches
    let batchStart = EAGER_COUNT
    const runBatch = () => {
      if (batchStart >= TOTAL_FRAMES) return
      const end = Math.min(batchStart + BATCH_SIZE, TOTAL_FRAMES)
      for (let i = batchStart; i < end; i++) loadFrame(i)
      batchStart = end
      setTimeout(runBatch, BATCH_DELAY_MS)
    }
    const bgTimer = setTimeout(runBatch, 300)
    return () => clearTimeout(bgTimer)
  }, [loadFrame])

  /* ─── Canvas init + ResizeObserver ─── */
  useEffect(() => {
    // Small rAF delay lets the browser finish laying out the section
    const raf = requestAnimationFrame(() => {
      initCanvas()
    })

    const ro = new ResizeObserver(() => {
      // Reset context scale by re-initialising
      ctxRef.current = null
      initCanvas()
    })
    if (canvasRef.current) ro.observe(canvasRef.current)

    window.addEventListener('resize', initCanvas, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', initCanvas)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [initCanvas])

  /* ─── GSAP ScrollTrigger ─── */
  useEffect(() => {
    if (prefersReduced) {
      schedDraw(0)
      return
    }

    // Small delay ensures the section is in the DOM and sized
    const t = setTimeout(() => {
      stRef.current = ScrollTrigger.create({
        trigger : sectionRef.current,
        start   : 'top top',
        end     : `+=${SCROLL_PX}`,
        pin     : true,
        scrub   : 0.2,
        onUpdate: (self) => {
          const target = Math.min(
            Math.round(self.progress * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
          )
          if (target !== curIdx.current || !ctxRef.current) {
            schedDraw(target)
          }
        },
      })
    }, 100)

    return () => {
      clearTimeout(t)
      if (stRef.current) {
        stRef.current.kill()
        stRef.current = null
      }
    }
  }, [prefersReduced, schedDraw])

  return (
    <>
      {/* ── Pinned hero section ── */}
      <section
        ref={sectionRef}
        id="hero"
        aria-label="VIBE lipstick — scroll-driven showcase"
        style={{
          position  : 'relative',
          width     : '100%',
          height    : '100vh',
          overflow  : 'hidden',
          background: '#0D0A14',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position      : 'absolute',
            top           : 0,
            left          : 0,
            width         : '100%',
            height        : '100%',
            display       : 'block',
            imageRendering: 'crisp-edges',
          }}
          aria-hidden="true"
        />

        {/* Scroll hint — bottom-centre */}
        <div
          style={{
            position      : 'absolute',
            bottom        : '2rem',
            left          : '50%',
            transform     : 'translateX(-50%)',
            zIndex        : 10,
            display       : 'flex',
            flexDirection : 'column',
            alignItems    : 'center',
            gap           : '6px',
            pointerEvents : 'none',
          }}
        >
          <span style={{
            fontFamily   : 'Space Grotesk, sans-serif',
            fontSize     : '0.65rem',
            fontWeight   : 600,
            color        : 'rgba(255,255,255,0.3)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}>
            Scroll
          </span>
          <div style={{
            width     : '1px',
            height    : '40px',
            background: 'linear-gradient(to bottom, rgba(255,0,153,0.6), transparent)',
            animation : 'scrollHint 1.8s ease-in-out infinite',
          }} />
        </div>
      </section>

      {/* ── Marquee — outside the pinned zone, 30 px gap above ── */}
      <div
        style={{
          marginTop : '30px',
          overflow  : 'hidden',
          background: '#FF0099',
          padding   : '10px 0',
        }}
        aria-hidden="true"
      >
        <div className="marquee-track select-none">
          {Array(8).fill(null).map((_, i) => (
            <span
              key={i}
              style={{
                fontFamily   : 'Syne, sans-serif',
                fontWeight   : 800,
                fontSize     : '0.8rem',
                letterSpacing: '0.2em',
                color        : '#0D0A14',
                margin       : '0 2rem',
              }}
            >
              WEAR YOUR VIBE &nbsp;✦&nbsp; 24HR STAY &nbsp;✦&nbsp; VEGAN &nbsp;✦&nbsp; SMUDGE-PROOF &nbsp;✦&nbsp;
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
