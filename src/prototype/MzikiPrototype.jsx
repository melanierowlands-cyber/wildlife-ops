import { useState, useEffect } from 'react'
import OverviewScreen from './OverviewScreen'
import AnimalHealthScreen from './AnimalHealthScreen'
import TeamDispatchScreen from './TeamDispatchScreen'
import ModalHost from './Modals'
import { useIsMobile, COL, HG } from './shared'
import { MobileHeader, MobileTabBar } from './Chrome'

/* Pixel-faithful Mziki prototype shell.
   Desktop: renders 1280×832 Figma artboards, scaled to fit the viewport.
   Mobile (≤760px): renders dedicated stacked layouts with bottom-tab nav. */
const SCREENS = { overview: OverviewScreen, animal: AnimalHealthScreen, dispatch: TeamDispatchScreen }
const TITLES = { overview: 'Reserve Overview', animal: 'Animal Health', dispatch: 'Team Dispatch' }

const KEYFRAMES = `
  @keyframes protoPulse { 0% { transform: scale(.7); opacity:.55 } 80%,100% { transform: scale(2.4); opacity:0 } }
  .proto-pulse::before { content:''; position:absolute; inset:0; border-radius:50%; background:#d29b00; animation: protoPulse 2.6s cubic-bezier(.21,.61,.35,1) infinite; }
  @keyframes protoFade { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }
  .proto-fade { animation: protoFade .28s cubic-bezier(.22,.61,.36,1) both; }
  @keyframes protoDraw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
  .proto-draw { stroke-dasharray: 1; animation: protoDraw 1s cubic-bezier(.22,.61,.36,1) both; }
  @keyframes protoModal { from { opacity:0; transform: translateY(8px) scale(.97) } to { opacity:1; transform:none } }
  .proto-modal { animation: protoModal .2s cubic-bezier(.22,.61,.36,1) both; }
  @keyframes ovMapPulse{0%{transform:translate(-50%,-50%) scale(.6);opacity:.55}80%,100%{transform:translate(-50%,-50%) scale(2.6);opacity:0}}
  .mob-scroll::-webkit-scrollbar { height:0; width:0; display:none }
  .mob-scroll { scrollbar-width:none }
  @media (prefers-reduced-motion: reduce) { .proto-pulse::before, .proto-fade, .proto-draw, .proto-modal { animation:none } }
`

export default function MzikiPrototype({ onExit }) {
  const [screen, setScreen] = useState('overview')
  const [scale, setScale] = useState(1)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    // Contain-fit the 1280×832 artboard within the viewport (both axes),
    // so the whole dashboard stays fully visible and maximized on any screen.
    const fit = () => setScale(Math.min(window.innerWidth / 1280, window.innerHeight / 832))
    fit()
    window.addEventListener('resize', fit)
    window.addEventListener('orientationchange', fit)
    return () => {
      window.removeEventListener('resize', fit)
      window.removeEventListener('orientationchange', fit)
    }
  }, [])

  const navigate = (id) => { if (SCREENS[id]) setScreen(id) }
  const openModal = (type, animal) => setModal({ type, animal })
  const closeModal = () => setModal(null)
  const submitModal = (msg) => { setModal(null); setToast(msg); clearTimeout(submitModal._t); submitModal._t = setTimeout(() => setToast(null), 2800) }
  const Screen = SCREENS[screen] || OverviewScreen
  const isMobile = useIsMobile()

  const Toast = (
    <div style={{ position: 'fixed', left: '50%', bottom: isMobile ? 80 : 24, zIndex: 70, transform: `translateX(-50%) translateY(${toast ? 0 : 12}px)`, opacity: toast ? 1 : 0, transition: 'opacity .2s ease, transform .2s ease', pointerEvents: 'none', background: 'rgba(0,40,34,0.94)', color: '#f4f1ea', padding: '11px 20px', borderRadius: 999, fontFamily: '"Hanken Grotesk", sans-serif', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', maxWidth: '90vw', overflow: 'hidden', textOverflow: 'ellipsis', boxShadow: '0 10px 28px -10px rgba(0,0,0,0.5)', border: '1px solid #d29b00' }}>
      {toast || ''}
    </div>
  )

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', width: '100%', background: COL.canvas, fontFamily: HG }}>
        <style>{KEYFRAMES}</style>
        <MobileHeader title={TITLES[screen]} />
        <main style={{ padding: '14px 13px calc(78px + env(safe-area-inset-bottom))' }}>
          <Screen onNavigate={navigate} active={screen} onOpenModal={openModal} mobile />
        </main>
        <MobileTabBar active={screen} onNavigate={navigate} />
        <ModalHost modal={modal} onClose={closeModal} onSubmit={submitModal} />
        {Toast}
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#003b34', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <style>{KEYFRAMES}</style>

      <div style={{ width: 1280 * scale, height: 832 * scale, position: 'relative' }}>
        <div style={{ width: 1280, height: 832, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
          <Screen onNavigate={navigate} active={screen} onOpenModal={openModal} />
        </div>
      </div>

      <ModalHost modal={modal} onClose={closeModal} onSubmit={submitModal} />
      {Toast}

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
