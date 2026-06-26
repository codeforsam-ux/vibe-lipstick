import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Shop', href: '#tint-lab' },
  { label: 'Formula', href: '#formula-flex' },
  { label: 'Community', href: '#community' },
  { label: 'Drop', href: '#drop-alert' },
]

function MagneticButton({ children, className, href }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 350, damping: 20 })
  const springY = useSpring(y, { stiffness: 350, damping: 20 })

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.35)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-500 ${
        scrolled
          ? 'bg-onyx/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/40'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-20">
        {/* Logo */}
        <a
          href="#"
          className="font-display text-3xl font-extrabold tracking-tight text-[#FF0099] glow-pink cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF0099] focus-visible:outline-none rounded"
        >
          VIBE
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="font-body text-sm font-medium text-white/70 hover:text-[#BFFF00] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFFF00] rounded"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:block">
          <MagneticButton
            href="#tint-lab"
            className="inline-block px-6 py-2.5 bg-[#FF0099] text-white font-body font-bold text-sm rounded-full
              hover:bg-white hover:text-[#FF0099] transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFFF00] cursor-pointer"
          >
            SHOP NOW
          </MagneticButton>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-white p-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0099] cursor-pointer"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-onyx/95 backdrop-blur-xl border-t border-white/10 px-6 pb-6"
        >
          <ul className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block font-body text-lg font-semibold text-white hover:text-[#FF0099] transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#tint-lab"
                onClick={() => setOpen(false)}
                className="inline-block mt-2 px-6 py-3 bg-[#FF0099] text-white font-body font-bold rounded-full"
              >
                SHOP NOW
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  )
}
