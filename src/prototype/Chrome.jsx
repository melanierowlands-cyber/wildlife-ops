import { COL, A, text } from './shared'

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'nav-overview.svg', y: 171, lx: 110 },
  { id: 'animal', label: 'Animal Health', icon: 'nav-animal.svg', y: 239, lx: 110 },
  { id: 'dispatch', label: 'Team Dispatch', icon: 'nav-dispatch.svg', y: 307, lx: 112 },
]

export function Sidebar({ active, onNavigate }) {
  const activeNav = NAV.find((n) => n.id === active) || NAV[0]
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 309, height: 832, background: COL.panel }} />
      {/* logo */}
      <div style={{ position: 'absolute', left: 21, top: 46, width: 70, height: 70, borderRadius: 12, background: COL.canvas, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={`${A}/logo-paw.png`} alt="" style={{ width: 46, height: 46, objectFit: 'contain' }} />
      </div>
      <p style={text(112, 46, { fontSize: 36, fontWeight: 500, letterSpacing: '5px', color: COL.ink })}>MZIKI</p>
      <p style={text(115, 93, { fontSize: 16, fontWeight: 700, letterSpacing: '1.28px', color: COL.muted })}>BIG 5 WILDLIFE OPS</p>

      {/* active highlight */}
      <div style={{ position: 'absolute', left: 0, top: activeNav.y - 10, width: 309, height: 70, background: 'rgba(255,255,255,0.70)' }} />
      {NAV.map((n) => {
        const on = n.id === active
        return (
          <button key={n.id} onClick={() => onNavigate && onNavigate(n.id)}
            style={{ position: 'absolute', left: 0, top: n.y - 10, width: 309, height: 70, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <img src={`${A}/${n.icon}`} alt="" style={{ position: 'absolute', left: 45, top: 15, width: 40, height: 40 }} />
            <span style={{ position: 'absolute', left: n.lx, top: 25, fontSize: 16.5, fontWeight: on ? 600 : 400, letterSpacing: on ? '0.4px' : 'normal', color: COL.ink, fontFamily: '"Hanken Grotesk", sans-serif' }}>{n.label}</span>
          </button>
        )
      })}

      {/* all systems live */}
      <div style={{ position: 'absolute', left: 18, top: 552, width: 277, height: 64, borderRadius: 21, background: 'rgba(247,247,242,0.63)', border: '1px solid #f7f7f2' }} />
      <span className="proto-pulse" style={{ position: 'absolute', left: 49, top: 570, width: 11, height: 11 }}>
        <img src={`${A}/live-dot.svg`} alt="" style={{ width: 11, height: 11 }} />
      </span>
      <p style={text(68, 565, { fontSize: 16, color: COL.ink })}>All systems live</p>
      <p style={text(51, 591, { fontSize: 11, color: COL.ink })}>8 signals tracked • synced 06.14</p>

      {/* weather */}
      <div style={{ position: 'absolute', left: 18, top: 632, width: 277, height: 90, borderRadius: 21, background: COL.panelStrong }} />
      <p style={text(52, 643, { fontSize: 20, color: COL.white })}>22°C</p>
      <p style={text(52, 673, { fontSize: 12, color: COL.white, opacity: 0.7 })}>Feels like 19°C  •  clear</p>
      <img src={`${A}/icon-wind.svg`} alt="" style={{ position: 'absolute', left: 52, top: 689, width: 14, height: 14 }} />
      <p style={text(71, 688, { fontSize: 12, color: COL.white })}>14 km/h NW</p>
      <img src={`${A}/icon-humidity.svg`} alt="" style={{ position: 'absolute', left: 160, top: 690, width: 11, height: 11 }} />
      <p style={text(176, 688, { fontSize: 12, color: COL.white })}>68%</p>

      {/* user */}
      <div style={{ position: 'absolute', left: -3, top: 744, width: 312, height: 88, background: COL.gold }} />
      <img src={`${A}/avatar-side.svg`} alt="" style={{ position: 'absolute', left: 27, top: 764, width: 50, height: 50 }} />
      <p style={text(36, 774, { fontSize: 24, color: COL.white, lineHeight: 1.253 })}>KD</p>
      <p style={text(92, 768, { fontSize: 16.5, color: COL.white, lineHeight: 1.253 })}>KUMBA DWONGEZA</p>
      <p style={text(92, 789, { fontSize: 16.5, color: COL.white, lineHeight: 1.253 })}>Head Ranger</p>
    </>
  )
}

export function TopBar({ title }) {
  return (
    <>
      <div style={{ position: 'absolute', left: 310, top: 0, width: 970, height: 58, background: COL.topbar, opacity: 0.44 }} />
      <p style={text(360, 12, { fontSize: 18, fontWeight: 500, color: COL.white })}>{title}</p>
      <p style={text(360, 35, { fontSize: 13, fontWeight: 300, color: COL.white, letterSpacing: '0.39px', lineHeight: 1, textTransform: 'capitalize' })}>Mon, 15 June 2025  - 06.14 AM SAST</p>
      <div style={{ position: 'absolute', left: 647, top: 16, width: 417, height: 30, borderRadius: 10, background: COL.search }} />
      <img src={`${A}/ic-search.svg`} alt="" style={{ position: 'absolute', left: 660, top: 24, width: 14, height: 14 }} />
      <p style={text(677, 25, { fontSize: 12, color: COL.ink })}>Search animals, sectors, incidents...</p>
      <img src={`${A}/ic-settings.svg`} alt="" style={{ position: 'absolute', left: 1123, top: 14, width: 30, height: 30 }} />
      <img src={`${A}/ic-bell.svg`} alt="" style={{ position: 'absolute', left: 1164, top: 14, width: 30, height: 30 }} />
      <img src={`${A}/avatar-top.svg`} alt="" style={{ position: 'absolute', left: 1204, top: 7, width: 43, height: 43 }} />
      <p style={text(1212, 15, { fontSize: 20, color: COL.white, letterSpacing: '0.8px', textTransform: 'uppercase' })}>KD</p>
    </>
  )
}
