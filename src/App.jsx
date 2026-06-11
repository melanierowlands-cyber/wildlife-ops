import React, { useState } from 'react'
import {
  Home,
  PawPrint,
  Users,
  HeartPulse,
  AlertTriangle,
  Cloud,
  FileText,
  Search,
  Bell,
  Settings,
  ChevronRight,
  Wind,
  Droplets,
  Thermometer,
  CloudRain,
  Sunrise,
  Moon,
  MapPin,
  Grid3x3,
  Radio,
  Activity,
  Crosshair,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  LineChart,
  Line,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

/* ════════════════════════════════════════════════════════════════
   PALETTE
   ════════════════════════════════════════════════════════════════ */
// Light "cream" theme drawn from the Mziki brand palette
// (cream #F8F6F5, dark olive #292D20, sage, warm gold)
const C = {
  bg: '#F8F6F5', // Mziki brand cream — page background
  sidebar: '#FFFFFF',
  surface: '#FFFFFF', // cards float on the cream canvas
  surfaceHi: '#F4F1EA',
  inset: '#F4F1EA', // warm cream inset for sub-cards / fields
  border: 'rgba(41,45,32,0.10)',
  borderHi: 'rgba(41,45,32,0.16)',
  hover: 'rgba(41,45,32,0.045)',
  stripe: 'rgba(41,45,32,0.022)',
  chip: 'rgba(41,45,32,0.06)',
  cardShadow: '0 1px 2px rgba(41,45,32,0.05), 0 6px 22px rgba(41,45,32,0.06)',
  accent: '#5E8576', // sage (deepened for contrast on white)
  accentSoft: '#7FA095',
  gold: '#A07C1F', // warm brand gold
  critical: '#B24A33', // terracotta
  success: '#4E7B52', // bush green
  amber: '#B07A28', // monitoring amber
  team: '#3F6E97', // field-team blue
  text: '#292D20', // Mziki dark olive — primary text
  text2: '#5F5A4E', // warm taupe — secondary
  text3: '#8C8678', // muted — tertiary / labels
  // Light-on-dark tokens for the dark satellite map overlay:
  mapText: '#EDE8DC',
  mapText2: '#B0AA9C',
}

const healthColor = (v) => (v >= 85 ? C.success : v >= 70 ? C.amber : C.critical)

/* ════════════════════════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════════════════════════ */
const NAV = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'animals', label: 'Animals', icon: PawPrint },
  { id: 'teams', label: 'Field Teams', icon: Users },
  { id: 'health', label: 'Health & Vet', icon: HeartPulse },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { id: 'environmental', label: 'Environmental', icon: Cloud },
  { id: 'reports', label: 'Reports', icon: FileText },
]

const KPIS = [
  { label: 'Animals Tracked', value: '847', icon: PawPrint, trend: 'up', delta: '↑ 12 this week', note: 'collared & monitored' },
  { label: 'Active Field Teams', value: '6 / 8', icon: Users, trend: 'flat', delta: 'deployed across reserve', note: '2 on standby' },
  { label: 'Open Incidents', value: '3', icon: AlertTriangle, trend: 'crit', delta: '1 critical', note: 'W-04 snare injury' },
  { label: 'Avg Health Score', value: '91%', icon: HeartPulse, trend: 'down', delta: '↓ 2% from last month', note: 'across all species' },
  { label: 'Area Covered Today', value: '2,340 ha', icon: Crosshair, trend: 'flat', delta: 'of 6,000 ha', note: '39% of reserve' },
]

// Map markers — positions are % of the map container
const MARKERS = [
  { id: 'lion', x: 38, y: 34, type: 'healthy', species: 'Lion Pride "Mthethwa"', tag: 'PR-01 · 6 individuals', status: 'Resting · Sector B2' },
  { id: 'eleph', x: 62, y: 22, type: 'healthy', species: 'Elephant Herd', tag: 'EH-03 · 12 individuals', status: 'Crossing · N. Corridor' },
  { id: 'rhino', x: 21, y: 58, type: 'healthy', species: 'White Rhino Pair', tag: 'SDR-07 · 2 individuals', status: 'Grazing · Sector A4' },
  { id: 'leopard', x: 49, y: 55, type: 'monitor', species: 'Leopard "Ndlovu"', tag: 'LP-02 · collar 18%', status: 'Monitoring · Sector B3' },
  { id: 'buffalo', x: 73, y: 64, type: 'monitor', species: 'Buffalo Bull (aging)', tag: 'BF-11 · solitary', status: 'Monitoring · Sector C2' },
  { id: 'wilddog', x: 66, y: 78, type: 'critical', species: 'Wild Dog W-04', tag: 'WD-04 · snare injury', status: 'CRITICAL · Sector C4' },
  { id: 'team1', x: 30, y: 44, type: 'team', species: 'Alpha Team', tag: 'Vehicle GP-12', status: 'On patrol · Sectors A+B' },
  { id: 'team2', x: 60, y: 70, type: 'team', species: 'Beta Team', tag: 'Vehicle GP-08', status: 'Responding · W-04' },
]

const MARKER_STYLE = {
  healthy: C.success,
  monitor: C.amber,
  critical: C.critical,
  team: '#5B8DB8',
}

const SECTORS = [
  { label: 'SECTOR A', x: 16, y: 40 },
  { label: 'SECTOR B', x: 42, y: 30 },
  { label: 'SECTOR C', x: 70, y: 56 },
  { label: 'SECTOR D', x: 84, y: 32 },
  { label: 'NORTHERN CORRIDOR', x: 58, y: 12 },
  { label: 'RIVER SECTION', x: 26, y: 80 },
  { label: 'BOUNDARY FENCE LINE', x: 78, y: 90 },
]

const ACTIVITY = [
  { time: '05:47', dot: C.success, text: 'Lion pride (4F, 2M) sighted — game drive ETA 07:00', tag: 'B2' },
  { time: '05:31', dot: C.amber, text: 'Leopard "Ndlovu" — GPS collar battery 18% — action required', tag: 'B3' },
  { time: '05:12', dot: C.critical, text: 'ALERT: Suspected snare — Wild dog W-04 — team dispatched', tag: 'C4' },
  { time: '04:58', dot: C.success, text: 'Elephant herd (12) crossing — no intervention needed', tag: 'N. CORRIDOR' },
  { time: '04:33', dot: C.text2, text: 'Daily water point check complete — all 7 points operational', tag: 'RESERVE' },
  { time: '03:55', dot: C.success, text: 'Rhino pair — SDR-tracking nominal', tag: 'A4' },
  { time: '02:14', dot: C.amber, text: 'Fence integrity alert — maintenance scheduled', tag: 'D' },
  { time: '01:30', dot: C.text2, text: 'Night patrol completed — sectors B, C, D clear', tag: 'B·C·D' },
]

const HEALTH = [
  { species: 'Giraffe', value: 98 },
  { species: 'Elephant', value: 97 },
  { species: 'Cheetah', value: 95 },
  { species: 'Lion', value: 94 },
  { species: 'Buffalo', value: 91 },
  { species: 'Rhino (White)', value: 88 },
  { species: 'Leopard', value: 76 },
  { species: 'Wild Dog', value: 62 },
]

const TEAMS = [
  { name: 'Alpha Team', sector: 'Sectors A+B', members: '3 rangers', task: 'On patrol', status: 'Active', color: C.success },
  { name: 'Beta Team', sector: 'Sector C', members: '2 rangers', task: 'Responding to incident W-04', status: 'Deployed', color: C.critical },
  { name: 'Vet Unit', sector: 'Base camp', members: '1 vet + 1 ranger', task: 'On standby', status: 'Standby', color: C.amber },
  { name: 'Research Team', sector: 'River Section', members: '2 researchers', task: 'Bird survey', status: 'Active', color: C.success },
  { name: 'Fence Patrol', sector: 'Sector D', members: '2 rangers', task: 'Maintenance', status: 'In progress', color: C.amber },
  { name: 'Night Unit', sector: 'Off duty', members: 'Returning 18:00', task: 'Stand-down', status: 'Off duty', color: C.text2 },
]

const RAINFALL = [
  { day: 'Wed', mm: 0 },
  { day: 'Thu', mm: 4 },
  { day: 'Fri', mm: 11 },
  { day: 'Sat', mm: 2 },
  { day: 'Sun', mm: 0 },
  { day: 'Mon', mm: 1 },
  { day: 'Tue', mm: 0 },
]

const SIGHTINGS = [
  { time: '05:47', species: 'Lion', count: 6, loc: 'Sector B2', ranger: 'K. Dlamini', note: 'Pride with 2 cubs', flag: true },
  { time: '05:12', species: 'Wild Dog', count: 8, loc: 'Sector C4', ranger: 'T. Mbatha', note: 'Injured W-04 flagged', flag: false },
  { time: '04:58', species: 'Elephant', count: 12, loc: 'N. Corridor', ranger: 'S. Nkosi', note: 'Matriarch "Thandi" leading', flag: false },
  { time: '04:15', species: 'Rhino (W)', count: 2, loc: 'Sector A4', ranger: 'K. Dlamini', note: 'SDR tracking nominal', flag: false },
  { time: '03:40', species: 'Leopard', count: 1, loc: 'Sector B3', ranger: 'J. Cele', note: '"Ndlovu" — collar alert', flag: false },
  { time: '02:55', species: 'Buffalo', count: 34, loc: 'Sector C2', ranger: 'T. Mbatha', note: 'Herd — healthy', flag: false },
  { time: '01:10', species: 'Spotted Hyena', count: 3, loc: 'River Section', ranger: 'Night unit', note: 'Scavenging', flag: false },
  { time: '00:30', species: 'Black Rhino', count: 1, loc: 'Sector A1', ranger: 'Night unit', note: 'Rare sighting — photographed', flag: true },
]

const INCIDENTS = [
  {
    sev: 'CRITICAL',
    color: C.critical,
    title: 'W-04 Wild Dog — Suspected snare injury',
    meta: 'Reported 05:12 AM · Sector C4',
    status: 'Beta Team dispatched · ETA 15 min',
    note: 'Visible wound on left forelimb — vet notified',
    actions: ['View on Map', 'Contact Vet'],
  },
  {
    sev: 'MONITORING',
    color: C.amber,
    title: 'Leopard "Ndlovu" — GPS collar battery critical',
    meta: 'Reported 05:31 AM · Sector B3',
    status: 'No team dispatched — monitoring',
    note: 'Battery at 18% — replacement needed within 72 hours',
    actions: ['Schedule Collar Replacement'],
  },
  {
    sev: 'LOW',
    color: C.text2,
    title: 'Fence integrity — Sector D boundary',
    meta: 'Reported 02:14 AM · Automated sensor',
    status: 'Maintenance team scheduled for 08:00',
    note: 'Single strand breach, 3m section — no animals at risk',
    actions: ['View Fence Report'],
  },
]

/* ════════════════════════════════════════════════════════════════
   SMALL PRIMITIVES
   ════════════════════════════════════════════════════════════════ */
const Card = ({ className = '', children, ...rest }) => (
  <div
    className={`rounded-[10px] ${className}`}
    style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}
    {...rest}
  >
    {children}
  </div>
)

const SectionTitle = ({ children, right }) => (
  <div className="flex items-center justify-between mb-3.5">
    <h3 className="text-[12px] font-medium label-caps" style={{ color: C.text2, letterSpacing: '0.08em' }}>
      {children}
    </h3>
    {right}
  </div>
)

const Pill = ({ children, color, bg }) => (
  <span
    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-medium label-caps"
    style={{ color, background: bg, letterSpacing: '0.06em' }}
  >
    {children}
  </span>
)

const Dot = ({ color, size = 7 }) => (
  <span className="inline-block rounded-full shrink-0" style={{ width: size, height: size, background: color }} />
)

/* ════════════════════════════════════════════════════════════════
   SIDEBAR
   ════════════════════════════════════════════════════════════════ */
function Sidebar({ active, setActive }) {
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[220px] flex flex-col z-20"
      style={{ background: C.sidebar, borderRight: `1px solid ${C.border}` }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(140deg, #7FA095, #4E6B5F)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)' }}
          >
            <PawPrint size={17} color="#1C1F1A" strokeWidth={2.4} />
          </div>
          <div className="leading-none">
            <div className="font-display text-[16px] font-bold tracking-[0.14em]" style={{ color: C.text }}>
              MZIKI
            </div>
            <div className="text-[10px] mt-1 label-caps" style={{ color: C.accent, letterSpacing: '0.16em' }}>
              Wildlife Ops
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Pill color={C.success} bg="rgba(107,158,110,0.15)">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: C.success }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: C.success }} />
            </span>
            Operational
          </Pill>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 mt-1 flex-1">
        {NAV.map((item) => {
          const Icon = item.icon
          const on = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="w-full group flex items-center gap-3 pl-3 pr-2 py-2.5 mb-0.5 rounded-lg text-left transition-all duration-150"
              style={{
                background: on ? 'rgba(127,160,149,0.12)' : 'transparent',
                boxShadow: on ? `inset 2px 0 0 ${C.accent}` : 'none',
              }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = C.hover }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={17} color={on ? C.accent : C.text2} strokeWidth={2} />
              <span className="text-[13px] font-medium" style={{ color: on ? C.text : C.text2 }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Weather widget */}
      <div className="px-3">
        <div className="rounded-lg p-3" style={{ background: C.inset, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-[22px] font-bold tnum leading-none" style={{ color: C.text }}>22°C</div>
              <div className="text-[10px] mt-1.5" style={{ color: C.text3 }}>Feels like 19° · clear</div>
            </div>
            <Cloud size={26} color={C.gold} strokeWidth={1.6} />
          </div>
          <div className="flex items-center gap-3 mt-2.5 text-[10.5px]" style={{ color: C.text2 }}>
            <span className="flex items-center gap-1"><Wind size={11} color={C.text2} /> 14 km/h NW</span>
            <span className="flex items-center gap-1"><Droplets size={11} color={C.text2} /> 68%</span>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="m-3 mt-3 pt-3 flex items-center gap-2.5" style={{ borderTop: `1px solid ${C.border}` }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
          style={{ background: 'linear-gradient(140deg, #C8A96E, #8A6F3E)', color: '#1C1F1A' }}
        >
          KD
        </div>
        <div className="leading-tight min-w-0">
          <div className="text-[12.5px] font-medium truncate" style={{ color: C.text }}>Ranger K. Dlamini</div>
          <div className="text-[10px] label-caps truncate" style={{ color: C.text3, letterSpacing: '0.08em' }}>Head Field Ranger</div>
        </div>
      </div>
    </aside>
  )
}

/* ════════════════════════════════════════════════════════════════
   TOP BAR
   ════════════════════════════════════════════════════════════════ */
function TopBar() {
  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between gap-6 px-7 h-[64px]"
      style={{ background: 'rgba(248,246,245,0.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}
    >
      <div className="min-w-0">
        <h1 className="font-display text-[19px] font-bold tracking-[-0.01em] leading-none" style={{ color: C.text }}>
          Reserve Overview
        </h1>
        <p className="text-[11.5px] mt-1.5" style={{ color: C.text2 }}>
          Tuesday, 10 June 2025 · 06:14 AM SAST
        </p>
      </div>

      <div className="flex-1 max-w-[420px] hidden md:block">
        <div
          className="flex items-center gap-2.5 rounded-lg px-3.5 h-9"
          style={{ background: C.inset, border: `1px solid ${C.border}` }}
        >
          <Search size={15} color={C.text3} />
          <input
            placeholder="Search animals, sectors, incidents…"
            className="bg-transparent outline-none text-[12.5px] w-full placeholder:text-[#8C8678]"
            style={{ color: C.text }}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: C.text3, border: `1px solid ${C.border}` }}>⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {[Bell, Settings].map((Icon, i) => (
          <button
            key={i}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150"
            style={{ border: `1px solid ${C.border}` }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Icon size={16} color={C.text2} />
            {i === 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9.5px] font-semibold flex items-center justify-center tnum"
                style={{ background: C.critical, color: '#fff', border: `1.5px solid ${C.bg}` }}
              >
                2
              </span>
            )}
          </button>
        ))}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold ml-1"
          style={{ background: 'linear-gradient(140deg, #7FA095, #4E6B5F)', color: '#1C1F1A' }}
        >
          KD
        </div>
      </div>
    </header>
  )
}

/* ════════════════════════════════════════════════════════════════
   ZONE 1 — KPI STRIP
   ════════════════════════════════════════════════════════════════ */
function KpiStrip() {
  const trendMeta = {
    up: { color: C.success, Icon: ArrowUpRight },
    down: { color: C.critical, Icon: ArrowDownRight },
    crit: { color: C.critical, Icon: AlertTriangle },
    flat: { color: C.text2, Icon: null },
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
      {KPIS.map((k) => {
        const Icon = k.icon
        const tm = trendMeta[k.trend]
        const TrendIcon = tm.Icon
        return (
          <div
            key={k.label}
            className="rounded-[10px] p-4 transition-transform duration-150 cursor-default"
            style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div className="flex items-start justify-between">
              <span className="text-[10.5px] font-medium label-caps max-w-[110px]" style={{ color: C.text2, letterSpacing: '0.07em' }}>
                {k.label}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(127,160,149,0.12)' }}
              >
                <Icon size={16} color={C.accent} strokeWidth={2} />
              </div>
            </div>
            <div className="font-display text-[28px] font-bold tnum mt-2.5 leading-none" style={{ color: C.text }}>
              {k.value}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {TrendIcon && <TrendIcon size={12} color={tm.color} strokeWidth={2.4} />}
              <span className="text-[11px] font-medium" style={{ color: tm.color }}>{k.delta}</span>
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: C.text3 }}>{k.note}</div>
          </div>
        )
      })}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   ZONE 2a — RESERVE MAP
   ════════════════════════════════════════════════════════════════ */
function ContourLines() {
  // organic topographic contour lines suggesting hills + valleys
  const paths = [
    'M -40 120 C 120 60, 240 160, 380 90 S 620 40, 820 120',
    'M -40 180 C 140 120, 260 220, 400 150 S 640 110, 820 190',
    'M -40 250 C 160 200, 300 290, 440 230 S 660 200, 820 270',
    'M -40 330 C 120 300, 280 370, 420 320 S 640 300, 820 360',
    'M -40 410 C 160 380, 300 450, 460 410 S 660 390, 820 440',
    'M 120 -20 C 180 120, 120 240, 220 360 S 280 520, 200 620',
    'M 520 -20 C 560 140, 480 260, 580 380 S 640 520, 560 620',
    'M 340 -20 C 380 120, 320 220, 400 340',
  ]
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 780 480" preserveAspectRatio="none">
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#7FA095" strokeWidth="1" opacity={0.1 + (i % 3) * 0.025} />
      ))}
      {/* river */}
      <path
        d="M -20 300 C 120 260, 200 360, 320 330 S 520 380, 660 320 S 800 300, 820 320"
        fill="none"
        stroke="#5B8DB8"
        strokeWidth="3.5"
        opacity="0.18"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MapMarker({ m, onHover }) {
  const color = MARKER_STYLE[m.type]
  return (
    <div
      className="absolute"
      style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%, -50%)' }}
      onMouseEnter={() => onHover(m)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative flex items-center justify-center cursor-pointer" style={{ width: 14, height: 14 }}>
        <span
          className="pulse-ring absolute rounded-full"
          style={{ width: 14, height: 14, background: color, opacity: 0.5 }}
        />
        <span
          className="dot-core relative rounded-full"
          style={{
            width: m.type === 'team' ? 9 : 8,
            height: m.type === 'team' ? 9 : 8,
            background: color,
            border: `1.5px solid rgba(28,31,26,0.65)`,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  )
}

function ReserveMap() {
  const [hover, setHover] = useState(null)
  const legend = [
    { c: C.success, t: 'Healthy / tracked' },
    { c: C.amber, t: 'Requires monitoring' },
    { c: C.critical, t: 'Critical alert' },
    { c: '#5B8DB8', t: 'Field team vehicle' },
  ]
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2">
          <Radio size={14} color={C.accent} />
          <span className="text-[12px] font-medium" style={{ color: C.text }}>
            Live Animal Tracking
          </span>
          <span className="text-[11px]" style={{ color: C.text3 }}>· Mziki Reserve · 6,000 ha</span>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] label-caps" style={{ color: C.success, letterSpacing: '0.08em' }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: C.success }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: C.success }} />
          </span>
          Live · 8 signals
        </span>
      </div>

      {/* Map canvas */}
      <div
        className="relative flex-1 min-h-[420px]"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, #2A3D2A 0%, #1A2818 40%, #161C14 100%)' }}
      >
        <ContourLines />

        {/* faint sector labels */}
        {SECTORS.map((s) => (
          <span
            key={s.label}
            className="absolute text-[9px] font-medium label-caps select-none pointer-events-none"
            style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%,-50%)', color: 'rgba(240,235,224,0.16)', letterSpacing: '0.14em' }}
          >
            {s.label}
          </span>
        ))}

        {/* grid toggle */}
        <button
          className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10.5px] label-caps transition-colors"
          style={{ background: 'rgba(28,31,26,0.7)', border: `1px solid rgba(255,255,255,0.12)`, color: C.mapText2, letterSpacing: '0.06em' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.mapText)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.mapText2)}
        >
          <Grid3x3 size={12} /> Sector grid
        </button>

        {/* markers */}
        {MARKERS.map((m) => (
          <MapMarker key={m.id} m={m} onHover={setHover} />
        ))}

        {/* hover tooltip */}
        {hover && (
          <div
            className="absolute z-10 rounded-lg px-3 py-2 pointer-events-none"
            style={{
              left: `${hover.x}%`,
              top: `${hover.y}%`,
              transform: `translate(-50%, calc(-100% - 14px))`,
              background: 'rgba(20,23,18,0.95)',
              border: `1px solid rgba(255,255,255,0.14)`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
              minWidth: 180,
            }}
          >
            <div className="flex items-center gap-2">
              <Dot color={MARKER_STYLE[hover.type]} />
              <span className="text-[12px] font-medium" style={{ color: C.mapText }}>{hover.species}</span>
            </div>
            <div className="text-[10.5px] mt-1 tnum" style={{ color: C.mapText2 }}>{hover.tag}</div>
            <div className="text-[10px] mt-0.5 label-caps" style={{ color: MARKER_STYLE[hover.type], letterSpacing: '0.05em' }}>{hover.status}</div>
          </div>
        )}

        {/* legend */}
        <div
          className="absolute bottom-3 left-3 rounded-lg px-3 py-2.5"
          style={{ background: 'rgba(20,23,18,0.78)', border: `1px solid rgba(255,255,255,0.10)`, backdropFilter: 'blur(4px)' }}
        >
          <div className="text-[9px] mb-1.5 label-caps" style={{ color: C.mapText2, letterSpacing: '0.1em' }}>Legend</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {legend.map((l) => (
              <div key={l.t} className="flex items-center gap-2">
                <Dot color={l.c} size={6} />
                <span className="text-[10px]" style={{ color: C.mapText2 }}>{l.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* coords readout */}
        <div className="absolute bottom-3 right-3 text-[9.5px] tnum label-caps" style={{ color: 'rgba(240,235,224,0.28)', letterSpacing: '0.08em' }}>
          27.9128° S · 32.2041° E
        </div>
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   ZONE 2b — ACTIVITY FEED
   ════════════════════════════════════════════════════════════════ */
function ActivityFeed() {
  return (
    <Card className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2">
          <Activity size={14} color={C.accent} />
          <span className="text-[12px] font-medium" style={{ color: C.text }}>Recent Activity</span>
        </div>
        <span className="text-[10px] label-caps" style={{ color: C.text3, letterSpacing: '0.08em' }}>Last 6 hrs</span>
      </div>
      <div className="scroll-thin overflow-y-auto flex-1 max-h-[440px]">
        {ACTIVITY.map((a, i) => (
          <div
            key={i}
            className={`flex gap-3 px-4 py-3 ${i === 0 ? 'feed-in' : ''}`}
            style={{ background: i % 2 ? C.stripe : 'transparent', borderBottom: `1px solid ${C.border}` }}
          >
            <div className="flex flex-col items-center pt-0.5">
              <Dot color={a.dot} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tnum" style={{ color: C.gold }}>{a.time} AM</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full label-caps tnum" style={{ color: C.text2, background: C.chip, letterSpacing: '0.04em' }}>{a.tag}</span>
              </div>
              <p className="text-[12px] mt-1 leading-snug" style={{ color: C.text }}>{a.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   ZONE 3a — SPECIES HEALTH INDEX
   ════════════════════════════════════════════════════════════════ */
function HealthTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg px-2.5 py-1.5" style={{ background: '#FFFFFF', border: `1px solid ${C.borderHi}`, boxShadow: '0 6px 18px rgba(41,45,32,0.12)' }}>
      <div className="text-[11px] font-medium" style={{ color: C.text }}>{d.species}</div>
      <div className="text-[11px] tnum" style={{ color: healthColor(d.value) }}>{d.value}% health index</div>
    </div>
  )
}

function SpeciesHealth() {
  return (
    <Card className="p-4 flex flex-col h-full">
      <SectionTitle right={<HeartPulse size={14} color={C.accent} />}>Species Health Index</SectionTitle>
      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={HEALTH} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 0 }} barCategoryGap={7}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="species"
              width={88}
              tick={{ fill: C.text2, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip cursor={{ fill: 'rgba(41,45,32,0.04)' }} content={<HealthTooltip />} />
            <Bar dataKey="value" radius={[3, 3, 3, 3]} barSize={13} background={{ fill: 'rgba(41,45,32,0.06)', radius: 3 }}>
              {HEALTH.map((d, i) => (
                <Cell key={i} fill={healthColor(d.value)} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                formatter={(v) => `${v}%`}
                style={{ fontSize: 10.5, fontWeight: 600, fill: C.text }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 text-[10.5px]" style={{ borderTop: `1px solid ${C.border}`, color: C.text2 }}>
        <span>Last vet round: <span style={{ color: C.text }}>3 days ago</span></span>
        <span style={{ color: C.text3 }}>·</span>
        <span>Next scheduled: <span style={{ color: C.gold }}>2 days</span></span>
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   ZONE 3b — FIELD TEAMS
   ════════════════════════════════════════════════════════════════ */
function FieldTeams() {
  return (
    <Card className="p-4 flex flex-col h-full">
      <SectionTitle right={<Users size={14} color={C.accent} />}>Field Teams</SectionTitle>
      <div className="flex flex-col gap-2 flex-1">
        {TEAMS.map((t) => (
          <div
            key={t.name}
            className="rounded-lg pl-3 pr-2.5 py-2.5 flex items-center justify-between transition-colors"
            style={{ background: C.inset, borderLeft: `2.5px solid ${t.color}`, border: `1px solid ${C.border}`, borderLeftWidth: '2.5px', borderLeftColor: t.color }}
          >
            <div className="min-w-0">
              <div className="text-[12.5px] font-medium" style={{ color: C.text }}>{t.name}</div>
              <div className="text-[10.5px] mt-0.5 truncate" style={{ color: C.text2 }}>
                {t.sector} · {t.members}
              </div>
              <div className="text-[10px] mt-0.5 truncate" style={{ color: C.text3 }}>{t.task}</div>
            </div>
            <Pill color={t.color} bg={`${t.color}22`}>
              <Dot color={t.color} size={6} />
              {t.status}
            </Pill>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   ZONE 3c — ENVIRONMENTAL CONDITIONS
   ════════════════════════════════════════════════════════════════ */
function MiniStat({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-lg p-2.5" style={{ background: C.inset, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-1.5">
        <Icon size={12} color={C.accent} />
        <span className="text-[9.5px] label-caps" style={{ color: C.text2, letterSpacing: '0.07em' }}>{label}</span>
      </div>
      <div className="font-display text-[17px] font-bold tnum mt-1.5 leading-none" style={{ color: C.text }}>{value}</div>
      {sub && <div className="text-[9.5px] mt-1" style={{ color: C.text3 }}>{sub}</div>}
    </div>
  )
}

function Environmental() {
  return (
    <Card className="p-4 flex flex-col h-full">
      <SectionTitle right={<Cloud size={14} color={C.accent} />}>Reserve Conditions</SectionTitle>

      <div className="grid grid-cols-2 gap-2">
        <MiniStat icon={Thermometer} label="Temp" value="22°C" sub="feels 19°C" />
        <MiniStat icon={Droplets} label="Humidity" value="68%" sub="moderate" />
        <MiniStat icon={Wind} label="Wind" value="14 km/h" sub="NW breeze" />
        <MiniStat icon={CloudRain} label="Rainfall" value="0 mm" sub="18mm this week" />
      </div>

      {/* rainfall chart */}
      <div className="mt-3.5">
        <div className="text-[9.5px] mb-1 label-caps" style={{ color: C.text3, letterSpacing: '0.08em' }}>Rainfall · last 7 days</div>
        <div style={{ height: 56 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={RAINFALL} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
              <XAxis dataKey="day" tick={{ fill: C.text3, fontSize: 9 }} axisLine={false} tickLine={false} interval={0} />
              <Tooltip
                cursor={{ stroke: 'rgba(41,45,32,0.12)' }}
                contentStyle={{ background: '#FFFFFF', border: `1px solid ${C.borderHi}`, borderRadius: 8, fontSize: 11, boxShadow: '0 6px 18px rgba(41,45,32,0.12)' }}
                labelStyle={{ color: C.text2 }}
                itemStyle={{ color: C.text }}
                formatter={(v) => [`${v} mm`, 'Rainfall']}
              />
              <Line type="monotone" dataKey="mm" stroke={C.accent} strokeWidth={1.5} dot={{ r: 2, fill: C.accent }} activeDot={{ r: 3.5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* veld condition */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] label-caps" style={{ color: C.text2, letterSpacing: '0.07em' }}>Bush Density Index</span>
          <span className="text-[11px] font-semibold tnum" style={{ color: C.gold }}>72 / 100</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(41,45,32,0.08)' }}>
          <div
            className="h-full rounded-full"
            style={{ width: '72%', background: 'linear-gradient(90deg, #C8A96E 0%, #6B9E6E 100%)' }}
          />
        </div>
        <div className="text-[9.5px] mt-1.5" style={{ color: C.text3 }}>Veld condition — good post-summer growth</div>
      </div>

      {/* sun / moon */}
      <div className="flex items-center gap-3 mt-3.5 pt-3 text-[10.5px]" style={{ borderTop: `1px solid ${C.border}`, color: C.text2 }}>
        <span className="flex items-center gap-1.5"><Sunrise size={13} color={C.gold} /> 05:52</span>
        <span className="flex items-center gap-1.5"><Sunrise size={13} color={C.amber} className="rotate-180" /> 17:34</span>
        <span className="flex items-center gap-1.5"><Moon size={13} color={C.text2} /> Waxing 34%</span>
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   ZONE 4a — SIGHTINGS LOG
   ════════════════════════════════════════════════════════════════ */
function SightingsLog() {
  const cols = ['Time', 'Species', 'Count', 'Location', 'Ranger', 'Notable']
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2">
          <PawPrint size={14} color={C.accent} />
          <span className="text-[12px] font-medium" style={{ color: C.text }}>Sightings Today</span>
        </div>
        <span className="text-[10.5px] tnum" style={{ color: C.text2 }}>47 recorded</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {cols.map((c) => (
                <th
                  key={c}
                  className="text-[9.5px] font-medium label-caps px-4 py-2.5"
                  style={{ color: C.text3, letterSpacing: '0.08em', borderBottom: `1px solid ${C.border}` }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIGHTINGS.map((s, i) => (
              <tr
                key={i}
                className="transition-colors"
                style={{ borderBottom: `1px solid ${C.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-4 py-2.5 text-[11.5px] tnum" style={{ color: C.gold }}>{s.time}</td>
                <td className="px-4 py-2.5 text-[12px] font-medium" style={{ color: C.text }}>{s.species}</td>
                <td className="px-4 py-2.5 text-[12px] tnum" style={{ color: C.text }}>{s.count}</td>
                <td className="px-4 py-2.5 text-[11.5px]" style={{ color: C.text2 }}>{s.loc}</td>
                <td className="px-4 py-2.5 text-[11.5px]" style={{ color: C.text2 }}>{s.ranger}</td>
                <td className="px-4 py-2.5 text-[11.5px] italic" style={{ color: s.flag ? C.gold : C.text2 }}>{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   ZONE 4b — INCIDENT TRACKER
   ════════════════════════════════════════════════════════════════ */
function IncidentTracker() {
  return (
    <Card className="p-4 flex flex-col h-full">
      <SectionTitle right={<AlertTriangle size={14} color={C.critical} />}>Active Incidents — 3 open</SectionTitle>
      <div className="flex flex-col gap-3 flex-1">
        {INCIDENTS.map((inc, i) => (
          <div
            key={i}
            className="rounded-lg p-3.5 transition-transform duration-150"
            style={{ background: C.inset, border: `1px solid ${C.border}`, borderLeft: `3px solid ${inc.color}` }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Pill color={inc.color} bg={`${inc.color}22`}>
                <Dot color={inc.color} size={6} />
                {inc.sev}
              </Pill>
              <ChevronRight size={14} color={C.text3} />
            </div>
            <div className="text-[12.5px] font-medium leading-snug" style={{ color: C.text }}>{inc.title}</div>
            <div className="text-[10.5px] mt-1 tnum" style={{ color: C.text2 }}>{inc.meta}</div>
            <div className="text-[10.5px] mt-0.5" style={{ color: C.text2 }}>{inc.status}</div>
            <div className="text-[11px] mt-2 italic leading-snug" style={{ color: C.text2 }}>"{inc.note}"</div>
            <div className="flex flex-wrap gap-2 mt-3">
              {inc.actions.map((a, j) => {
                const primary = j === 0
                return (
                  <button
                    key={a}
                    className="text-[10.5px] font-medium rounded-md px-2.5 py-1.5 transition-colors"
                    style={
                      primary
                        ? { background: `${inc.color}24`, color: inc.color, border: `1px solid ${inc.color}40` }
                        : { background: 'transparent', color: C.text2, border: `1px solid ${C.border}` }
                    }
                    onMouseEnter={(e) => { if (!primary) e.currentTarget.style.color = C.text }}
                    onMouseLeave={(e) => { if (!primary) e.currentTarget.style.color = C.text2 }}
                  >
                    {a}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   APP
   ════════════════════════════════════════════════════════════════ */
export default function App() {
  const [active, setActive] = useState('overview')

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.text }}>
      <Sidebar active={active} setActive={setActive} />

      <div className="ml-[220px]">
        <TopBar />

        <main className="px-7 py-6 flex flex-col gap-5 max-w-[1680px]">
          {/* Zone 1 */}
          <KpiStrip />

          {/* Zone 2 */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.85fr_1fr] gap-5">
            <ReserveMap />
            <ActivityFeed />
          </div>

          {/* Zone 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            <SpeciesHealth />
            <FieldTeams />
            <Environmental />
          </div>

          {/* Zone 4 */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-5 items-stretch">
            <SightingsLog />
            <IncidentTracker />
          </div>

          <footer className="flex items-center justify-between py-2 text-[10.5px]" style={{ color: C.text3 }}>
            <span className="flex items-center gap-1.5">
              <MapPin size={11} /> Mziki Private Game Reserve · Munywana Conservancy · KwaZulu-Natal, South Africa
            </span>
            <span className="label-caps" style={{ letterSpacing: '0.08em' }}>Neighbours: &Beyond Phinda · Zuka · 400+ bird species</span>
          </footer>
        </main>
      </div>
    </div>
  )
}
