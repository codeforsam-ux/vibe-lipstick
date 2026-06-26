import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 60
const FRAME_PATH = (i) => `/frames/frame-${String(i).padStart(3, '0')}.jpg`

const headline = [
  { text: 'WEAR', color: '#FFFFFF' },
  { text: 'YOUR', color: '#FFFFFF' },
  { text: 'VIBE', color: '#FF0099' },
]

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  const heroWrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = 1280
    canvas.height = 720

    // Draw animated gradient fallback
    let frame = 0
    let rafId

    const drawFallback = (t) => {
      const progress = (Math.sin(t * 0.0005) + 1) / 2
      const hue = 300 + progress * 60
      const grad = ctx.createRadialGradient(640, 360, 0, 640, 360, 900)
      grad.addColorStop(0, `hsl(${hue}, 100%, 40%)`)
      grad.addColorStop(0.5, '#1a0010')
      grad.addColorStop(1, '#0A0A0A')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 1280, 720)

      // Decorative circle glow
      const cx = 640 + Math.sin(t * 0.0003) * 80
      const cy = 360 + Math.cos(t * 0.0004) * 40
      const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 280)
      glowGrad.addColorStop(0, 'rgba(255,0,153,0.35)')
      glowGrad.addColorStop(1, 'rgba(255,0,153,0)')
      ctx.fillStyle = glowGrad
      ctx.fillRect(0, 0, 1280, 720)

      // Lime accent
      const lx = 900 + Math.cos(t * 0.0002) * 60
      const ly = 200 + Math.sin(t * 0.0005) * 40
      const limeGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, 160)
      limeGrad.addColorStop(0, 'rgba(191,255,0,0.2)')
      limeGrad.addColorStop(1, 'rgba(191,255,0,0)')
      ctx.fillStyle = limeGrad
      ctx.fillRect(0, 0, 1280, 720)

      frame++
      rafId = requestAnimationFrame(drawFallback)
    }

    // Attempt to load real frames
    const images = []
    let loaded = 0
    let useReal = false

    const tryRealFrames = () => {
      const testImg = new Image()
      testImg.onload = () => {
        useReal = true
        cancelAnimationFrame(rafId)
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          const img = new Image()
          img.src = FRAME_PATH(i + 1)
          img.onload = () => {
            loaded++
            if (loaded === TOTAL_FRAMES) initScrollAnim()
          }
          images.push(img)
        }
      }
      testImg.onerror = () => {
        // No frames — keep fallback running
        rafId = requestAnimationFrame(drawFallback)
      }
      testImg.src = FRAME_PATH(1)
    }

    const initScrollAnim = () => {
      const proxy = { frame: 0 }
      gsap.to(proxy, {
        frame: TOTAL_FRAMES - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: heroWrapRef.current,
          pin: true,
          scrub: 0.5,
          start: 'top top',
          end: '+=2000',
        },
        onUpdate: () => {
          const img = images[Math.round(proxy.frame)]
          if (img?.complete) ctx.drawImage(img, 0, 0, 1280, 720)
        },
      })
    }

    if (!shouldReduceMotion) {
      rafId = requestAnimationFrame(drawFallback)
      tryRealFrames()
    } else {
      // Static gradient for reduced-motion users
      const grad = ctx.createLinearGradient(0, 0, 1280, 720)
      grad.addColorStop(0, '#2a0018')
      grad.addColorStop(1, '#0A0A0A')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 1280, 720)
    }

    return () => {
      cancelAnimationFrame(rafId)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [shouldReduceMotion])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  }
  const wordVariants = shouldReduceMotion
    ? {}
    : {
        hidden: { y: 80, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }

  return (
    <section
      id="hero"
      ref={heroWrapRef}
      aria-label="Hero: scroll to explore VIBE"
      className="relative min-h-screen flex items-center justify-center bg-onyx overflow-hidden"
    >
      {/* 1280×720 scroll-animation container */}
      <div className="relative w-full max-w-[1280px] mx-auto aspect-[1280/720] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="frame-crisp w-full h-full"
          role="img"
          aria-label="VIBE lipstick brand visual — animated product showcase"
        />

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-onyx/40 via-transparent to-transparent pointer-events-none" />

        {/* Headline overlay */}
        <div className="absolute inset-0 flex flex-col items-start justify-end pb-12 px-8 md:px-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-x-6 gap-y-2 items-baseline mb-4">
              {headline.map(({ text, color }) => (
                <motion.span
                  key={text}
                  variants={wordVariants}
                  className="block font-display font-extrabold leading-none"
                  style={{
                    color,
                    fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                    lineHeight: 0.92,
                    ...(color === '#FF0099' && {
                      textShadow: '0 0 20px rgba(255,0,153,0.6), 0 0 60px rgba(255,0,153,0.3)',
                    }),
                  }}
                >
                  {text}
                </motion.span>
              ))}
            </div>

            <motion.p
              variants={wordVariants}
              className="font-body text-white/70 text-lg md:text-xl font-medium mb-8 tracking-wide"
            >
              No rules. Just colour.
            </motion.p>

            <motion.div variants={wordVariants} className="flex items-center gap-4">
              <a
                href="#tint-lab"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF0099] text-white font-body font-bold text-sm tracking-widest rounded-full
                  hover:bg-[#BFFF00] hover:text-[#0A0A0A] transition-all duration-300 cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFFF00]"
              >
                SHOP THE DROP
              </a>
              <a
                href="#formula-flex"
                className="inline-flex items-center gap-2 text-white/60 hover:text-[#BFFF00] font-body text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                Our Formula
                <ArrowDown size={16} className="animate-bounce" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative corner tag */}
        <div className="absolute top-6 right-6 border border-[#FF0099]/30 rounded px-3 py-1">
          <span className="font-body text-xs text-[#FF0099] tracking-widest font-semibold">
            SS '25 DROP
          </span>
        </div>
      </div>

      {/* Marquee ticker below hero */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-[#FF0099] py-2.5">
        <div className="marquee-track select-none" aria-hidden="true">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="font-display font-extrabold text-sm tracking-widest text-onyx mx-8">
              WEAR YOUR VIBE &nbsp;✦&nbsp; 24HR STAY &nbsp;✦&nbsp; VEGAN &nbsp;✦&nbsp; SMUDGE-PROOF &nbsp;✦&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
