import { useRef, useState } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import { ShoppingBag, Star } from 'lucide-react'

const SHADES = [
  {
    id: 1,
    name: 'Cyber Crush',
    price: '₹899',
    hex: '#FF0099',
    img: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2263?w=560&h=420&q=80&fit=crop&auto=format',
    tint: 'rgba(255,0,153,0.25)',
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
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=560&h=420&q=80&fit=crop&auto=format',
    tint: 'rgba(191,255,0,0.20)',
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
    hex: '#6666cc',
    img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=560&h=420&q=80&fit=crop&auto=format',
    tint: 'rgba(80,40,120,0.30)',
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
    img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=560&h=420&q=80&fit=crop&auto=format',
    tint: 'rgba(255,85,0,0.22)',
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
    img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=560&h=420&q=80&fit=crop&auto=format',
    tint: 'rgba(255,102,204,0.22)',
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
    hex: '#9933ff',
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=560&h=420&q=80&fit=crop&auto=format',
    tint: 'rgba(100,0,180,0.28)',
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
  const [imgError, setImgError] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div
      className="relative flex-shrink-0 w-[260px] md:w-[280px] bg-[#18131F] rounded-2xl overflow-hidden
        border border-white/5 hover:border-[#FF0099]/40 transition-all duration-300 cursor-pointer group"
    >
      {/* Swatch zone */}
      <div className="relative h-52 overflow-hidden">
        {/* Product image */}
        {!imgError ? (
          <img
            src={shade.img}
            alt={`${shade.name} lipstick`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Gradient fallback */
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 35% 35%, ${shade.hex}, ${shade.hex}55)`,
            }}
          />
        )}

        {/* Shade tint overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: shade.tint, mixBlendMode: 'multiply' }}
        />

        {/* Skin-tone liquid reveal overlay */}
        <div
          className={`absolute inset-0 liquid-reveal ${hoveredTone ? 'revealed' : ''}`}
          style={{ background: hoveredTone ? shade.tones[hoveredTone] : 'transparent', opacity: 0.7 }}
        />

        {/* Shade colour chip — top left */}
        <div
          className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full backdrop-blur-sm"
          style={{ background: 'rgba(13,10,20,0.7)', border: `1px solid ${shade.hex}55` }}
        >
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: shade.hex }}
          />
          <span className="font-body text-xs font-semibold text-white/80 leading-none">
            {shade.name}
          </span>
        </div>

        {/* Glow ring on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-t-2xl"
          style={{ boxShadow: `inset 0 0 40px ${shade.hex}30` }}
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
              ? 'bg-[#BFFF00] text-[#0D0A14]'
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
  const autoScroll = useRef(true)

  useAnimationFrame(() => {
    if (!trackRef.current || !autoScroll.current) return
    trackRef.current.scrollLeft += 0.5
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
          cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          touchAction: 'pan-x',
          WebkitOverflowScrolling: 'touch',
        }}
      >
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
