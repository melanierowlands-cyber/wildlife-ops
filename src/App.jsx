import React, { useState, useEffect, useRef } from 'react'
import {
  Compass,
  HeartPulse,
  Users,
  Search,
  Bell,
  Settings,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MapPin,
  Radio,
  Wind,
  Droplets,
  Thermometer,
  CloudRain,
  Sunrise,
  Sunset,
  Moon,
  Battery,
  Scale,
  Calendar,
  Clock,
  Stethoscope,
  ClipboardList,
  Navigation,
  MessageSquare,
  Send,
  AlertTriangle,
  Activity,
} from 'lucide-react'

/* ════════════════════════════════════════════════════════════════
   PALETTE — mirrors CSS tokens (see index.css)
   ════════════════════════════════════════════════════════════════ */
const C = {
  paper: '#F1EEE7',
  surface: '#FBFAF6',
  surface2: '#F4F1EA',
  sunken: '#E9E5DC',
  ink: '#24281D',
  ink2: '#5B5749',
  ink3: '#8C8678',
  ink4: '#AAA496',
  line: 'rgba(36,40,29,0.08)',
  line2: 'rgba(36,40,29,0.14)',
  hover: 'rgba(36,40,29,0.04)',
  accent: '#4F6B5C',
  accentDeep: '#3A5142',
  accentTint: 'rgba(79,107,92,0.10)',
  critical: '#B0492F',
  warning: '#A9792B',
  positive: '#5B7A50',
  info: '#4C6A88',
  shadowSm: '0 1px 2px rgba(36,40,29,0.05)',
  shadowCard: '0 1px 1.5px rgba(36,40,29,0.04), 0 4px 12px -6px rgba(36,40,29,0.07)',
  shadowMd: '0 10px 30px -12px rgba(36,40,29,0.18)',
  // dark map tokens
  mapInk: '#E8E4D8',
  mapInk2: '#9AA08C',
}

const healthColor = (v) => (v >= 85 ? C.positive : v >= 70 ? C.warning : C.critical)

const STATUS = {
  healthy: { label: 'Healthy', color: C.positive },
  monitor: { label: 'Monitoring', color: C.warning },
  critical: { label: 'Critical', color: C.critical },
}

/* ════════════════════════════════════════════════════════════════
   NAV + PAGE META — scope limited to three views
   ════════════════════════════════════════════════════════════════ */
const NAV = [
  { id: 'overview', label: 'Dashboard', icon: Compass },
  { id: 'animal', label: 'Animal Health', icon: HeartPulse },
  { id: 'dispatch', label: 'Team Dispatch', icon: Users },
]

const PAGES = {
  overview: { title: 'Reserve Overview', subtitle: 'Incident map & key metrics' },
  animal: { title: 'Animal Health Record', subtitle: 'Individual profile & recent activity' },
  dispatch: { title: 'Team Dispatch', subtitle: 'Active field teams & task assignment' },
}

/* ════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════ */
const KPIS = [
  { label: 'Animals Tracked', value: '847', trend: 'up', delta: '+12 this week', note: 'collared & monitored', spark: [820, 825, 829, 833, 838, 842, 847] },
  { label: 'Field Teams', value: '6 / 8', trend: 'flat', delta: '2 on standby', note: 'deployed across reserve', spark: [5, 6, 6, 7, 6, 7, 6] },
  { label: 'Open Incidents', value: '3', trend: 'crit', delta: '1 critical', note: 'W-04 snare injury', spark: [2, 2, 3, 1, 2, 4, 3] },
  { label: 'Avg Health', value: '91%', trend: 'down', delta: '−2% vs last mo.', note: 'across all species', spark: [93, 93, 92, 92, 91, 91, 91] },
  { label: 'Area Covered', value: '2,340', trend: 'flat', delta: '39% of 6,000 ha', note: 'patrolled today', spark: [1.8, 2.1, 1.9, 2.4, 2.2, 2.5, 2.34] },
]

const MARKERS = [
  { id: 'lion', x: 38, y: 34, type: 'healthy', species: 'Lion Pride "Mthethwa"', tag: 'PR-01 · 6 individuals', status: 'Resting · Sector B2' },
  { id: 'eleph', x: 62, y: 22, type: 'healthy', species: 'Elephant Herd', tag: 'EH-03 · 12 individuals', status: 'Crossing · N. Corridor' },
  { id: 'rhino', x: 21, y: 58, type: 'healthy', species: 'White Rhino Pair', tag: 'SDR-07 · 2 individuals', status: 'Grazing · Sector A4' },
  { id: 'leopard', x: 49, y: 55, type: 'monitor', species: 'Leopard "Ndlovu"', tag: 'LP-02 · collar 18%', status: 'Monitoring · Sector B3' },
  { id: 'buffalo', x: 73, y: 64, type: 'monitor', species: 'Buffalo Bull (aging)', tag: 'BF-11 · solitary', status: 'Monitoring · Sector C2' },
  { id: 'wilddog', x: 66, y: 78, type: 'critical', species: 'Wild Dog W-04', tag: 'WD-04 · snare injury', status: 'Critical · Sector C4' },
  { id: 'team1', x: 30, y: 44, type: 'team', species: 'Alpha Team', tag: 'Vehicle GP-12', status: 'On patrol · Sectors A+B' },
  { id: 'team2', x: 60, y: 70, type: 'team', species: 'Beta Team', tag: 'Vehicle GP-08', status: 'Responding · W-04' },
]

const MARKER_COLOR = { healthy: C.positive, monitor: C.warning, critical: C.critical, team: C.info }

const SECTORS = [
  { label: 'SECTOR A', x: 16, y: 40 },
  { label: 'SECTOR B', x: 42, y: 30 },
  { label: 'SECTOR C', x: 70, y: 56 },
  { label: 'SECTOR D', x: 84, y: 32 },
  { label: 'NORTHERN CORRIDOR', x: 58, y: 12 },
  { label: 'RIVER SECTION', x: 26, y: 80 },
]

const ACTIVITY = [
  { time: '05:47', dot: C.positive, text: 'Lion pride (4F, 2M) sighted — game drive ETA 07:00', tag: 'B2' },
  { time: '05:31', dot: C.warning, text: 'Leopard "Ndlovu" — GPS collar battery 18%, action required', tag: 'B3' },
  { time: '05:12', dot: C.critical, text: 'Suspected snare — Wild Dog W-04 — Beta Team dispatched', tag: 'C4' },
  { time: '04:58', dot: C.positive, text: 'Elephant herd (12) crossing — no intervention needed', tag: 'N·COR' },
  { time: '04:33', dot: C.ink3, text: 'Daily water point check complete — 7 / 7 operational', tag: 'RES' },
  { time: '03:55', dot: C.positive, text: 'Rhino pair — SDR tracking nominal', tag: 'A4' },
  { time: '02:14', dot: C.warning, text: 'Fence integrity alert — maintenance scheduled 08:00', tag: 'D' },
  { time: '01:30', dot: C.ink3, text: 'Night patrol completed — sectors B, C, D clear', tag: 'B·C·D' },
]

const HEALTH = [
  { species: 'Giraffe', value: 98 },
  { species: 'Elephant', value: 97 },
  { species: 'Cheetah', value: 95 },
  { species: 'Lion', value: 94 },
  { species: 'Buffalo', value: 91 },
  { species: 'White Rhino', value: 88 },
  { species: 'Leopard', value: 76 },
  { species: 'Wild Dog', value: 62 },
]

const TREND_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const ANIMALS = [
  {
    id: 'WD-04', emoji: '🐕', name: 'Wild Dog "W-04"', species: 'African Wild Dog', tag: 'WD-04 · Mthembu pack', sector: 'Sector C4',
    status: 'critical', health: 62, sex: 'Male', age: '3 yrs', weight: '24 kg', collar: '74%', lastSeen: '05:12', group: 'Pack of 8',
    vet: 'Dr. N. Pillay', treatment: 'Intervention in progress',
    note: 'Suspected snare injury — open wound on the left forelimb. Beta Team is on scene; vet preparing to dart for wound assessment and a course of antibiotics.',
    trend: [88, 86, 85, 80, 73, 62],
    activity: [
      { time: '05:12', dot: C.critical, text: 'Snare injury reported — Beta Team dispatched, vet on standby' },
      { time: '04:40', dot: C.warning, text: 'Irregular gait flagged by collar accelerometer' },
      { time: 'Yesterday', dot: C.ink3, text: 'GPS fix — pack denning near Sector C4' },
      { time: '2 days', dot: C.positive, text: 'Group hunt observed — healthy pack interaction' },
    ],
  },
  {
    id: 'LP-02', emoji: '🐆', name: 'Leopard "Ndlovu"', species: 'Leopard', tag: 'LP-02 · resident male', sector: 'Sector B3',
    status: 'monitor', health: 76, sex: 'Male', age: '6 yrs', weight: '64 kg', collar: '18%', lastSeen: '03:40', group: 'Solitary',
    vet: 'Dr. N. Pillay', treatment: 'Collar replacement due',
    note: 'Healthy adult male in good condition. GPS collar battery critical at 18% — schedule a replacement within 72 hours to maintain continuous tracking.',
    trend: [82, 80, 79, 78, 77, 76],
    activity: [
      { time: '05:31', dot: C.warning, text: 'GPS collar battery dropped to 18% — replacement scheduled' },
      { time: '03:40', dot: C.ink3, text: 'Sighted resting in a marula tree — Sector B3' },
      { time: 'Yesterday', dot: C.positive, text: 'Successful kill recorded — impala' },
      { time: '4 days', dot: C.ink3, text: 'Territory scent-marking along the ridge' },
    ],
  },
  {
    id: 'PR-01', emoji: '🦁', name: 'Lion Pride "Mthethwa"', species: 'Lion', tag: 'PR-01 · 6 individuals', sector: 'Sector B2',
    status: 'healthy', health: 94, sex: '4F / 2M', age: 'Mixed', weight: 'avg 160 kg', collar: '92%', lastSeen: '05:47', group: '6 + 2 cubs',
    vet: 'Routine', treatment: 'Stable',
    note: 'Pride in excellent condition with two healthy cubs (≈4 months). No interventions required — continue routine monitoring and game-drive coordination.',
    trend: [90, 91, 92, 93, 94, 94],
    activity: [
      { time: '05:47', dot: C.positive, text: 'Pride sighted with 2 cubs — game drive notified' },
      { time: 'Yesterday', dot: C.positive, text: 'Buffalo kill — whole pride fed' },
      { time: '3 days', dot: C.ink3, text: 'Pride moved to Sector B2 waterhole' },
    ],
  },
  {
    id: 'EH-03', emoji: '🐘', name: 'Elephant Herd "Thandi"', species: 'African Elephant', tag: 'EH-03 · 12 individuals', sector: 'N. Corridor',
    status: 'healthy', health: 97, sex: 'Matriarch', age: '38 yrs', weight: '3,200 kg', collar: '88%', lastSeen: '04:58', group: 'Herd of 12',
    vet: 'Routine', treatment: 'Stable',
    note: 'Matriarch "Thandi" leading a herd of 12 through the northern corridor. Excellent body condition. New calf (6 weeks) is nursing and thriving.',
    trend: [95, 96, 96, 97, 97, 97],
    activity: [
      { time: '04:58', dot: C.positive, text: 'Herd crossing N. Corridor — no intervention needed' },
      { time: 'Yesterday', dot: C.positive, text: 'New calf observed nursing — healthy' },
      { time: '5 days', dot: C.ink3, text: 'Herd at river — extended drinking & bathing' },
    ],
  },
  {
    id: 'SDR-07', emoji: '🦏', name: 'White Rhino Pair', species: 'White Rhino', tag: 'SDR-07 · 2 individuals', sector: 'Sector A4',
    status: 'healthy', health: 88, sex: '1F / 1M', age: 'Adult', weight: '2,100 kg', collar: 'SDR', lastSeen: '04:15', group: 'Bonded pair',
    vet: 'Routine', treatment: 'Stable',
    note: 'Both individuals healthy. Horn-trimming up to date for anti-poaching. SDR tracking nominal — heightened patrol coverage maintained around their range.',
    trend: [86, 87, 87, 88, 88, 88],
    activity: [
      { time: '04:15', dot: C.positive, text: 'SDR tracking nominal — Sector A4' },
      { time: 'Yesterday', dot: C.ink3, text: 'Mud-wallowing observed midday' },
      { time: '6 days', dot: C.positive, text: 'Anti-poaching horn check completed' },
    ],
  },
  {
    id: 'BF-11', emoji: '🐃', name: 'Buffalo Bull "Nkulu"', species: 'Cape Buffalo', tag: 'BF-11 · solitary', sector: 'Sector C2',
    status: 'monitor', health: 79, sex: 'Male', age: '14 yrs', weight: '720 kg', collar: 'None', lastSeen: '02:55', group: 'Dagga boy',
    vet: 'Routine', treatment: 'Monitoring',
    note: 'Aging solitary bull ("dagga boy") separated from the herd. Mobility slightly reduced. Monitor for predation risk and declining body condition.',
    trend: [86, 84, 83, 82, 80, 79],
    activity: [
      { time: '02:55', dot: C.warning, text: 'Solitary — moving slowly near Sector C2' },
      { time: 'Yesterday', dot: C.ink3, text: 'Grazing alone at the southern pan' },
      { time: '4 days', dot: C.warning, text: 'Lion pride active in the adjacent sector' },
    ],
  },
]

const TEAMS = [
  { name: 'Alpha Team', status: 'On patrol', color: C.positive, sector: 'Sectors A+B', members: '3 rangers', lead: 'K. Dlamini', vehicle: 'GP-12', radio: 'Ch.1', task: 'Routine patrol & sighting log', checkIn: '06:02' },
  { name: 'Beta Team', status: 'Responding', color: C.critical, sector: 'Sector C4', members: '2 rangers', lead: 'T. Mbatha', vehicle: 'GP-08', radio: 'Ch.2', task: 'Responding to incident W-04 (snare)', checkIn: '05:14' },
  { name: 'Vet Unit', status: 'Standby', color: C.warning, sector: 'Base camp', members: '1 vet · 1 ranger', lead: 'Dr. N. Pillay', vehicle: 'GP-03', radio: 'Ch.4', task: 'On standby — ready to dart', checkIn: '05:20' },
  { name: 'Research Team', status: 'Active', color: C.positive, sector: 'River Section', members: '2 researchers', lead: 'S. Nkosi', vehicle: 'GP-15', radio: 'Ch.5', task: 'Waterbird survey', checkIn: '05:48' },
  { name: 'Fence Patrol', status: 'In progress', color: C.warning, sector: 'Sector D', members: '2 rangers', lead: 'J. Cele', vehicle: 'GP-22', radio: 'Ch.3', task: 'Boundary fence maintenance', checkIn: '05:35' },
  { name: 'Night Unit', status: 'Off duty', color: C.ink3, sector: 'Off duty', members: 'Returning 18:00', lead: 'M. Zulu', vehicle: 'GP-09', radio: '—', task: 'Stand-down — handover complete', checkIn: '05:55' },
]

const TASKS = [
  { id: 'T-218', priority: 'CRITICAL', color: C.critical, title: 'Respond to W-04 snare injury', loc: 'Sector C4', suggested: 'Vet Unit', assigned: 'Beta Team' },
  { id: 'T-219', priority: 'HIGH', color: C.warning, title: 'Replace Leopard "Ndlovu" GPS collar', loc: 'Sector B3', suggested: 'Vet Unit', assigned: null },
  { id: 'T-220', priority: 'MEDIUM', color: C.warning, title: 'Repair fence breach — single strand', loc: 'Sector D', suggested: 'Fence Patrol', assigned: 'Fence Patrol' },
  { id: 'T-221', priority: 'LOW', color: C.ink3, title: 'Water point inspection — 7 points', loc: 'River Section', suggested: 'Research Team', assigned: null },
  { id: 'T-222', priority: 'MEDIUM', color: C.warning, title: 'Buffalo bull welfare check', loc: 'Sector C2', suggested: 'Alpha Team', assigned: null },
]

const RAINFALL = [
  { day: 'W', mm: 0 }, { day: 'T', mm: 4 }, { day: 'F', mm: 11 }, { day: 'S', mm: 2 },
  { day: 'S', mm: 0 }, { day: 'M', mm: 1 }, { day: 'T', mm: 0 },
]

const SIGHTINGS = [
  { time: '05:47', species: 'Lion', count: 6, loc: 'Sector B2', ranger: 'K. Dlamini', note: 'Pride with 2 cubs', flag: true },
  { time: '05:12', species: 'Wild Dog', count: 8, loc: 'Sector C4', ranger: 'T. Mbatha', note: 'Injured W-04 flagged', flag: true },
  { time: '04:58', species: 'Elephant', count: 12, loc: 'N. Corridor', ranger: 'S. Nkosi', note: 'Matriarch "Thandi" leading', flag: false },
  { time: '04:15', species: 'White Rhino', count: 2, loc: 'Sector A4', ranger: 'K. Dlamini', note: 'SDR tracking nominal', flag: false },
  { time: '03:40', species: 'Leopard', count: 1, loc: 'Sector B3', ranger: 'J. Cele', note: '"Ndlovu" — collar alert', flag: false },
  { time: '02:55', species: 'Buffalo', count: 34, loc: 'Sector C2', ranger: 'T. Mbatha', note: 'Herd — healthy', flag: false },
  { time: '00:30', species: 'Black Rhino', count: 1, loc: 'Sector A1', ranger: 'Night unit', note: 'Rare sighting — photographed', flag: true },
]

const INCIDENTS = [
  { sev: 'CRITICAL', color: C.critical, title: 'W-04 Wild Dog — suspected snare injury', meta: '05:12 · Sector C4', status: 'Beta Team dispatched · ETA 15 min', note: 'Visible wound on left forelimb — vet notified', actions: ['View on map', 'Contact vet'] },
  { sev: 'MONITORING', color: C.warning, title: 'Leopard "Ndlovu" — collar battery critical', meta: '05:31 · Sector B3', status: 'No team dispatched — monitoring', note: 'Battery at 18% — replace within 72 hours', actions: ['Schedule replacement'] },
  { sev: 'LOW', color: C.ink3, title: 'Fence integrity — Sector D boundary', meta: '02:14 · Automated sensor', status: 'Maintenance scheduled for 08:00', note: 'Single strand breach, 3 m — no animals at risk', actions: ['View report'] },
]

/* ════════════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════════════ */
const Card = ({ className = '', hover = false, style, children, ...rest }) => (
  <div
    className={`rounded-xl ${className}`}
    style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadowCard, transition: 'box-shadow .25s ease, border-color .25s ease', ...style }}
    onMouseEnter={hover ? (e) => { e.currentTarget.style.boxShadow = C.shadowMd; e.currentTarget.style.borderColor = C.line2 } : undefined}
    onMouseLeave={hover ? (e) => { e.currentTarget.style.boxShadow = C.shadowCard; e.currentTarget.style.borderColor = C.line } : undefined}
    {...rest}
  >
    {children}
  </div>
)

const CardHead = ({ icon: Icon, title, sub, right }) => (
  <div className="flex items-center justify-between gap-3 px-5 h-[52px] shrink-0" style={{ borderBottom: `1px solid ${C.line}` }}>
    <div className="flex items-center gap-2.5 min-w-0">
      {Icon && <Icon size={15} color={C.ink3} strokeWidth={1.75} />}
      <span className="text-[13px] font-semibold tracking-[-0.01em] truncate" style={{ color: C.ink }}>{title}</span>
      {sub && <span className="text-[12px] truncate" style={{ color: C.ink4 }}>{sub}</span>}
    </div>
    {right}
  </div>
)

const Eyebrow = ({ children, className = '', style }) => (
  <span className={`caps text-[10.5px] font-semibold ${className}`} style={{ color: C.ink3, ...style }}>{children}</span>
)

const Pill = ({ children, color }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] text-[10px] font-semibold caps" style={{ color, background: `${color}16`, letterSpacing: '0.05em' }}>
    {children}
  </span>
)

const Dot = ({ color, size = 6 }) => (
  <span className="inline-block rounded-full shrink-0" style={{ width: size, height: size, background: color }} />
)

const Reveal = ({ delay = 0, className = '', children }) => (
  <div className={`reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>{children}</div>
)

const LiveDot = ({ color = C.positive }) => (
  <span className="relative flex h-1.5 w-1.5">
    <span className="pulse-ring absolute inline-flex h-full w-full rounded-full" style={{ background: color }} />
    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: color }} />
  </span>
)

/* Flat-top acacia — brand mark */
function AcaciaMark({ size = 19, color = C.surface }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V12" />
      <path d="M12 12.4c-2.2 0-4-.7-5.3-1.8" />
      <path d="M12 12.4c2.2 0 4-.7 5.3-1.8" />
      <path d="M4.4 9.4C7 7.5 9.4 6.7 12 6.7s5 .8 7.6 2.7" />
      <path d="M5.6 9.9h12.8" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════
   HAND-BUILT SVG DATA VIZ
   ════════════════════════════════════════════════════════════════ */
function smoothPath(pts) {
  if (pts.length < 2) return ''
  const t = 0.16
  const d = [`M ${pts[0].x} ${pts[0].y}`]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) * t
    const c1y = p1.y + (p2.y - p0.y) * t
    const c2x = p2.x - (p3.x - p1.x) * t
    const c2y = p2.y - (p3.y - p1.y) * t
    d.push(`C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`)
  }
  return d.join(' ')
}

function Sparkline({ data, color = C.ink3, id, w = 76, h = 26 }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const n = data.length
  const pad = 3
  const pts = data.map((v, i) => ({ x: (i / (n - 1)) * w, y: pad + (1 - (v - min) / span) * (h - 2 * pad) }))
  const line = pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${w} ${h} L 0 ${h} Z`
  const gid = `spark-${id}`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible shrink-0">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  )
}

function TrendArea({ data, color = C.accent, height = 150 }) {
  const [idx, setIdx] = useState(null)
  const n = data.length
  const vals = data.map((d) => d.v)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const span = max - min || 1
  const padY = 16
  const pts = data.map((d, i) => ({
    x: n === 1 ? 50 : (i / (n - 1)) * 100,
    y: padY + (1 - (d.v - min) / span) * (100 - 2 * padY),
  }))
  const line = smoothPath(pts)
  const area = `${line} L 100 100 L 0 100 Z`
  const gid = `trend-${color.replace('#', '')}`
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const rel = (e.clientX - r.left) / r.width
    setIdx(Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1)))))
  }
  return (
    <div className="relative" style={{ height }} onMouseMove={onMove} onMouseLeave={() => setIdx(null)}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="78%" stopColor={color} stopOpacity="0.02" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gid})`} />
        <path
          className="trend-line"
          d={line}
          pathLength="1"
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="absolute inset-0 pointer-events-none">
        {idx != null && (
          <>
            <div className="absolute top-0 bottom-0" style={{ left: `${pts[idx].x}%`, width: 1, background: C.line2 }} />
            <div className="absolute rounded-full" style={{ left: `${pts[idx].x}%`, top: `${pts[idx].y}%`, width: 9, height: 9, transform: 'translate(-50%,-50%)', background: C.surface, border: `2px solid ${color}`, boxShadow: C.shadowSm }} />
            <div className="absolute" style={{ left: `${pts[idx].x}%`, top: `${pts[idx].y}%`, transform: 'translate(-50%, calc(-100% - 12px))' }}>
              <div className="flex items-baseline gap-1.5 rounded-md px-2 py-1 whitespace-nowrap" style={{ background: C.ink, boxShadow: C.shadowMd }}>
                <span className="font-mono text-[11px] font-medium" style={{ color: '#fff' }}>{data[idx].v}%</span>
                <span className="font-mono text-[9.5px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{data[idx].m}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function RainBars({ data }) {
  const max = Math.max(...data.map((d) => d.mm), 1)
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height: 46 }}>
        {data.map((d, i) => {
          const has = d.mm > 0
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.mm} mm`}>
              <div className="w-full rounded-[3px] transition-all duration-500" style={{ height: `${Math.max((d.mm / max) * 100, 5)}%`, background: has ? C.accent : C.line2, opacity: has ? 0.82 : 0.5 }} />
            </div>
          )
        })}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-center font-mono text-[9px]" style={{ color: C.ink4 }}>{d.day}</span>
        ))}
      </div>
    </div>
  )
}

function SpeciesBars() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="flex flex-col gap-[11px]">
      {HEALTH.map((d, i) => {
        const col = healthColor(d.value)
        return (
          <div key={d.species} className="flex items-center gap-3">
            <div className="w-[88px] text-[12px] shrink-0 truncate" style={{ color: C.ink2 }}>{d.species}</div>
            <div className="flex-1 h-[7px] rounded-full overflow-hidden" style={{ background: C.sunken }}>
              <div className="h-full rounded-full" style={{ width: mounted ? `${d.value}%` : '0%', background: col, transition: `width 0.95s cubic-bezier(.22,.61,.36,1) ${i * 45}ms` }} />
            </div>
            <div className="w-7 text-right font-mono text-[11.5px]" style={{ color: col }}>{d.value}</div>
          </div>
        )
      })}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   SIDEBAR
   ════════════════════════════════════════════════════════════════ */
function Sidebar({ active, setActive }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[244px] flex flex-col z-20" style={{ background: C.paper, borderRight: `1px solid ${C.line}` }}>
      {/* Brand */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0" style={{ background: C.accent, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 1px 2px rgba(36,40,29,0.18)' }}>
            <AcaciaMark size={19} />
          </div>
          <div className="leading-none">
            <div className="font-display text-[17px] font-semibold" style={{ color: C.ink }}>Mziki</div>
            <div className="font-mono text-[9px] caps mt-1" style={{ color: C.ink3, letterSpacing: '0.2em' }}>Field Ops</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1">
        <Eyebrow className="block px-3 mb-2 text-[9.5px]">Operations</Eyebrow>
        {NAV.map((item) => {
          const Icon = item.icon
          const on = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="relative w-full flex items-center gap-3 pl-3 pr-2 py-2.5 mb-1 rounded-lg text-left"
              style={{ background: on ? C.surface : 'transparent', boxShadow: on ? C.shadowSm : 'none', transition: 'background .15s ease' }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = C.hover }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent' }}
            >
              {on && <span className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full" style={{ width: 3, height: 18, background: C.accent }} />}
              <Icon size={17} color={on ? C.accent : C.ink3} strokeWidth={on ? 2 : 1.75} />
              <span className="text-[13px]" style={{ color: on ? C.ink : C.ink2, fontWeight: on ? 600 : 500 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* System status */}
      <div className="mx-3 mb-2 rounded-lg px-3 py-2.5" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px] font-medium" style={{ color: C.ink2 }}>
            <LiveDot /> All systems live
          </span>
        </div>
        <div className="font-mono text-[10px] mt-1.5" style={{ color: C.ink4 }}>8 signals · synced 06:14</div>
      </div>

      {/* User */}
      <div className="m-3 mt-1 pt-3 flex items-center gap-2.5" style={{ borderTop: `1px solid ${C.line}` }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0" style={{ background: C.accentDeep, color: C.surface }}>KD</div>
        <div className="leading-tight min-w-0 flex-1">
          <div className="text-[12px] font-medium truncate" style={{ color: C.ink }}>K. Dlamini</div>
          <div className="text-[10px] truncate" style={{ color: C.ink3 }}>Head Field Ranger</div>
        </div>
        <ChevronRight size={14} color={C.ink4} />
      </div>
    </aside>
  )
}

/* ════════════════════════════════════════════════════════════════
   TOP BAR
   ════════════════════════════════════════════════════════════════ */
function TopBar({ page }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-6 px-10 h-[60px]" style={{ background: 'rgba(241,238,231,0.8)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: `1px solid ${C.line}` }}>
      <div className="min-w-0">
        <h1 className="font-display text-[19px] font-semibold leading-none tracking-[-0.01em]" style={{ color: C.ink }}>{page.title}</h1>
        <p className="text-[11.5px] mt-1.5" style={{ color: C.ink3 }}>{page.subtitle}</p>
      </div>

      <div className="flex-1 max-w-[380px] hidden lg:block">
        <div className="flex items-center gap-2.5 rounded-lg px-3 h-9" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
          <Search size={15} color={C.ink3} />
          <input placeholder="Search animals, sectors, incidents…" className="bg-transparent outline-none text-[12.5px] w-full" style={{ color: C.ink }} />
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ color: C.ink3, background: C.surface2, border: `1px solid ${C.line}` }}>⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] hidden xl:block" style={{ color: C.ink3 }}>Tue 10 Jun · 06:14 SAST</span>
        <span className="w-px h-5 hidden xl:block" style={{ background: C.line2 }} />
        {[Bell, Settings].map((Icon, i) => (
          <button key={i} className="relative w-9 h-9 rounded-lg flex items-center justify-center" style={{ border: `1px solid ${C.line}`, background: C.surface, transition: 'background .15s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.surface2)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.surface)}>
            <Icon size={16} color={C.ink2} strokeWidth={1.75} />
            {i === 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: C.critical, border: `1.5px solid ${C.surface}` }} />}
          </button>
        ))}
      </div>
    </header>
  )
}

/* ════════════════════════════════════════════════════════════════
   METRICS
   ════════════════════════════════════════════════════════════════ */
function Metrics() {
  const meta = {
    up: { color: C.positive, Icon: ArrowUpRight },
    down: { color: C.critical, Icon: ArrowDownRight },
    crit: { color: C.critical, Icon: AlertTriangle },
    flat: { color: C.ink3, Icon: Minus },
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {KPIS.map((k, i) => {
        const m = meta[k.trend]
        const M = m.Icon
        return (
          <Card key={k.label} hover className="p-[18px]">
            <Eyebrow className="text-[10px]">{k.label}</Eyebrow>
            <div className="flex items-end justify-between gap-2 mt-3">
              <div className="font-mono text-[24px] leading-none" style={{ color: C.ink }}>{k.value}</div>
              <Sparkline data={k.spark} id={i} color={m.color === C.ink3 ? C.ink3 : m.color} />
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <M size={12} color={m.color} strokeWidth={2.2} />
              <span className="text-[11.5px] font-medium" style={{ color: m.color }}>{k.delta}</span>
            </div>
            <div className="text-[10.5px] mt-1" style={{ color: C.ink4 }}>{k.note}</div>
          </Card>
        )
      })}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   RESERVE MAP — incident map
   ════════════════════════════════════════════════════════════════ */
function ContourLines() {
  const paths = [
    'M -40 120 C 120 60, 240 160, 380 90 S 620 40, 820 120',
    'M -40 190 C 140 130, 260 230, 400 160 S 640 120, 820 200',
    'M -40 265 C 160 215, 300 300, 440 245 S 660 215, 820 285',
    'M -40 345 C 120 315, 280 385, 420 335 S 640 315, 820 375',
    'M 120 -20 C 180 120, 120 240, 220 360 S 280 520, 200 620',
    'M 520 -20 C 560 140, 480 260, 580 380 S 640 520, 560 620',
  ]
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 780 480" preserveAspectRatio="none">
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#7FA095" strokeWidth="1" opacity={0.08 + (i % 3) * 0.02} />
      ))}
      <path d="M -20 300 C 120 260, 200 360, 320 330 S 520 380, 660 320 S 800 300, 820 320" fill="none" stroke="#5B8DB8" strokeWidth="3" opacity="0.16" strokeLinecap="round" />
    </svg>
  )
}

function MapMarker({ m, onHover, active }) {
  const color = MARKER_COLOR[m.type]
  return (
    <div className="absolute" style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%,-50%)' }} onMouseEnter={() => onHover(m)} onMouseLeave={() => onHover(null)}>
      <div className="relative flex items-center justify-center cursor-pointer" style={{ width: 14, height: 14 }}>
        {(m.type === 'critical' || m.type === 'team') && <span className="pulse-ring absolute rounded-full" style={{ width: 14, height: 14, background: color, opacity: 0.45 }} />}
        <span className="dot-core relative rounded-full" style={{ width: m.type === 'team' ? 9 : 8, height: m.type === 'team' ? 9 : 8, background: color, border: '1.5px solid rgba(18,22,16,0.55)', boxShadow: active ? `0 0 0 4px ${color}33, 0 0 10px ${color}` : `0 0 8px ${color}aa` }} />
      </div>
    </div>
  )
}

function ReserveMap() {
  const [hover, setHover] = useState(null)
  const legend = [
    { c: C.positive, t: 'Healthy / tracked' },
    { c: C.warning, t: 'Monitoring' },
    { c: C.critical, t: 'Critical alert' },
    { c: C.info, t: 'Field team' },
  ]
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-5 h-[52px] shrink-0" style={{ borderBottom: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <Radio size={15} color={C.ink3} strokeWidth={1.75} />
          <span className="text-[13px] font-semibold" style={{ color: C.ink }}>Live Animal Tracking</span>
          <span className="text-[12px] hidden sm:inline" style={{ color: C.ink4 }}>· Mziki Reserve · 6,000 ha</span>
        </div>
        <span className="flex items-center gap-2 caps text-[10px] font-semibold" style={{ color: C.positive }}>
          <LiveDot /> Live · 8 signals
        </span>
      </div>

      <div className="relative flex-1 min-h-[400px]" style={{ background: 'radial-gradient(125% 120% at 28% 32%, #29331F 0%, #1B2419 46%, #141A12 100%)' }}>
        <ContourLines />
        {SECTORS.map((s) => (
          <span key={s.label} className="absolute font-mono text-[8.5px] caps select-none pointer-events-none" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%,-50%)', color: 'rgba(232,228,216,0.18)', letterSpacing: '0.16em' }}>{s.label}</span>
        ))}
        {MARKERS.map((m) => <MapMarker key={m.id} m={m} onHover={setHover} active={hover?.id === m.id} />)}

        {hover && (
          <div className="absolute z-10 rounded-lg px-3 py-2 pointer-events-none" style={{ left: `${hover.x}%`, top: `${hover.y}%`, transform: 'translate(-50%, calc(-100% - 14px))', background: 'rgba(16,20,13,0.94)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 10px 28px rgba(0,0,0,0.5)', minWidth: 184, backdropFilter: 'blur(6px)' }}>
            <div className="flex items-center gap-2">
              <Dot color={MARKER_COLOR[hover.type]} />
              <span className="text-[12px] font-semibold" style={{ color: C.mapInk }}>{hover.species}</span>
            </div>
            <div className="font-mono text-[10px] mt-1" style={{ color: C.mapInk2 }}>{hover.tag}</div>
            <div className="caps text-[9.5px] font-semibold mt-1" style={{ color: MARKER_COLOR[hover.type], letterSpacing: '0.05em' }}>{hover.status}</div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 rounded-lg px-3 py-2.5" style={{ background: 'rgba(16,20,13,0.66)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)' }}>
          <Eyebrow className="block mb-2 text-[8.5px]" style={{ color: C.mapInk2 }}>Legend</Eyebrow>
          <div className="grid grid-cols-2 gap-x-5 gap-y-1.5">
            {legend.map((l) => (
              <div key={l.t} className="flex items-center gap-2">
                <Dot color={l.c} size={6} />
                <span className="text-[10px]" style={{ color: C.mapInk2 }}>{l.t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-[9.5px] caps" style={{ color: 'rgba(232,228,216,0.3)', letterSpacing: '0.06em' }}>27.9128°S · 32.2041°E</div>
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   TIMELINE (shared by activity feed + animal activity)
   ════════════════════════════════════════════════════════════════ */
function Timeline({ items, showTag = false, maxH = 460 }) {
  return (
    <div className="scroll-thin overflow-y-auto px-5 py-4" style={{ maxHeight: maxH }}>
      {items.map((a, i) => {
        const last = i === items.length - 1
        return (
          <div key={i} className="flex gap-3.5">
            <div className="flex flex-col items-center pt-[5px]">
              <span className="rounded-full shrink-0" style={{ width: 8, height: 8, background: a.dot, boxShadow: `0 0 0 3px ${C.surface}` }} />
              {!last && <span className="w-px flex-1 my-1" style={{ background: C.line }} />}
            </div>
            <div className={`min-w-0 flex-1 ${last ? 'pb-0' : 'pb-4'}`}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-medium" style={{ color: C.accentDeep }}>{a.time}</span>
                {showTag && a.tag && <span className="font-mono text-[9px] caps px-1.5 py-px rounded" style={{ color: C.ink3, background: C.surface2, letterSpacing: '0.04em' }}>{a.tag}</span>}
              </div>
              <p className="text-[12.5px] mt-1 leading-snug" style={{ color: C.ink }}>{a.text}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ActivityFeed() {
  return (
    <Card className="flex flex-col h-full">
      <CardHead icon={Activity} title="Recent Activity" right={<Eyebrow className="text-[9.5px]">Last 6 hrs</Eyebrow>} />
      <Timeline items={ACTIVITY} showTag />
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   INCIDENTS
   ════════════════════════════════════════════════════════════════ */
function IncidentList() {
  return (
    <Card className="flex flex-col h-full">
      <CardHead icon={AlertTriangle} title="Active Incidents" right={<Pill color={C.critical}>3 open</Pill>} />
      <div className="p-5 flex flex-col gap-3.5 flex-1">
        {INCIDENTS.map((inc, i) => (
          <div key={i} className="rounded-lg p-4 transition-colors" style={{ background: C.surface2, border: `1px solid ${C.line}` }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.line2)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.line)}>
            <div className="flex items-center justify-between">
              <Pill color={inc.color}><Dot color={inc.color} size={5} />{inc.sev}</Pill>
              <span className="font-mono text-[10.5px]" style={{ color: C.ink4 }}>{inc.meta}</span>
            </div>
            <div className="text-[13px] font-semibold mt-2.5 leading-snug tracking-[-0.01em]" style={{ color: C.ink }}>{inc.title}</div>
            <div className="text-[11.5px] mt-1" style={{ color: C.ink2 }}>{inc.status}</div>
            <div className="flex items-start gap-1.5 mt-2.5 pt-2.5" style={{ borderTop: `1px solid ${C.line}` }}>
              <span className="w-[3px] self-stretch rounded-full shrink-0" style={{ background: `${inc.color}55` }} />
              <p className="text-[11.5px] leading-snug italic" style={{ color: C.ink2 }}>{inc.note}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {inc.actions.map((a, j) => {
                const primary = j === 0
                return (
                  <button key={a} className="text-[11px] font-medium rounded-md px-2.5 py-1.5 transition-colors"
                    style={primary
                      ? { background: C.accent, color: C.surface }
                      : { background: C.surface, color: C.ink2, border: `1px solid ${C.line2}` }}
                    onMouseEnter={(e) => { if (primary) e.currentTarget.style.background = C.accentDeep; else e.currentTarget.style.background = C.surface2 }}
                    onMouseLeave={(e) => { if (primary) e.currentTarget.style.background = C.accent; else e.currentTarget.style.background = C.surface }}>
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
   CONDITIONS
   ════════════════════════════════════════════════════════════════ */
function Conditions() {
  const stats = [
    { icon: Thermometer, label: 'Temp', value: '22°C', sub: 'feels 19°' },
    { icon: Droplets, label: 'Humidity', value: '68%', sub: 'moderate' },
    { icon: Wind, label: 'Wind', value: '14', sub: 'km/h NW' },
    { icon: CloudRain, label: 'Rain today', value: '0', sub: 'mm' },
  ]
  return (
    <Card className="flex flex-col h-full">
      <CardHead icon={Sunrise} title="Reserve Conditions" right={<Eyebrow className="text-[9.5px]">Live</Eyebrow>} />
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="grid grid-cols-2 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="p-3" style={{ background: C.surface2, borderRight: i % 2 === 0 ? `1px solid ${C.line}` : 'none', borderBottom: i < 2 ? `1px solid ${C.line}` : 'none' }}>
                <div className="flex items-center gap-1.5">
                  <Icon size={12} color={C.ink3} strokeWidth={1.75} />
                  <Eyebrow className="text-[9px]">{s.label}</Eyebrow>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-mono text-[18px] leading-none" style={{ color: C.ink }}>{s.value}</span>
                  <span className="text-[9.5px]" style={{ color: C.ink4 }}>{s.sub}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div>
          <Eyebrow className="block mb-2 text-[9px]">Rainfall · 7 days · 18 mm total</Eyebrow>
          <RainBars data={RAINFALL} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Eyebrow className="text-[9px]">Bush Density Index</Eyebrow>
            <span className="font-mono text-[12px]" style={{ color: C.accentDeep }}>72</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.sunken }}>
            <div className="h-full rounded-full" style={{ width: '72%', background: C.accent }} />
          </div>
          <div className="text-[10px] mt-1.5" style={{ color: C.ink4 }}>Good post-summer growth</div>
        </div>

        <div className="flex items-center gap-4 mt-auto pt-4 text-[11px]" style={{ borderTop: `1px solid ${C.line}`, color: C.ink2 }}>
          <span className="flex items-center gap-1.5"><Sunrise size={13} color={C.warning} /> <span className="font-mono">05:52</span></span>
          <span className="flex items-center gap-1.5"><Sunset size={13} color={C.warning} /> <span className="font-mono">17:34</span></span>
          <span className="flex items-center gap-1.5"><Moon size={13} color={C.ink3} /> Waxing 34%</span>
        </div>
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   SPECIES HEALTH
   ════════════════════════════════════════════════════════════════ */
function SpeciesHealth() {
  return (
    <Card className="flex flex-col h-full">
      <CardHead icon={HeartPulse} title="Species Health Index" right={<Eyebrow className="text-[9.5px]">8 species</Eyebrow>} />
      <div className="p-5 flex-1">
        <SpeciesBars />
      </div>
      <div className="flex items-center gap-4 px-5 py-3.5 text-[11px]" style={{ borderTop: `1px solid ${C.line}`, color: C.ink2 }}>
        <span>Last vet round <span className="font-mono" style={{ color: C.ink }}>3 days ago</span></span>
        <span style={{ color: C.line2 }}>·</span>
        <span>Next in <span className="font-mono" style={{ color: C.accentDeep }}>2 days</span></span>
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   ANIMAL HEALTH RECORD
   ════════════════════════════════════════════════════════════════ */
function AnimalRoster({ animals, selIndex, onSelect }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHead icon={Users} title="Roster" right={<Eyebrow className="text-[9.5px]">{animals.length} tracked</Eyebrow>} />
      <div className="scroll-thin overflow-y-auto flex-1 p-2">
        {animals.map((a, i) => {
          const on = i === selIndex
          const meta = STATUS[a.status]
          return (
            <button key={a.id} onClick={() => onSelect(i)} className="relative w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5"
              style={{ background: on ? C.surface2 : 'transparent', transition: 'background .15s ease' }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = C.hover }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent' }}>
              {on && <span className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full" style={{ width: 3, height: 22, background: meta.color }} />}
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[18px] shrink-0" style={{ background: C.surface, border: `1px solid ${C.line}` }}>{a.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-medium truncate" style={{ color: C.ink }}>{a.name}</div>
                <div className="text-[10.5px] mt-0.5 truncate" style={{ color: C.ink3 }}>{a.species} · {a.sector}</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="font-mono text-[12px]" style={{ color: healthColor(a.health) }}>{a.health}%</span>
                <Dot color={meta.color} size={6} />
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function Vital({ icon: Icon, label, value, color }) {
  return (
    <div className="p-3" style={{ background: C.surface2 }}>
      <div className="flex items-center gap-1.5">
        <Icon size={11} color={C.ink3} strokeWidth={1.75} />
        <Eyebrow className="text-[9px]">{label}</Eyebrow>
      </div>
      <div className="font-mono text-[15px] mt-1.5 leading-none" style={{ color: color || C.ink }}>{value}</div>
    </div>
  )
}

function AnimalProfile({ animal }) {
  const meta = STATUS[animal.status]
  const trend = animal.trend.map((v, i) => ({ m: TREND_MONTHS[i], v }))
  const vitals = [
    { icon: HeartPulse, label: 'Health', value: `${animal.health}%`, color: healthColor(animal.health) },
    { icon: Battery, label: 'Collar', value: animal.collar },
    { icon: Calendar, label: 'Age', value: animal.age },
    { icon: Scale, label: 'Weight', value: animal.weight },
    { icon: Clock, label: 'Last seen', value: animal.lastSeen },
    { icon: MapPin, label: 'Location', value: animal.sector },
  ]
  return (
    <Card className="flex flex-col h-full" style={{ background: C.surface }}>
      {/* hero header */}
      <div className="p-6 flex items-start justify-between gap-5 flex-wrap" style={{ borderBottom: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[34px] shrink-0" style={{ background: C.surface2, border: `1px solid ${C.line}` }}>{animal.emoji}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-display text-[24px] font-semibold leading-none tracking-[-0.015em]" style={{ color: C.ink }}>{animal.name}</h2>
              <Pill color={meta.color}><Dot color={meta.color} size={5} />{meta.label}</Pill>
            </div>
            <div className="font-mono text-[11.5px] mt-2" style={{ color: C.ink2 }}>{animal.tag}</div>
            <div className="text-[11px] mt-1" style={{ color: C.ink3 }}>{animal.species} · {animal.sex} · {animal.group}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-[11px] font-medium rounded-lg px-3 py-2 transition-colors" style={{ background: C.accent, color: C.surface }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.accentDeep)} onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}>
            <ClipboardList size={13} /> Log observation
          </button>
          <button className="flex items-center gap-1.5 text-[11px] font-medium rounded-lg px-3 py-2 transition-colors" style={{ background: C.surface, color: C.ink2, border: `1px solid ${C.line2}` }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.surface2)} onMouseLeave={(e) => (e.currentTarget.style.background = C.surface)}>
            <Stethoscope size={13} /> Schedule vet
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1">
        {/* vitals */}
        <div className="grid grid-cols-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
          {vitals.map((v, i) => (
            <div key={v.label} style={{ borderRight: i % 3 !== 2 ? `1px solid ${C.line}` : 'none', borderBottom: i < 3 ? `1px solid ${C.line}` : 'none' }}>
              <Vital {...v} />
            </div>
          ))}
        </div>

        {/* trend */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Eyebrow className="text-[9.5px]">Health Index · 6 months</Eyebrow>
            <span className="text-[10.5px]" style={{ color: C.ink3 }}>attending vet · <span className="font-medium" style={{ color: C.ink2 }}>{animal.vet}</span></span>
          </div>
          <TrendArea data={trend} color={healthColor(animal.health)} />
          <div className="flex justify-between mt-1 px-1">
            {TREND_MONTHS.map((m) => <span key={m} className="font-mono text-[9.5px]" style={{ color: C.ink4 }}>{m}</span>)}
          </div>
        </div>

        {/* clinical note */}
        <div className="rounded-xl p-4 mt-auto" style={{ background: C.surface2, borderLeft: `2.5px solid ${meta.color}`, border: `1px solid ${C.line}`, borderLeftWidth: '2.5px', borderLeftColor: meta.color }}>
          <div className="flex items-center justify-between mb-2">
            <Eyebrow className="text-[9.5px]">Clinical Note</Eyebrow>
            <Pill color={meta.color}>{animal.treatment}</Pill>
          </div>
          <p className="text-[12.5px] leading-relaxed" style={{ color: C.ink2 }}>{animal.note}</p>
        </div>
      </div>
    </Card>
  )
}

function AnimalActivity({ animal }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHead icon={Activity} title="Recent Activity" right={<span className="font-mono text-[10px] caps px-1.5 py-0.5 rounded" style={{ color: C.ink3, background: C.surface2, letterSpacing: '0.04em' }}>{animal.id}</span>} />
      <Timeline items={animal.activity} maxH={320} />
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   SIGHTINGS
   ════════════════════════════════════════════════════════════════ */
function SightingsTable() {
  const cols = ['Time', 'Species', 'Count', 'Location', 'Ranger', 'Notable']
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHead icon={Compass} title="Sightings Today" right={<span className="font-mono text-[11px]" style={{ color: C.ink3 }}>47 recorded</span>} />
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c} className="caps text-[9.5px] font-semibold px-5 py-2.5 whitespace-nowrap" style={{ color: C.ink3, borderBottom: `1px solid ${C.line}`, background: C.surface2 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIGHTINGS.map((s, i) => (
              <tr key={i} className="transition-colors" style={{ borderBottom: i < SIGHTINGS.length - 1 ? `1px solid ${C.line}` : 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-5 py-3 font-mono text-[11.5px]" style={{ color: C.accentDeep }}>{s.time}</td>
                <td className="px-5 py-3 text-[12.5px] font-medium" style={{ color: C.ink }}>{s.species}</td>
                <td className="px-5 py-3 font-mono text-[12px]" style={{ color: C.ink2 }}>{s.count}</td>
                <td className="px-5 py-3 text-[12px]" style={{ color: C.ink2 }}>{s.loc}</td>
                <td className="px-5 py-3 text-[12px]" style={{ color: C.ink2 }}>{s.ranger}</td>
                <td className="px-5 py-3 text-[12px]" style={{ color: C.ink2 }}>
                  <span className="inline-flex items-center gap-1.5">
                    {s.flag && <Dot color={C.warning} size={5} />}
                    <span style={{ color: s.flag ? C.ink : C.ink2 }}>{s.note}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   TEAM DISPATCH
   ════════════════════════════════════════════════════════════════ */
function DispatchStats({ openCount }) {
  const stats = [
    { icon: Users, label: 'Deployed', value: '6 / 8', sub: '2 on standby', color: C.accent },
    { icon: Navigation, label: 'Responding', value: '1', sub: 'incident W-04', color: C.critical },
    { icon: Clock, label: 'Standby', value: '2', sub: 'ready to deploy', color: C.warning },
    { icon: ClipboardList, label: 'Open Tasks', value: openCount, sub: 'awaiting assignment', color: C.accentDeep },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <Card key={s.label} hover className="p-[18px] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}14` }}>
              <Icon size={17} color={s.color} strokeWidth={1.9} />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[21px] leading-none" style={{ color: C.ink }}>{s.value}</div>
              <Eyebrow className="block mt-1.5 text-[9.5px]">{s.label}</Eyebrow>
              <div className="text-[10px] mt-0.5 truncate" style={{ color: C.ink4 }}>{s.sub}</div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function TeamGrid() {
  return (
    <Card className="flex flex-col h-full">
      <CardHead icon={Users} title="Active Field Teams" right={<span className="font-mono text-[11px]" style={{ color: C.ink3 }}>6 / 8 deployed</span>} />
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-3.5 flex-1">
        {TEAMS.map((t) => (
          <div key={t.name} className="rounded-lg p-4 flex flex-col transition-colors" style={{ background: C.surface2, border: `1px solid ${C.line}` }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.line2)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.line)}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-semibold tracking-[-0.01em]" style={{ color: C.ink }}>{t.name}</span>
              <Pill color={t.color}><Dot color={t.color} size={5} />{t.status}</Pill>
            </div>
            <div className="text-[11px] mt-1.5" style={{ color: C.ink2 }}>{t.lead} · {t.members}</div>
            <div className="flex items-center gap-3 mt-2 font-mono text-[10px]" style={{ color: C.ink3 }}>
              <span className="flex items-center gap-1"><MapPin size={11} strokeWidth={1.75} /> {t.sector}</span>
              <span className="flex items-center gap-1"><Navigation size={11} strokeWidth={1.75} /> {t.vehicle}</span>
              <span className="flex items-center gap-1"><Radio size={11} strokeWidth={1.75} /> {t.radio}</span>
            </div>
            <div className="text-[11.5px] mt-2.5 leading-snug" style={{ color: C.ink }}>{t.task}</div>
            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
              <span className="font-mono text-[9.5px] caps" style={{ color: C.ink4, letterSpacing: '0.05em' }}>check-in {t.checkIn}</span>
              <div className="flex gap-1.5">
                {[MessageSquare, Send].map((Icon, k) => (
                  <button key={k} className="w-7 h-7 rounded-md flex items-center justify-center transition-colors" style={{ border: `1px solid ${C.line2}`, color: C.ink2, background: C.surface }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.surface2)} onMouseLeave={(e) => (e.currentTarget.style.background = C.surface)}>
                    <Icon size={13} strokeWidth={1.75} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function TaskQueue({ tasks, onAssign }) {
  const teamNames = TEAMS.map((t) => t.name)
  const open = tasks.filter((t) => !t.assigned).length
  return (
    <Card className="flex flex-col h-full">
      <CardHead icon={ClipboardList} title="Task Assignment" right={<Pill color={open ? C.warning : C.positive}>{open} open</Pill>} />
      <div className="p-5 flex flex-col gap-3 flex-1">
        {tasks.map((t) => (
          <div key={t.id} className="rounded-lg p-4" style={{ background: C.surface2, border: `1px solid ${C.line}` }}>
            <div className="flex items-center justify-between gap-2">
              <Pill color={t.color}><Dot color={t.color} size={5} />{t.priority}</Pill>
              <span className="font-mono text-[10px]" style={{ color: C.ink4 }}>{t.id}</span>
            </div>
            <div className="text-[13px] font-semibold mt-2.5 leading-snug tracking-[-0.01em]" style={{ color: C.ink }}>{t.title}</div>
            <div className="flex items-center gap-2 mt-1.5 font-mono text-[10.5px]" style={{ color: C.ink3 }}>
              <span className="flex items-center gap-1"><MapPin size={11} strokeWidth={1.75} /> {t.loc}</span>
              <span style={{ color: C.line2 }}>·</span>
              <span>suggest {t.suggested}</span>
            </div>
            <div className="flex items-center justify-between gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
              <span className="text-[11px] flex items-center gap-1.5" style={{ color: t.assigned ? C.accentDeep : C.ink3 }}>
                {t.assigned ? <><Dot color={C.accent} size={5} />{t.assigned}</> : 'Unassigned'}
              </span>
              <div className="relative shrink-0">
                <select value={t.assigned || ''} onChange={(e) => onAssign(t.id, e.target.value)}
                  className="text-[11px] font-medium rounded-md pl-2.5 pr-7 py-1.5 cursor-pointer outline-none transition-colors"
                  style={{ background: t.assigned ? C.accentTint : C.surface, color: t.assigned ? C.accentDeep : C.ink2, border: `1px solid ${t.assigned ? `${C.accent}40` : C.line2}` }}>
                  <option value="">Assign team…</option>
                  {teamNames.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" color={t.assigned ? C.accentDeep : C.ink3} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════════════════════════════
   VIEWS
   ════════════════════════════════════════════════════════════════ */
function OverviewView() {
  return (
    <>
      <Reveal delay={0}><Metrics /></Reveal>
      <Reveal delay={70}>
        <div className="grid grid-cols-1 xl:grid-cols-[1.9fr_1fr] gap-6 items-stretch">
          <ReserveMap />
          <ActivityFeed />
        </div>
      </Reveal>
      <Reveal delay={140}>
        <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-6 items-stretch">
          <IncidentList />
          <Conditions />
        </div>
      </Reveal>
    </>
  )
}

function AnimalView() {
  const [sel, setSel] = useState(0)
  const animal = ANIMALS[sel]
  return (
    <>
      <Reveal delay={0}>
        <div className="grid grid-cols-1 xl:grid-cols-[308px_minmax(0,1fr)] gap-6 items-stretch">
          <AnimalRoster animals={ANIMALS} selIndex={sel} onSelect={setSel} />
          <AnimalProfile animal={animal} />
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 items-stretch">
          <AnimalActivity animal={animal} />
          <SpeciesHealth />
        </div>
      </Reveal>
      <Reveal delay={150}><SightingsTable /></Reveal>
    </>
  )
}

function DispatchView() {
  const [tasks, setTasks] = useState(TASKS)
  const assign = (id, team) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, assigned: team || null } : t)))
  const open = tasks.filter((t) => !t.assigned).length
  return (
    <>
      <Reveal delay={0}><DispatchStats openCount={open} /></Reveal>
      <Reveal delay={80}>
        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6 items-stretch">
          <TeamGrid />
          <TaskQueue tasks={tasks} onAssign={assign} />
        </div>
      </Reveal>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   APP
   ════════════════════════════════════════════════════════════════ */
export default function App() {
  const [active, setActive] = useState('overview')
  const page = PAGES[active]
  return (
    <div className="min-h-screen" style={{ background: C.paper, color: C.ink }}>
      <Sidebar active={active} setActive={setActive} />
      <div className="ml-[244px]">
        <TopBar page={page} />
        <main key={active} className="px-10 py-8 flex flex-col gap-6 max-w-[1640px]">
          {active === 'overview' && <OverviewView />}
          {active === 'animal' && <AnimalView />}
          {active === 'dispatch' && <DispatchView />}

          <footer className="flex items-center justify-between flex-wrap gap-2 pt-2 pb-1 text-[10.5px]" style={{ color: C.ink4 }}>
            <span className="flex items-center gap-1.5"><MapPin size={11} /> Mziki Private Game Reserve · Munywana Conservancy · KwaZulu-Natal</span>
            <span className="font-mono caps" style={{ letterSpacing: '0.06em' }}>&Beyond Phinda · Zuka · 400+ bird species</span>
          </footer>
        </main>
      </div>
    </div>
  )
}
