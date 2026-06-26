import { useRef, useState } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import { ShoppingBag, Star } from 'lucide-react'

const SHADES = [
  {
    id: 1,
    name: 'Cyber Crush',
    price: '₹899',
    hex: '#FF0099',
    gradient: 'radial-gradient(ellipse at 30% 30%, #FF3AB0, #CC007A)',
    tones: {
      light: 'linear-gradient(135deg, #f5cba7, #f0a080)',
      medium: 'linear-gradient(135deg, #c68642, #a0522d)',
      deep: 'linear-gradient(135deg, #5c3317, #3b1a0a)',
    },
    rating: 4.9,
    reviews: 2341,
  },
  {
    id: 2,
    name: 'Acid Bloom',
    price: '₹899',
    hex: '#BFFF00',
    gradient: 'radial-gradient(ellipse at 30% 30%, #d4ff33, #8fcc00)',
    tones: {
      light: 'linear-gradient(135deg, #f5cba7, #f0a080)',
      medium: 'linear-gradient(135deg, #c68642, #a0522d)',
      deep: 'linear-gradient(135deg, #5c3317, #3b1a0a)',
    },
    rating: 4.7,
    reviews: 1876,
  },
  {
    id: 3,
    name: 'Onyx Velvet',
    price: '₹949',
    hex: '#1A1A2E',
    gradient: 'radial-gradient(ellipse at 30% 30%, #2d2d5e, #0a0a1a)',
    tones: {
      light: 'linear-gradient(135deg, #f5cba7, #f0a080)',
      medium: 'linear-gradient(135deg, #c68642, #a0522d)',
      deep: 'linear-gradient(135deg, #5c3317, #3b1a0a)',
    },
    rating: 4.8,
    reviews: 3102,
  },
  {
    id: 4,
    name: 'Solar Flare',
    price: '₹849',
    hex: '#FF5500',
    gradient: 'radial-gradient(ellipse at 30% 30%, #ff7733, #cc3300)',
    tones: {
      light: 'linear-gradient(135deg, #f5cba7, #f0a080)',
      medium: 'linear-gradient(135deg, #c68642, #a0522d)',
      deep: 'linear-gradient(135deg, #5c3317, #3b1a0a)',
    },
    rating: 4.6,
    reviews: 987,
  },
  {
    id: 5,
    name: 'Glitch Pink',
    price: '₹899',
    hex: '#FF66CC',
    gradient: 'radial-gradient(ellipse at 30% 30%, #ff99dd, #ff33aa)',
    tones: {
      light: 'linear-gradient(135deg, #f5cba7, #f0a080)',
      medium: 'linear-gradient(135deg, #c68642, #a0522d)',
      deep: 'linear-gradient(135deg, #5c3317, #3b1a0a)',
    },
    rating: 4.9,
    reviews: 4211,
  },
  {
    id: 6,
    name: 'Void Plum',
    price: '₹949',
    hex: '#6600CC',
    gradient: 'radial-gradient(ellipse at 30% 30%, #9933ff, #440099)',
    tones: {
      light: 'linear-gradient(135deg, #f5cba7, #f0a080)',
      medium: 'linear-gradient(135deg, #c68642, #a0522d)',
      deep: 'linear-gradient(135deg, #5c3317, #3b1a0a)',
    },
    rating: 4.8,
    reviews: 1654,
  },
]

const TONE_LABELS = { light: 'Fair', medium: 'Medium', deep: 'Deep' }

function ShadeCard({ shade }) {
  const [hoveredTone, setHoveredTone] = useState(null)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div
      className="relative flex-shrink-0 w-[260px] md:w-[280px] bg-[#111] rounded-2xl overflow-hidden
        border border-white/5 hover:border-[#FF0099]/40 transition-all duration-300 cursor-pointer group"
    >
      {/* Swatch zone */}
      <div className="relative h-52 overflow-hidden">
        {/* Base gradient */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{ background: shade.gradient }}
        />

        {/* Liquid reveal: skin tone layer */}
        <div
          className={`absolute inset-0 liquid-reveal ${hoveredTone ? 'revealed' : ''}`}
          style={{ background: hoveredTone ? shade.tones[hoveredTone] : 'transparent' }}
        />

        {/* Lipstick bullet SVG-style shape overlay */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div
            className="w-10 h-28 rounded-t-[40%] shadow-2xl"
            style={{ background: shade.gradient, boxShadow: `0 0 30px ${shade.hex}80` }}
          />
          <div className="w-14 h-6 bg-[#111] rounded-t-lg" />
        </div>

        {/* Glow ring on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-t-2xl"
          style={{ boxShadow: `inset 0 0 40px ${shade.hex}40` }}
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display font-bold text-white text-lg leading-tight">{shade.name}</h3>
          <span className="font-body font-semibold text-[#FF0099] text-sm">{shade.price}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {Array(5).fill(null).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(shade.rating) ? 'text-[#BFFF00] fill-[#BFFF00]' : 'text-white/20'}
              />
            ))}
          </div>
          <span className="font-body text-xs text-white/40">{shade.reviews.toLocaleString()}</span>
        </div>

        {/* Tone selector */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="font-body text-xs text-white/40 mr-1">Tone:</span>
          {Object.entries(TONE_LABELS).map(([key, label]) => (
            <button
              key={key}
              aria-label={`Show ${label} skin tone`}
              onMouseEnter={() => setHoveredTone(key)}
              onMouseLeave={() => setHoveredTone(null)}
              onFocus={() => setHoveredTone(key)}
              onBlur={() => setHoveredTone(null)}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-200 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFFF00]
                ${hoveredTone === key ? 'border-[#BFFF00] scale-125' : 'border-white/20'}`}
              style={{
                background: key === 'light' ? '#e8b89a' : key === 'medium' ? '#a0522d' : '#3b1a0a',
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleAdd}
          aria-label={`Add ${shade.name} to bag`}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm tracking-wide
            transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFFF00]
            ${added
              ? 'bg-[#BFFF00] text-[#0A0A0A]'
              : 'bg-[#FF0099]/10 text-[#FF0099] border border-[#FF0099]/30 hover:bg-[#FF0099] hover:text-white'
            }`}
        >
          <ShoppingBag size={15} />
          {added ? 'Added!' : 'Add to Bag'}
        </button>
      </div>
    </div>
  )
}

export default function TintLab() {
  const trackRef = useRef(null)
  const isDragging = useRef(false)
  const autoScroll = useRef(true)

  useAnimationFrame(() => {
    if (!trackRef.current || isDragging.current || !autoScroll.current) return
    trackRef.current.scrollLeft += 0.5
    // Reset loop
    if (
      trackRef.current.scrollLeft >=
      trackRef.current.scrollWidth - trackRef.current.clientWidth - 2
    ) {
      trackRef.current.scrollLeft = 0
    }
  })

  return (
    <section id="tint-lab" className="py-24 bg-onyx overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body text-[#BFFF00] text-sm font-semibold tracking-[0.3em] uppercase mb-2">
            Shop Now
          </p>
          <h2 className="font-display font-extrabold text-white leading-none mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            THE TINT LAB
          </h2>
          <div className="h-1 w-24 bg-[#FF0099] rounded-full" />
        </motion.div>
      </div>

      {/* Draggable carousel */}
      <div
        ref={trackRef}
        onMouseEnter={() => { autoScroll.current = false }}
        onMouseLeave={() => { autoScroll.current = true }}
        onTouchStart={() => { autoScroll.current = false }}
        onTouchEnd={() => { setTimeout(() => { autoScroll.current = true }, 2000) }}
        className="flex gap-5 overflow-x-auto pl-6 md:pl-10 pr-6 md:pr-10 pb-4
          scrollbar-none cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          touchAction: 'pan-x',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Render twice for seamless loop feel */}
        {[...SHADES, ...SHADES].map((shade, i) => (
          <ShadeCard key={`${shade.id}-${i}`} shade={shade} />
        ))}
      </div>

      {/* Shade dot nav */}
      <div className="flex justify-center gap-2 mt-8">
        {SHADES.map((shade) => (
          <div
            key={shade.id}
            className="w-3 h-3 rounded-full border border-white/10 cursor-pointer hover:scale-125 transition-transform duration-200"
            style={{ background: shade.hex }}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  )
}
