import { useState, useEffect } from 'react'

/* ════════════════════════════════════════════════════════════════
   Mziki — Reserve Overview · pixel-faithful rebuild of Figma 4:2
   1280×832 artboard, absolute layout from the design coordinates.
   ════════════════════════════════════════════════════════════════ */
const COL = {
  canvas: '#004b42', topbar: '#05907f', stat: '#02695d', panel: '#e4e4d5',
  panelStrong: '#cacabb', gold: '#d29b00', healthy: '#5a8021', monitor: '#d29b00',
  white: '#ffffff', ink: '#004b42', muted: '#828174', label: '#52524d', search: '#068071',
}
const A = '/proto/ov'
const REDUCED = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function fmt(n, decimals, grouped) {
  const fixed = decimals > 0 ? n.toFixed(decimals) : String(Math.round(n))
  if (!grouped) return fixed
  const [i, d] = fixed.split('.')
  return (d != null ? `${Number(i).toLocaleString('en-US')}.${d}` : Number(i).toLocaleString('en-US'))
}
function AnimatedValue({ value, duration = 850 }) {
  const text = String(value)
  const m = text.match(/\d[\d,]*\.?\d*/)
  const raw = m ? m[0] : ''
  const grouped = raw.includes(',')
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  const target = m ? parseFloat(raw.replace(/,/g, '')) : 0
  const build = (s) => (m ? text.slice(0, m.index) + s + text.slice(m.index + raw.length) : text)
  const [disp, setDisp] = useState(!m || REDUCED ? text : build(fmt(0, decimals, grouped)))
  useEffect(() => {
    if (!m || REDUCED) { setDisp(text); return }
    let f; const s = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - s) / duration); const e = 1 - Math.pow(1 - t, 3)
      setDisp(build(fmt(target * e, decimals, grouped))); if (t < 1) f = requestAnimationFrame(tick)
    }
    f = requestAnimationFrame(tick); return () => cancelAnimationFrame(f)
  }, [text]) // eslint-disable-line
  return <>{disp}</>
}

const text = (left, top, opts = {}) => ({
  position: 'absolute', left, top, margin: 0, lineHeight: 'normal',
  fontFamily: '"Hanken Grotesk", sans-serif', whiteSpace: opts.wrap ? 'normal' : 'nowrap', ...opts,
})

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'nav-overview.svg', y: 171, lx: 110, weight: 600, ls: '0.4px' },
  { id: 'animal', label: 'Animal Health', icon: 'nav-animal.svg', y: 239, lx: 110, weight: 400 },
  { id: 'dispatch', label: 'Team Dispatch', icon: 'nav-dispatch.svg', y: 307, lx: 112, weight: 400 },
]

const KPIS = [
  { label: 'Animals Tracked', value: '847', delta: '+12 this week', note: 'collared and monitored' },
  { label: 'Field Teams', value: '6/8', delta: '2 on standby', note: 'deployed across reserve' },
  { label: 'Open Incidents', value: '3', delta: '1 critical', note: 'w-04 snare injury' },
  { label: 'Avg Health', value: '91%', delta: '-2% vs last month', note: 'across all species' },
  { label: 'Area Covered', value: '2,340', delta: '39% of 6,000 ha', note: 'patrolled today' },
]

const ROWS = [
  { key: 'lion', y: 215, photo: 'lion.jpg', name: 'Lion Pride "Mthethwa"', tag: 'PR-01 · 6 individuals', desc: 'Pride in excellent condition with two healthy cubs (≈4 months). No interventions required — routine monitoring.', status: 'healthy' },
  { key: 'cheetah', y: 337, photo: 'cheetah.jpg', name: 'Cheetah "Duma"', tag: 'CH-05 · solitary male', desc: 'Adult male holding territory across the eastern plains. Strong recent hunting success; excellent body condition.', status: 'healthy' },
  { key: 'elephant', y: 459, photo: 'elephant.png', name: 'Elephant Herd "Thandi"', tag: 'EH-03 · 12 individuals', desc: 'Matriarch "Thandi" leading a herd of 12 through the northern corridor. Excellent condition; new calf (6 weeks) nursing.', status: 'healthy' },
  { key: 'buffalo', y: 580, photo: 'buffalo.jpg', name: 'Buffalo Bull "Nkulu"', tag: 'BF-11 · solitary', desc: 'Aging solitary "dagga boy" separated from the herd. Mobility slightly reduced — monitor for predation risk.', status: 'monitor' },
  { key: 'rhino', y: 702, photo: 'rhino.jpg', name: 'White Rhino Pair', tag: 'SDR-07 · 2 individuals', desc: 'Both individuals healthy. Horn-trimming up to date; SDR tracking nominal. Heightened patrol coverage maintained.', status: 'healthy' },
]

const TRACK = {
  lion: { title: 'Lion Pride "Mthethwa"', status: 'healthy', v: ['94%', '92%', 'Mixed', '160kg', '05.47', 'B2'] },
  cheetah: { title: 'Cheetah "Duma"', status: 'healthy', v: ['95%', '88%', '5 yrs', '54kg', '05.20', 'A3'] },
  elephant: { title: 'Elephant Herd "Thandi"', status: 'healthy', v: ['97%', '88%', '38 yrs', '3,200kg', '04.58', 'N.Cor'] },
  buffalo: { title: 'Buffalo "Nkulu"', status: 'monitor', v: ['79%', '—', '14 yrs', '720kg', '02.55', 'C2'] },
  rhino: { title: 'White Rhino Pair', status: 'healthy', v: ['88%', 'SDR', 'Adult', '2,100kg', '04.15', 'A4'] },
}
// HEALTH COLLAR AGE / WEIGHT LAST SEEN LOCATION — icon, label pos, value pos
const VITALS = [
  { icon: 'vt-health.svg', ix: 905, iy: 692, isz: 13, lx: 929.08, ly: 692, vx: 924.44, vy: 711, label: 'HEALTH' },
  { icon: 'vt-collar.svg', ix: 1021, iy: 694, isz: 15, lx: 1050.88, ly: 692, vx: 1047.28, vy: 711, label: 'COLLAR' },
  { icon: 'vt-age.svg', ix: 1159, iy: 692, isz: 11, lx: 1180.8, ly: 692, vx: 1152.96, vy: 710, label: 'AGE' },
  { icon: 'vt-weight.svg', ix: 905, iy: 754, isz: 11, lx: 926.76, ly: 753, vx: 904.8, vy: 771, label: 'WEIGHT' },
  { icon: 'vt-lastseen.svg', ix: 1023, iy: 755, isz: 10, lx: 1043.92, ly: 753, vx: 1036.96, vy: 771, label: 'LAST SEEN' },
  { icon: 'vt-location.svg', ix: 1145, iy: 754, isz: 11, lx: 1163.4, ly: 753, vx: 1158.4, vy: 771, label: 'LOCATION' },
]

function AnimalRow({ row, selected, onSelect }) {
  const [hover, setHover] = useState(false)
  const badgeHealthy = row.status === 'healthy'
  return (
    <div
      onClick={() => onSelect(row.key)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute', left: 344, top: row.y, width: 509, height: 110, cursor: 'pointer',
        transform: hover && !selected ? 'translateY(-2px)' : 'none', transition: 'transform .15s ease',
      }}
    >
      {/* card bg */}
      <div style={{ position: 'absolute', left: 1, top: 0, width: 508, height: 110, background: COL.panel, borderRadius: 21, boxShadow: hover ? '0 10px 24px -12px rgba(0,20,16,0.5)' : 'none', transition: 'box-shadow .2s ease' }} />
      {/* photo */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 125, height: 110, borderTopLeftRadius: 21, borderBottomLeftRadius: 21, overflow: 'hidden' }}>
        <img src={`${A}/${row.photo}`} alt={row.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* text */}
      <p style={text(137, 17, { fontSize: 16, fontWeight: 600, color: COL.ink })}>{row.name}</p>
      <p style={text(137, 41, { fontSize: 13, fontWeight: 400, color: COL.muted })}>{row.tag}</p>
      <p style={text(137, 65, { fontSize: 11, fontWeight: 400, color: COL.ink, width: 300, wrap: true })}>{row.desc}</p>
      {/* badge */}
      <div style={{ position: 'absolute', left: badgeHealthy ? 424 : 404, top: 18, display: 'flex', alignItems: 'center', padding: '4px 10px', borderRadius: 9, background: badgeHealthy ? COL.healthy : COL.monitor }}>
        <span style={{ fontFamily: '"Hanken Grotesk", sans-serif', fontSize: 9.5, fontWeight: 600, color: COL.white, letterSpacing: '0.6px', textTransform: 'uppercase' }}>{badgeHealthy ? 'HEALTHY' : 'MONITORING'}</span>
      </div>
      {/* selected ring: white inner + gold outer */}
      {selected && (
        <div style={{ position: 'absolute', left: 1, top: 0, width: 508, height: 110, borderRadius: 21, border: `2.5px solid ${COL.gold}`, boxShadow: 'inset 0 0 0 4px #fff', pointerEvents: 'none' }} />
      )}
    </div>
  )
}

export default function OverviewScreen({ onNavigate, active = 'overview' }) {
  const [sel, setSel] = useState('elephant')
  const [toast, setToast] = useState(null)
  const t = TRACK[sel]
  const titleColor = t.status === 'monitor' ? COL.gold : COL.healthy
  const act = (msg) => { setToast(msg); clearTimeout(act._t); act._t = setTimeout(() => setToast(null), 2200) }

  return (
    <div style={{ position: 'relative', width: 1280, height: 832, background: COL.canvas, fontFamily: '"Hanken Grotesk", sans-serif', overflow: 'hidden' }}>
      {/* ───────────── SIDEBAR ───────────── */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 309, height: 832, background: COL.panel }} />
      {/* logo */}
      <div style={{ position: 'absolute', left: 21, top: 46, width: 70, height: 70, borderRadius: 12, background: COL.canvas, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={`${A}/logo-paw.png`} alt="" style={{ width: 46, height: 46, objectFit: 'contain' }} />
      </div>
      <p style={text(112, 46, { fontSize: 36, fontWeight: 500, letterSpacing: '5px', color: COL.ink })}>MZIKI</p>
      <p style={text(115, 93, { fontSize: 16, fontWeight: 700, letterSpacing: '1.28px', color: COL.muted })}>BIG 5 WILDLIFE OPS</p>

      {/* active nav highlight */}
      <div style={{ position: 'absolute', left: 0, top: 161, width: 309, height: 70, background: 'rgba(255,255,255,0.70)' }} />
      {NAV.map((n) => (
        <button key={n.id} onClick={() => onNavigate && onNavigate(n.id)}
          style={{ position: 'absolute', left: 0, top: n.y - 10, width: 309, height: 70, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <img src={`${A}/${n.icon}`} alt="" style={{ position: 'absolute', left: 45, top: 15, width: 40, height: 40 }} />
          <span style={{ position: 'absolute', left: n.lx, top: 25, fontSize: 16.5, fontWeight: n.weight, letterSpacing: n.ls || 'normal', color: COL.ink, fontFamily: '"Hanken Grotesk", sans-serif' }}>{n.label}</span>
        </button>
      ))}

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

      {/* user profile */}
      <div style={{ position: 'absolute', left: -3, top: 744, width: 312, height: 88, background: COL.gold }} />
      <img src={`${A}/avatar-side.svg`} alt="" style={{ position: 'absolute', left: 27, top: 764, width: 50, height: 50 }} />
      <p style={text(36, 774, { fontSize: 24, color: COL.white, lineHeight: 1.253 })}>KD</p>
      <p style={text(92, 768, { fontSize: 16.5, color: COL.white, lineHeight: 1.253 })}>KUMBA DWONGEZA</p>
      <p style={text(92, 789, { fontSize: 16.5, color: COL.white, lineHeight: 1.253 })}>Head Ranger</p>

      {/* ───────────── TOP BAR ───────────── */}
      <div style={{ position: 'absolute', left: 310, top: 0, width: 970, height: 58, background: COL.topbar, opacity: 0.44 }} />
      <p style={text(360, 12, { fontSize: 18, fontWeight: 500, color: COL.white })}>Reserve Overview</p>
      <p style={text(360, 35, { fontSize: 13, fontWeight: 300, color: COL.white, letterSpacing: '0.39px', lineHeight: 1, textTransform: 'capitalize' })}>Mon, 15 June 2025  - 06.14 AM SAST</p>
      {/* search */}
      <div style={{ position: 'absolute', left: 647, top: 16, width: 417, height: 30, borderRadius: 10, background: COL.search }} />
      <img src={`${A}/ic-search.svg`} alt="" style={{ position: 'absolute', left: 660, top: 24, width: 14, height: 14 }} />
      <p style={text(677, 25, { fontSize: 12, color: COL.ink })}>Search animals, sectors, incidents...</p>
      <img src={`${A}/ic-settings.svg`} alt="" style={{ position: 'absolute', left: 1123, top: 14, width: 30, height: 30 }} />
      <img src={`${A}/ic-bell.svg`} alt="" style={{ position: 'absolute', left: 1164, top: 14, width: 30, height: 30 }} />
      <img src={`${A}/avatar-top.svg`} alt="" style={{ position: 'absolute', left: 1204, top: 7, width: 43, height: 43 }} />
      <p style={text(1212, 15, { fontSize: 20, color: COL.white, letterSpacing: '0.8px', textTransform: 'uppercase' })}>KD</p>

      {/* ───────────── KPI ROW ───────────── */}
      <div style={{ position: 'absolute', left: 345, top: 77, width: 902, display: 'flex', gap: 14, alignItems: 'stretch' }}>
        {KPIS.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      {/* ───────────── ANIMAL LIST ───────────── */}
      {ROWS.map((r) => (
        <AnimalRow key={r.key} row={r} selected={sel === r.key} onSelect={setSel} />
      ))}

      {/* ───────────── TRACKING PANEL ───────────── */}
      {/* panel + vitals base */}
      <div style={{ position: 'absolute', left: 881, top: 215, width: 363, height: 595, borderRadius: 21, background: COL.panel }} />
      <div style={{ position: 'absolute', left: 881, top: 684, width: 362, height: 126, borderBottomLeftRadius: 21, borderBottomRightRadius: 21, background: COL.panelStrong }} />
      {/* map */}
      <img src={`${A}/map.png`} alt="Live tracking map" style={{ position: 'absolute', left: 885, top: 303, width: 354.96, height: 383, objectFit: 'cover' }} />
      {/* buttons */}
      <button onClick={() => act(`Observation logged for ${t.title}`)}
        style={{ position: 'absolute', left: 881, top: 215, width: 183, height: 49, borderTopLeftRadius: 21, background: COL.panelStrong, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: 16, fontWeight: 600, color: COL.ink }}>
        Log Observation
      </button>
      <button onClick={() => act(`Vet scheduled for ${t.title}`)}
        style={{ position: 'absolute', left: 1064, top: 215, width: 180, height: 49, borderTopRightRadius: 21, background: COL.gold, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: 16, fontWeight: 600, color: COL.white }}>
        Schedule Vet
      </button>
      {/* header row */}
      <img src={`${A}/hdr-pin.svg`} alt="" style={{ position: 'absolute', left: 890, top: 277, width: 14, height: 11 }} />
      <p style={text(913, 276, { fontSize: 10, fontWeight: 300, color: COL.muted })}>LIVE ANIMAL TRACKING</p>
      <span style={{ position: 'absolute', left: 1037, top: 281, width: 3, height: 3, borderRadius: '50%', background: COL.muted }} />
      <p style={text(1056, 276, { fontSize: 10, fontWeight: 300, color: COL.muted })}>MZIKI RESERVE</p>
      <span style={{ position: 'absolute', left: 1142, top: 281, width: 3, height: 3, borderRadius: '50%', background: COL.muted }} />
      <p style={text(1161, 276, { fontSize: 10, fontWeight: 300, color: COL.muted })}>6000 HA</p>
      {/* animal title on map */}
      <p style={text(907.04, 315, { fontSize: 16, fontWeight: 600, color: titleColor, letterSpacing: '1.12px', textTransform: 'uppercase' })}>{t.title}</p>
      {/* vitals dividers */}
      <div style={{ position: 'absolute', left: 885, top: 748, width: 351, height: 1, background: 'rgba(82,82,77,0.25)' }} />
      <div style={{ position: 'absolute', left: 998.68, top: 685, width: 1, height: 123, background: 'rgba(82,82,77,0.25)' }} />
      <div style={{ position: 'absolute', left: 1123.79, top: 685, width: 1, height: 123, background: 'rgba(82,82,77,0.25)' }} />
      {/* vitals cells */}
      {VITALS.map((vt, i) => (
        <div key={vt.label}>
          <img src={`${A}/${vt.icon}`} alt="" style={{ position: 'absolute', left: vt.ix, top: vt.iy, width: vt.isz, height: vt.isz }} />
          <p style={text(vt.lx, vt.ly, { fontSize: 10, fontWeight: 300, color: COL.label })}>{vt.label}</p>
          <p style={text(vt.vx, vt.vy, { fontSize: 20, fontWeight: 400, color: COL.white })}>{t.v[i]}</p>
        </div>
      ))}

      {/* toast (button feedback) */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 20, transform: `translateX(-50%) translateY(${toast ? 0 : 12}px)`,
        opacity: toast ? 1 : 0, transition: 'opacity .2s ease, transform .2s ease', pointerEvents: 'none',
        background: 'rgba(0,40,34,0.92)', color: COL.white, padding: '10px 18px', borderRadius: 999,
        fontFamily: '"Hanken Grotesk", sans-serif', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap',
        boxShadow: '0 10px 28px -10px rgba(0,0,0,0.5)', border: `1px solid ${COL.gold}`,
      }}>
        {toast || ''}
      </div>
    </div>
  )
}

function StatCard({ label, value, delta, note }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: '1 0 0', minWidth: 0, background: COL.stat, borderRadius: 21,
        padding: '14px 16px 13px 18px', display: 'flex', flexDirection: 'column', gap: 3,
        color: COL.white, transform: hover ? 'translateY(-4px)' : 'none',
        boxShadow: hover ? '0 16px 32px -14px rgba(0,18,15,0.55)' : 'none',
        transition: 'transform .15s cubic-bezier(.22,.61,.36,1), box-shadow .2s ease',
      }}
    >
      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{label}</p>
      <p style={{ margin: 0, fontSize: 27, fontWeight: 400, lineHeight: 'normal' }}><AnimatedValue value={value} /></p>
      <p style={{ margin: 0, fontSize: 12.5, fontWeight: 500 }}>{delta}</p>
      <p style={{ margin: 0, fontSize: 10.5, fontWeight: 300 }}>{note}</p>
    </div>
  )
}
