import { useState, useEffect } from 'react'
import OverviewScreen from './OverviewScreen'
import AnimalHealthScreen from './AnimalHealthScreen'
import TeamDispatchScreen from './TeamDispatchScreen'

/* Pixel-faithful Mziki prototype shell.
   Renders 1280×832 Figma artboards, scaled to fit the viewport width. */
const SCREENS = { overview: OverviewScreen, animal: AnimalHealthScreen, dispatch: TeamDispatchScreen }

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
        @keyframes protoFade { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }
        .proto-fade { animation: protoFade .28s cubic-bezier(.22,.61,.36,1) both; }
        @keyframes protoDraw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
        .proto-draw { stroke-dasharray: 1; animation: protoDraw 1s cubic-bezier(.22,.61,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .proto-pulse::before, .proto-fade, .proto-draw { animation:none } }
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
          padding: '7px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.18)',
          background: 'rgba(0,40,34,0.55)', backdropFilter: 'blur(8px)', color: 'rgba(244,241,234,0.75)',
          fontFamily: '"Hanken Grotesk", sans-serif', fontSize: 12, fontWeight: 500,
          boxShadow: '0 8px 24px -8px rgba(0,0,0,0.4)',
        }}
      >
        Old version ↗
      </button>
    </div>
  )
}
