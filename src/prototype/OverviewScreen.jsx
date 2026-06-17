import { useState } from 'react'
import { COL, A, AnimatedValue, text } from './shared'
import { Sidebar, TopBar } from './Chrome'

/* ════════════════════════════════════════════════════════════════
   Mziki — Reserve Overview · pixel-faithful rebuild of Figma 4:2
   1280×832 artboard, absolute layout from the design coordinates.
   ════════════════════════════════════════════════════════════════ */
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

export default function OverviewScreen({ onNavigate, active = 'overview', onOpenModal }) {
  const [sel, setSel] = useState('elephant')
  const t = TRACK[sel]
  const titleColor = t.status === 'monitor' ? COL.gold : COL.healthy

  return (
    <div style={{ position: 'relative', width: 1280, height: 832, background: COL.canvas, fontFamily: '"Hanken Grotesk", sans-serif', overflow: 'hidden' }}>
      <Sidebar active="overview" onNavigate={onNavigate} />
      <TopBar title="Reserve Overview" />

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
      {/* map legend (code overlay — sits in the map's bottom-left corner) */}
      <div style={{ position: 'absolute', left: 893, bottom: 154, width: 118, boxSizing: 'border-box', padding: '8px 11px 9px', borderRadius: 11, background: 'rgba(10,28,23,0.58)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', display: 'flex', flexDirection: 'column', gap: 6, fontFamily: '"Hanken Grotesk", sans-serif' }}>
        <span style={{ fontSize: 8, fontWeight: 400, letterSpacing: '1.6px', color: 'rgba(244,241,234,0.62)' }}>LEGEND</span>
        {[['#6aa329', 'Healthy / tracked'], ['#e0a92a', 'Monitoring'], ['#c8593a', 'Critical alert'], ['#5b9bd5', 'Field team']].map(([c, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flex: '0 0 auto' }} />
            <span style={{ fontSize: 9.5, fontWeight: 400, color: '#f4f1ea', whiteSpace: 'nowrap' }}>{l}</span>
          </div>
        ))}
      </div>
      {/* buttons */}
      <button onClick={() => onOpenModal && onOpenModal('log', t.title)}
        style={{ position: 'absolute', left: 881, top: 215, width: 183, height: 49, borderTopLeftRadius: 21, background: COL.panelStrong, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: 16, fontWeight: 600, color: COL.ink }}>
        Log Observation
      </button>
      <button onClick={() => onOpenModal && onOpenModal('vet', t.title)}
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
