import { useEffect, useRef, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── Config ─────────────────────────────────────── */
const TOTAL_FRAMES   = 270
const SCROLL_PX      = 5400      // total pin distance (20 px per frame)
const EAGER_FRAMES   = 40        // load these before releasing the page
const BATCH_SIZE     = 20        // background load batch size
const BATCH_DELAY_MS = 80        // gap between batches (keeps main thread free)
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

  /* frame store — ImageBitmap for GPU-friendly drawing */
  const bitmaps     = useRef(new Array(TOTAL_FRAMES).fill(null))
  const loadedSet   = useRef(new Set())
  const curIdx      = useRef(0)
  const rafPending  = useRef(null)

  /* ─── Draw one frame ─── */
  const draw = useCallback((idx) => {
    const ctx = ctxRef.current
    const bmp = bitmaps.current[idx]
    if (!ctx || !bmp) return

    const cw = cssWRef.current
    const ch = cssHRef.current

    // contain: fit 1280×720 inside the canvas, centred
    const scale = Math.min(cw / SRC_W, ch / SRC_H)
    const dw    = SRC_W * scale
    const dh    = SRC_H * scale
    const dx    = (cw - dw) / 2
    const dy    = (ch - dh) / 2

    ctx.fillStyle = '#0D0A14'
    ctx.fillRect(0, 0, cw, ch)
    ctx.drawImage(bmp, dx, dy, dw, dh)

    curIdx.current = idx
  }, [])

  /* ─── Schedule a draw on next RAF ─── */
  const schedDraw = useCallback((idx) => {
    if (rafPending.current !== null) cancelAnimationFrame(rafPending.current)
    rafPending.current = requestAnimationFrame(() => {
      rafPending.current = null
      draw(idx)
    })
  }, [draw])

  /* ─── Canvas resize ─── */
  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w   = canvas.clientWidth
    const h   = canvas.clientHeight
    canvas.width  = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    cssWRef.current = w
    cssHRef.current = h
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    ctx.scale(dpr, dpr)
    ctxRef.current = ctx
    draw(curIdx.current)
  }, [draw])

  /* ─── Load a single frame as ImageBitmap ─── */
  const loadBitmap = useCallback((idx) => {
    if (bitmaps.current[idx] || loadedSet.current.has(idx)) return
    loadedSet.current.add(idx)

    fetch(frameSrc(idx))
      .then((r) => r.blob())
      .then((blob) => createImageBitmap(blob, { resizeQuality: 'high' }))
      .then((bmp) => {
        bitmaps.current[idx] = bmp
        // show first frame as soon as it's ready
        if (idx === 0) schedDraw(0)
      })
      .catch(() => { loadedSet.current.delete(idx) })
  }, [schedDraw])

  /* ─── Progressive loader ─── */
  useEffect(() => {
    // Phase 1 — eager: first EAGER_FRAMES frames in parallel
    for (let i = 0; i < EAGER_FRAMES; i++) loadBitmap(i)

    // Phase 2 — background: rest in small batches so we don't hammer the network
    let batch = EAGER_FRAMES
    const loadNextBatch = () => {
      if (batch >= TOTAL_FRAMES) return
      const end = Math.min(batch + BATCH_SIZE, TOTAL_FRAMES)
      for (let i = batch; i < end; i++) loadBitmap(i)
      batch = end
      setTimeout(loadNextBatch, BATCH_DELAY_MS)
    }
    const t = setTimeout(loadNextBatch, 400) // start background phase after eager batch kicks off
    return () => clearTimeout(t)
  }, [loadBitmap])

  /* ─── Canvas init + resize listener ─── */
  useEffect(() => {
    resize()
    const ro = new ResizeObserver(resize)
    if (canvasRef.current) ro.observe(canvasRef.current)
    window.addEventListener('resize', resize, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', resize)
      if (rafPending.current !== null) cancelAnimationFrame(rafPending.current)
    }
  }, [resize])

  /* ─── GSAP ScrollTrigger ─── */
  useEffect(() => {
    if (prefersReduced) {
      // Static first frame — no scroll animation
      schedDraw(0)
      return
    }

    const st = ScrollTrigger.create({
      trigger : sectionRef.current,
      start   : 'top top',
      end     : `+=${SCROLL_PX}`,
      pin     : true,
      scrub   : 0.25,   // tight scrub = near-instant response
      onUpdate: (self) => {
        const target = Math.min(
          Math.round(self.progress * (TOTAL_FRAMES - 1)),
          TOTAL_FRAMES - 1
        )
        if (target !== curIdx.current) schedDraw(target)
      },
    })

    return () => st.kill()
  }, [prefersReduced, schedDraw])

  return (
    <>
      {/* ── Pinned hero ── */}
      <section
        ref={sectionRef}
        id="hero"
        aria-label="VIBE — scroll-driven lipstick showcase"
        style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0D0A14' }}
      >
        {/* Full-viewport canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position      : 'absolute',
            inset         : 0,
            width         : '100%',
            height        : '100%',
            display       : 'block',
            imageRendering: 'crisp-edges',
          }}
          aria-hidden="true"
        />

        {/* Brand watermark — top-left */}
        <div style={{ position: 'absolute', top: '1.5rem', left: '2rem', zIndex: 10, pointerEvents: 'none' }}>
          <span
            style={{
              fontFamily  : 'Syne, sans-serif',
              fontWeight  : 800,
              fontSize    : 'clamp(1.6rem, 3vw, 2.4rem)',
              color       : '#FF0099',
              letterSpacing: '-0.02em',
              textShadow  : '0 0 20px rgba(255,0,153,0.5)',
            }}
          >
            VIBE
          </span>
        </div>

        {/* Scroll hint — bottom-centre, fades out as user scrolls */}
        <div
          style={{
            position       : 'absolute',
            bottom         : '2rem',
            left           : '50%',
            transform      : 'translateX(-50%)',
            zIndex         : 10,
            display        : 'flex',
            flexDirection  : 'column',
            alignItems     : 'center',
            gap            : '6px',
            pointerEvents  : 'none',
          }}
        >
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Scroll
          </span>
          {/* animated line */}
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(255,0,153,0.7), transparent)', animation: 'scrollHint 1.8s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ── Marquee ticker — outside the pin zone, 30px gap ── */}
      <div
        style={{ marginTop: '30px', overflow: 'hidden', background: '#FF0099', padding: '10px 0' }}
        aria-hidden="true"
      >
        <div className="marquee-track select-none">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.2em', color: '#0D0A14', margin: '0 2rem' }}>
              WEAR YOUR VIBE &nbsp;✦&nbsp; 24HR STAY &nbsp;✦&nbsp; VEGAN &nbsp;✦&nbsp; SMUDGE-PROOF &nbsp;✦&nbsp;
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
