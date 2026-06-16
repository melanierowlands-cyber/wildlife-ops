import { useState, useEffect } from 'react'
import OverviewScreen from './OverviewScreen'

/* Pixel-faithful Mziki prototype shell.
   Renders 1280×832 Figma artboards, scaled to fit the viewport width. */
const SCREENS = { overview: OverviewScreen }

export default function MzikiPrototype({ onExit }) {
  const [screen, setScreen] = useState('overview')
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const fit = () => setScale(Math.min(1, window.innerWidth / 1280))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const navigate = (id) => { if (SCREENS[id]) setScreen(id) }
  const Screen = SCREENS[screen] || OverviewScreen

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#003b34', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflowX: 'hidden' }}>
      <style>{`
        @keyframes protoPulse { 0% { transform: scale(.7); opacity:.55 } 80%,100% { transform: scale(2.4); opacity:0 } }
        .proto-pulse::before { content:''; position:absolute; inset:0; border-radius:50%; background:#d29b00; animation: protoPulse 2.6s cubic-bezier(.21,.61,.35,1) infinite; }
        @media (prefers-reduced-motion: reduce) { .proto-pulse::before { animation:none } }
      `}</style>

      <div style={{ width: 1280 * scale, height: 832 * scale, position: 'relative' }}>
        <div style={{ width: 1280, height: 832, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
          <Screen onNavigate={navigate} active={screen} />
        </div>
      </div>

      <button
        onClick={onExit}
        style={{
          position: 'fixed', right: 16, bottom: 16, zIndex: 50, cursor: 'pointer',
          padding: '9px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.22)',
          background: 'rgba(0,40,34,0.82)', backdropFilter: 'blur(8px)', color: '#f4f1ea',
          fontFamily: '"Hanken Grotesk", sans-serif', fontSize: 13, fontWeight: 600,
          boxShadow: '0 8px 24px -8px rgba(0,0,0,0.5)',
        }}
      >
        ← Back to live app
      </button>
    </div>
  )
}
