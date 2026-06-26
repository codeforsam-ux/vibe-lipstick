import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { CheckCircle, Loader2, Zap } from 'lucide-react'

function MagneticBtn({ children, type, disabled, className }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 300, damping: 18 })
  const sy = useSpring(my, { stiffness: 300, damping: 18 })

  const onMove = (e) => {
    const el = ref.current
    if (!el || disabled) return
    const rect = el.getBoundingClientRect()
    mx.set((e.clientX - (rect.left + rect.width / 2)) * 0.4)
    my.set((e.clientY - (rect.top + rect.height / 2)) * 0.4)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.button>
  )
}

export default function DropAlert() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    await new Promise((r) => setTimeout(r, 1200))
    setStatus('success')
    setEmail('')
  }

  return (
    <section id="drop-alert" className="bg-[#FF0099] py-24 md:py-32 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #BFFF00 0%, transparent 70%)' }}
      />

      <div className="max-w-3xl mx-auto px-6 md:px-10 relative z-10 text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0A0A0A] mb-8 mx-auto"
        >
          <Zap size={32} className="text-[#FF0099]" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold text-[#0A0A0A] leading-none mb-4"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}
        >
          GET THE DROP FIRST
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-body text-[#0A0A0A]/70 text-lg mb-10 font-medium"
        >
          New shades. Limited drops. Zero FOMO.
          <br />
          <span className="text-sm font-normal">Join 42,000+ insiders already in the loop.</span>
        </motion.p>

        {/* Form */}
        {status === 'success' ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 16 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#0A0A0A]">
              <CheckCircle size={40} className="text-[#BFFF00]" />
            </div>
            <p className="font-display font-extrabold text-[#0A0A0A] text-2xl">
              You're in the vibe.
            </p>
            <p className="font-body text-[#0A0A0A]/60 text-sm">
              Check your inbox for your early-access invite.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            noValidate
          >
            <div className="flex-1">
              <label htmlFor="drop-email" className="sr-only">
                Email address
              </label>
              <input
                id="drop-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address for drop alerts"
                className="neon-focus w-full px-5 py-4 rounded-2xl bg-[#0D0A14] text-white
                  font-body text-sm placeholder:text-white/30
                  border border-white/10 hover:border-white/20 transition-colors duration-200
                  outline-none"
              />
            </div>
            <MagneticBtn
              type="submit"
              disabled={status === 'loading' || !email}
              className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl
                bg-[#BFFF00] text-[#0A0A0A] font-body font-extrabold text-sm tracking-wide
                hover:bg-[#0A0A0A] hover:text-[#BFFF00] transition-all duration-300
                disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A]
                whitespace-nowrap"
            >
              {status === 'loading' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'JOIN THE VIBE'
              )}
            </MagneticBtn>
          </motion.form>
        )}

        <p className="mt-4 font-body text-[#0A0A0A]/40 text-xs">
          No spam. Unsubscribe anytime. By signing up you agree to our privacy policy.
        </p>
      </div>
    </section>
  )
}
