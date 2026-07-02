import { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 270
const PX_PER_FRAME = 18
const SCROLL_PX = FRAME_COUNT * PX_PER_FRAME
const PRELOAD_CONCURRENCY = 12
const framePath = (i) => `/frames/frame-${String(i).padStart(3, '0')}.jpg`

export default function HeroSection() {
  const prefersReduced = useReducedMotion()
  const sectionRef  = useRef(null)
  const canvasRef   = useRef(null)
  const stRef       = useRef(null)
  const imagesRef   = useRef([])
  const frameRef    = useRef(1)
  const [firstPainted, setFirstPainted] = useState(false)

  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Fall back to the nearest already-loaded frame so a slow network
    // never leaves the canvas blank mid-scrub.
    let img = imagesRef.current[index - 1]
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let radius = 1; radius < FRAME_COUNT; radius++) {
        const back = imagesRef.current[index - 1 - radius]
        const fwd  = imagesRef.current[index - 1 + radius]
        if (back && back.complete && back.naturalWidth) { img = back; break }
        if (fwd && fwd.complete && fwd.naturalWidth) { img = fwd; break }
      }
    }
    if (!img) return

    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cssWidth  = canvas.clientWidth
    const cssHeight = canvas.clientHeight
    const bufferW = Math.round(cssWidth * dpr)
    const bufferH = Math.round(cssHeight * dpr)
    if (canvas.width !== bufferW || canvas.height !== bufferH) {
      canvas.width  = bufferW
      canvas.height = bufferH
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, cssWidth, cssHeight)

    // Cover-fit: always fill the pinned section edge-to-edge (no pillarboxing),
    // cropping evenly from the center on whichever axis overflows.
    const scale = Math.max(cssWidth / img.naturalWidth, cssHeight / img.naturalHeight)
    const drawW = img.naturalWidth * scale
    const drawH = img.naturalHeight * scale
    ctx.drawImage(img, (cssWidth - drawW) / 2, (cssHeight - drawH) / 2, drawW, drawH)
  }, [])

  // Preload every frame, painting frame 1 the instant it's ready and
  // streaming the rest in behind it with bounded concurrency.
  useEffect(() => {
    let cancelled = false
    const images = new Array(FRAME_COUNT)
    imagesRef.current = images

    const loadOne = (i) => new Promise((resolve) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        // decode() is a best-effort jank-avoidance hint — it can hang
        // indefinitely in some environments, so it must never block paint.
        img.decode().catch(() => {})
        if (!cancelled && i === 1) {
          drawFrame(1)
          setFirstPainted(true)
        } else if (!cancelled && i === frameRef.current) {
          drawFrame(i)
        }
        resolve()
      }
      img.onerror = () => resolve()
      images[i - 1] = img
      img.src = framePath(i)
    })

    async function run() {
      await loadOne(1)
      const rest = []
      for (let i = 2; i <= FRAME_COUNT; i++) rest.push(i)
      let cursor = 0
      const workers = new Array(PRELOAD_CONCURRENCY).fill(0).map(async () => {
        while (cursor < rest.length && !cancelled) {
          await loadOne(rest[cursor++])
        }
      })
      await Promise.all(workers)
      if (!cancelled) ScrollTrigger.refresh()
    }
    run()

    return () => { cancelled = true }
  }, [drawFrame])

  // Pin the section and scrub the frame index in lockstep with scroll.
  useEffect(() => {
    if (prefersReduced) return

    const t = setTimeout(() => {
      stRef.current = ScrollTrigger.create({
        trigger : sectionRef.current,
        start   : 'top top',
        end     : `+=${SCROLL_PX}`,
        pin     : true,
        scrub   : true,
        onUpdate: (self) => {
          const frame = 1 + Math.round(self.progress * (FRAME_COUNT - 1))
          if (frame !== frameRef.current) {
            frameRef.current = frame
            drawFrame(frame)
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
  }, [prefersReduced, drawFrame])

  // Keep the canvas buffer and current frame crisp across viewport/DPR changes.
  useEffect(() => {
    const handleResize = () => {
      drawFrame(frameRef.current)
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawFrame])

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
            position  : 'absolute',
            top       : 0,
            left      : 0,
            width     : '100%',
            height    : '100%',
            display   : 'block',
            opacity   : firstPainted ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
          aria-hidden="true"
        />

        {/* Scroll hint — bottom-centre */}
        <div
          style={{
            position     : 'absolute',
            bottom       : '2rem',
            left         : '50%',
            transform    : 'translateX(-50%)',
            zIndex       : 10,
            display      : 'flex',
            flexDirection: 'column',
            alignItems   : 'center',
            gap          : '6px',
            pointerEvents: 'none',
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
