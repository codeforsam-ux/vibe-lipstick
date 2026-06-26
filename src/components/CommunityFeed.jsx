import { motion } from 'framer-motion'
import { Heart, MessageCircle } from 'lucide-react'

const UGC_POSTS = [
  {
    id: 1,
    handle: '@zara_codes',
    shade: 'Cyber Crush',
    likes: 8421,
    comments: 312,
    aspect: 'aspect-[3/4]',
    gradient: 'linear-gradient(135deg, #FF0099 0%, #7700aa 100%)',
    accent: '#FF0099',
  },
  {
    id: 2,
    handle: '@naya_glow',
    shade: 'Glitch Pink',
    likes: 5632,
    comments: 201,
    aspect: 'aspect-square',
    gradient: 'linear-gradient(145deg, #FF66CC 0%, #cc0066 100%)',
    accent: '#FF66CC',
  },
  {
    id: 3,
    handle: '@rei.aesthetic',
    shade: 'Void Plum',
    likes: 12089,
    comments: 447,
    aspect: 'aspect-[3/4]',
    gradient: 'linear-gradient(135deg, #6600CC 0%, #220044 100%)',
    accent: '#9933ff',
  },
  {
    id: 4,
    handle: '@mish.vibes',
    shade: 'Acid Bloom',
    likes: 3891,
    comments: 98,
    aspect: 'aspect-[4/3]',
    gradient: 'linear-gradient(135deg, #BFFF00 0%, #66AA00 100%)',
    accent: '#BFFF00',
  },
  {
    id: 5,
    handle: '@koko.tinted',
    shade: 'Solar Flare',
    likes: 7203,
    comments: 255,
    aspect: 'aspect-square',
    gradient: 'linear-gradient(145deg, #FF5500 0%, #CC2200 100%)',
    accent: '#FF5500',
  },
  {
    id: 6,
    handle: '@dev.reddlips',
    shade: 'Onyx Velvet',
    likes: 9874,
    comments: 389,
    aspect: 'aspect-[3/4]',
    gradient: 'linear-gradient(135deg, #2d2d5e 0%, #0a0a1a 100%)',
    accent: '#4444aa',
  },
  {
    id: 7,
    handle: '@pix.official',
    shade: 'Cyber Crush',
    likes: 6211,
    comments: 178,
    aspect: 'aspect-[4/3]',
    gradient: 'linear-gradient(135deg, #FF0099 0%, #550033 100%)',
    accent: '#FF0099',
  },
  {
    id: 8,
    handle: '@luna.looks',
    shade: 'Glitch Pink',
    likes: 4456,
    comments: 133,
    aspect: 'aspect-square',
    gradient: 'linear-gradient(145deg, #ff99dd 0%, #FF0099 100%)',
    accent: '#ff99dd',
  },
  {
    id: 9,
    handle: '@aara.beauty',
    shade: 'Void Plum',
    likes: 11320,
    comments: 521,
    aspect: 'aspect-[3/4]',
    gradient: 'linear-gradient(135deg, #aa44ff 0%, #330066 100%)',
    accent: '#aa44ff',
  },
]

function formatNum(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n
}

function UGCCard({ post, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="break-inside-avoid mb-5 group cursor-pointer"
    >
      <div
        className="relative rounded-2xl overflow-hidden border border-white/5
          hover:border-[#FF0099]/50 transition-all duration-300"
      >
        {/* Placeholder "photo" */}
        <div className={`relative ${post.aspect} overflow-hidden`}>
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{ background: post.gradient }}
          />

          {/* Decorative circles simulating face/content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-20 h-20 rounded-full opacity-30"
              style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}
            />
          </div>

          {/* Shade label chip */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-body font-bold"
            style={{
              background: `${post.accent}22`,
              color: post.accent,
              border: `1px solid ${post.accent}44`,
              backdropFilter: 'blur(8px)',
            }}
          >
            {post.shade}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-onyx/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300
            flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 font-body font-semibold text-white text-sm">
                <Heart size={18} className="fill-white" />
                {formatNum(post.likes)}
              </span>
              <span className="flex items-center gap-1.5 font-body font-semibold text-white text-sm">
                <MessageCircle size={18} className="fill-white" />
                {formatNum(post.comments)}
              </span>
            </div>
          </div>
        </div>

        {/* Card footer */}
        <div className="bg-[#111] px-4 py-3 flex items-center justify-between">
          <span className="font-body text-sm font-medium text-white/70">{post.handle}</span>
          <div className="flex items-center gap-1 text-white/40">
            <Heart size={13} />
            <span className="font-body text-xs">{formatNum(post.likes)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CommunityFeed() {
  return (
    <section id="community" className="py-24 bg-onyx">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <p className="font-body text-[#BFFF00] text-sm font-semibold tracking-[0.3em] uppercase mb-2">
              #WearYourVibe
            </p>
            <h2
              className="font-display font-extrabold text-white leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              COMMUNITY FEED
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 font-body font-semibold text-sm text-[#FF0099]
              border border-[#FF0099]/30 rounded-full px-5 py-2.5
              hover:bg-[#FF0099] hover:text-white transition-all duration-200 cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFFF00] self-start md:self-auto"
          >
            Tag #WearYourVibe
          </a>
        </motion.div>

        {/* Masonry grid */}
        <div
          className="columns-2 md:columns-3 lg:columns-4 gap-5"
          style={{ columnGap: '20px' }}
        >
          {UGC_POSTS.map((post, i) => (
            <UGCCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
