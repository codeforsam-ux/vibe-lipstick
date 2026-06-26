import { useState } from 'react'
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
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=540&q=80&fit=crop&auto=format',
    accent: '#FF0099',
  },
  {
    id: 2,
    handle: '@naya_glow',
    shade: 'Glitch Pink',
    likes: 5632,
    comments: 201,
    aspect: 'aspect-square',
    img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&q=80&fit=crop&auto=format',
    accent: '#FF66CC',
  },
  {
    id: 3,
    handle: '@rei.aesthetic',
    shade: 'Void Plum',
    likes: 12089,
    comments: 447,
    aspect: 'aspect-[3/4]',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=540&q=80&fit=crop&auto=format',
    accent: '#9933ff',
  },
  {
    id: 4,
    handle: '@mish.vibes',
    shade: 'Acid Bloom',
    likes: 3891,
    comments: 98,
    aspect: 'aspect-[4/3]',
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=300&q=80&fit=crop&auto=format',
    accent: '#BFFF00',
  },
  {
    id: 5,
    handle: '@koko.tinted',
    shade: 'Solar Flare',
    likes: 7203,
    comments: 255,
    aspect: 'aspect-square',
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&q=80&fit=crop&auto=format',
    accent: '#FF5500',
  },
  {
    id: 6,
    handle: '@dev.reddlips',
    shade: 'Onyx Velvet',
    likes: 9874,
    comments: 389,
    aspect: 'aspect-[3/4]',
    img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=540&q=80&fit=crop&auto=format',
    accent: '#8855ff',
  },
  {
    id: 7,
    handle: '@pix.official',
    shade: 'Cyber Crush',
    likes: 6211,
    comments: 178,
    aspect: 'aspect-[4/3]',
    img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=300&q=80&fit=crop&auto=format',
    accent: '#FF0099',
  },
  {
    id: 8,
    handle: '@luna.looks',
    shade: 'Glitch Pink',
    likes: 4456,
    comments: 133,
    aspect: 'aspect-square',
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400&h=400&q=80&fit=crop&auto=format',
    accent: '#FF66CC',
  },
  {
    id: 9,
    handle: '@aara.beauty',
    shade: 'Void Plum',
    likes: 11320,
    comments: 521,
    aspect: 'aspect-[3/4]',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=540&q=80&fit=crop&auto=format',
    accent: '#aa44ff',
  },
]

function formatNum(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n
}

function UGCCard({ post, index }) {
  const [imgError, setImgError] = useState(false)

  const fallbackGradients = {
    '#FF0099': 'linear-gradient(135deg, #FF0099 0%, #7700aa 100%)',
    '#FF66CC': 'linear-gradient(145deg, #FF66CC 0%, #cc0066 100%)',
    '#9933ff': 'linear-gradient(135deg, #6600CC 0%, #220044 100%)',
    '#BFFF00': 'linear-gradient(135deg, #BFFF00 0%, #66AA00 100%)',
    '#FF5500': 'linear-gradient(145deg, #FF5500 0%, #CC2200 100%)',
    '#8855ff': 'linear-gradient(135deg, #6600CC 0%, #220044 100%)',
    '#aa44ff': 'linear-gradient(135deg, #aa44ff 0%, #330066 100%)',
  }

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
        {/* Photo area */}
        <div className={`relative ${post.aspect} overflow-hidden bg-[#18131F]`}>
          {!imgError ? (
            <img
              src={post.img}
              alt={`${post.handle} wearing ${post.shade}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: fallbackGradients[post.accent] || fallbackGradients['#FF0099'] }}
            />
          )}

          {/* Subtle dark vignette at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A14]/70 via-transparent to-transparent pointer-events-none" />

          {/* Shade label chip */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-body font-bold backdrop-blur-sm"
            style={{
              background: `${post.accent}22`,
              color: post.accent,
              border: `1px solid ${post.accent}55`,
            }}
          >
            {post.shade}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#0D0A14]/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300
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
        <div className="bg-[#18131F] px-4 py-3 flex items-center justify-between">
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
        <div className="columns-2 md:columns-3 lg:columns-4" style={{ columnGap: '20px' }}>
          {UGC_POSTS.map((post, i) => (
            <UGCCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
