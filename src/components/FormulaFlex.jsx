import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const USPS = [
  {
    label: '24HR STAY',
    desc: 'Lock-in formula that survives coffee, chaos, and everything in between.',
    color: '#FF0099',
    num: '01',
  },
  {
    label: 'VEGAN',
    desc: '100% plant-derived. Zero animal by-products. Certified by PETA.',
    color: '#BFFF00',
    num: '02',
  },
  {
    label: 'SMUDGE-PROOF',
    desc: 'Quantum-bond pigment that bends but never breaks — even through masks.',
    color: '#FFFFFF',
    num: '03',
  },
  {
    label: 'CRUELTY-FREE',
    desc: 'Never tested on animals. Our ethics are as bold as our shades.',
    color: '#FF0099',
    num: '04',
  },
]

function USPRow({ usp, index }) {
  const rowRef = useRef(null)
  const wordsRef = useRef([])
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce || !rowRef.current) return
    const words = wordsRef.current.filter(Boolean)
    gsap.fromTo(
      words,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rowRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [shouldReduce])

  const words = usp.label.split(' ')

  return (
    <div
      ref={rowRef}
      className={`border-t border-white/10 py-10 md:py-14 flex flex-col md:flex-row
        items-start md:items-center gap-6 md:gap-10 group
        hover:bg-white/2 transition-colors duration-300`}
    >
      {/* Number */}
      <span className="font-display font-extrabold text-white/10 text-5xl md:text-7xl leading-none w-24 flex-shrink-0 select-none">
        {usp.num}
      </span>

      {/* Kinetic word(s) */}
      <div className="flex flex-wrap gap-2 md:gap-4 flex-1 overflow-hidden">
        {words.map((word, wi) => (
          <span
            key={wi}
            ref={(el) => (wordsRef.current[wi] = el)}
            className="block font-display font-extrabold leading-none"
            style={{
              color: usp.color,
              fontSize: 'clamp(2.8rem, 6vw, 6rem)',
              lineHeight: 0.9,
              opacity: shouldReduce ? 1 : undefined,
              ...(usp.color === '#FF0099' && {
                textShadow: '0 0 30px rgba(255,0,153,0.4)',
              }),
              ...(usp.color === '#BFFF00' && {
                textShadow: '0 0 20px rgba(191,255,0,0.3)',
              }),
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Description */}
      <motion.p
        initial={shouldReduce ? {} : { opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
        className="font-body text-white/50 text-sm md:text-base leading-relaxed max-w-xs md:max-w-sm flex-shrink-0"
      >
        {usp.desc}
      </motion.p>
    </div>
  )
}

export default function FormulaFlex() {
  return (
    <section id="formula-flex" className="stripe-bg py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <p className="font-body text-[#FF0099] text-sm font-semibold tracking-[0.3em] uppercase mb-2">
            Our Formula
          </p>
          <h2
            className="font-display font-extrabold text-white leading-none"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            FORMULA FLEX
          </h2>
        </motion.div>

        {/* USP rows */}
        <div>
          {USPS.map((usp, i) => (
            <USPRow key={usp.num} usp={usp} index={i} />
          ))}
        </div>

        {/* Bottom cta row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <p className="font-body text-white/40 text-sm max-w-md">
            Each shade goes through 18 months of lab testing before it earns the VIBE stamp.
          </p>
          <a
            href="#tint-lab"
            className="inline-flex items-center gap-3 font-body font-bold text-sm text-[#BFFF00]
              border-b border-[#BFFF00]/40 pb-0.5 hover:border-[#BFFF00] transition-all duration-200
              cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFFF00] rounded"
          >
            Shop All Shades
            <span className="text-lg leading-none">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
