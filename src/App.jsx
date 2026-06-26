import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import TintLab from './components/TintLab'
import FormulaFlex from './components/FormulaFlex'
import CommunityFeed from './components/CommunityFeed'
import DropAlert from './components/DropAlert'

function Footer() {
  return (
    <footer
      className="bg-[#0A0A0A] border-t border-white/5 py-12"
      style={{ paddingBottom: 'calc(3rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <span className="font-display font-extrabold text-4xl text-[#FF0099] glow-pink">
              VIBE
            </span>
            <p className="font-body text-white/30 text-sm mt-1">No rules. Just colour.</p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {['Shop', 'About', 'Ingredients', 'Sustainability', 'Contact', 'Privacy'].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="font-body text-sm text-white/40 hover:text-[#FF0099] transition-colors duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0099] rounded"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="font-body text-white/20 text-xs">
            © 2025 VIBE Beauty. All rights reserved.
          </p>
          <p className="font-body text-white/20 text-xs">
            100% Vegan · Cruelty-Free · Made with Chaos
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TintLab />
        <FormulaFlex />
        <CommunityFeed />
        <DropAlert />
      </main>
      <Footer />
    </>
  )
}
