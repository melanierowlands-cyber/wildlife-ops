import { useState } from 'react'
import { COL, AnimatedValue } from './shared'
import { Sidebar, TopBar } from './Chrome'

/* ════════════════════════════════════════════════════════════════
   Mziki — Team Dispatch · pixel-faithful rebuild of Figma 50:193
   ════════════════════════════════════════════════════════════════ */
const HG = '"Hanken Grotesk", sans-serif'
const BC = { healthy: COL.healthy, critical: COL.critical, monitor: COL.monitor, muted: COL.muted }

const STATS = [
  { label: 'Teams Deployed', value: '6 / 8', delta: '2 on standby', note: 'across the reserve' },
  { label: 'Responding', value: '1', delta: 'incident W-04', note: 'Beta Team en route' },
  { label: 'On Standby', value: '2', delta: 'ready to deploy', note: 'Vet Unit · Night Unit' },
  { label: 'Open Tasks', value: '3', delta: '2 high priority', note: 'awaiting assignment' },
]
const TEAMS = [
  { name: 'Alpha Team', badge: 'ON PATROL', bc: 'healthy', meta: 'K. Dlamini · 3 rangers', task: 'Routine patrol & sighting log across the western sectors.', footer: 'Sectors A+B · GP-12 · ✓ checked in 06:02' },
  { name: 'Beta Team', badge: 'RESPONDING', bc: 'critical', meta: 'T. Mbatha · 2 rangers', task: 'Responding to incident W-04 — suspected snare injury.', footer: 'Sector C4 · GP-08 · ✓ checked in 05:14' },
  { name: 'Vet Unit', badge: 'STANDBY', bc: 'monitor', meta: 'Dr. N. Pillay · 1 vet · 1 ranger', task: 'On standby at base camp — ready to dart and treat.', footer: 'Base camp · GP-03 · ✓ checked in 05:20' },
  { name: 'Research Team', badge: 'ACTIVE', bc: 'healthy', meta: 'S. Nkosi · 2 researchers', task: 'Waterbird survey along the river section transect.', footer: 'River Section · GP-15 · ✓ checked in 05:48' },
  { name: 'Fence Patrol', badge: 'IN PROGRESS', bc: 'monitor', meta: 'J. Cele · 2 rangers', task: 'Boundary fence maintenance — repairing strand breach.', footer: 'Sector D · GP-22 · ✓ checked in 05:35' },
  { name: 'Night Unit', badge: 'OFF DUTY', bc: 'muted', meta: 'M. Zulu · returning 18:00', task: 'Stand-down — night handover complete, vehicle returned.', footer: 'Off duty · GP-09 · ✓ checked in 05:55' },
]
const TASKS = [
  { id: 'T-218', prio: 'CRITICAL', pc: 'critical', loc: 'Sector C4', title: 'Respond to W-04 snare injury', assigned: 'Beta Team' },
  { id: 'T-219', prio: 'HIGH', pc: 'monitor', loc: 'Sector B3', title: "Replace Leopard 'Ndlovu' GPS collar", assigned: null, suggest: 'Vet Unit' },
  { id: 'T-220', prio: 'MEDIUM', pc: 'monitor', loc: 'Sector D', title: 'Repair fence breach — single strand', assigned: 'Fence Patrol' },
  { id: 'T-221', prio: 'LOW', pc: 'muted', loc: 'River Section', title: 'Water-point inspection — 7 points', assigned: null, suggest: 'Research Team' },
  { id: 'T-222', prio: 'MEDIUM', pc: 'monitor', loc: 'Sector C2', title: 'Buffalo bull welfare check', assigned: null, suggest: 'Alpha Team' },
]

function Badge({ label, color, small }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', padding: small ? '3px 8px' : '4px 10px', borderRadius: 9, background: color }}>
      <span style={{ fontFamily: HG, fontSize: 9.5, fontWeight: 600, color: COL.white, letterSpacing: '0.6px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  )
}

function StatCard({ label, value, delta, note }) {
  const [h, setH] = useState(false)
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ flex: '1 0 0', minWidth: 0, background: COL.stat, borderRadius: 21, padding: '14px 16px 13px 18px', display: 'flex', flexDirection: 'column', gap: 3, color: COL.white, fontFamily: HG, transform: h ? 'translateY(-4px)' : 'none', boxShadow: h ? '0 16px 32px -14px rgba(0,18,15,0.55)' : 'none', transition: 'transform .15s cubic-bezier(.22,.61,.36,1), box-shadow .2s ease' }}>
      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{label}</p>
      <p style={{ margin: 0, fontSize: 27, fontWeight: 400 }}><AnimatedValue value={value} /></p>
      <p style={{ margin: 0, fontSize: 12.5, fontWeight: 500 }}>{delta}</p>
      <p style={{ margin: 0, fontSize: 10.5, fontWeight: 300 }}>{note}</p>
    </div>
  )
}

function TeamCard({ t }) {
  const [h, setH] = useState(false)
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 271, height: 176, boxSizing: 'border-box', background: COL.panel, borderRadius: 16, padding: '14px 14px 13px 15px', display: 'flex', flexDirection: 'column', gap: 7, fontFamily: HG, transform: h ? 'translateY(-3px)' : 'none', boxShadow: h ? '0 14px 28px -14px rgba(0,20,16,0.5)' : 'none', transition: 'transform .15s ease, box-shadow .2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: COL.ink, whiteSpace: 'nowrap' }}>{t.name}</p>
        <Badge label={t.badge} color={BC[t.bc]} />
      </div>
      <p style={{ margin: 0, fontSize: 11, color: COL.muted }}>{t.meta}</p>
      <p style={{ margin: 0, fontSize: 11.5, color: COL.ink, lineHeight: 1.35 }}>{t.task}</p>
      <div style={{ flex: '1 0 0' }} />
      <p style={{ margin: 0, fontSize: 10, fontWeight: 300, color: COL.muted }}>{t.footer}</p>
    </div>
  )
}

function TaskItem({ t, onAssign }) {
  const assigned = t.assigned
  return (
    <div style={{ background: COL.inset, borderRadius: 12, padding: '12px 13px', display: 'flex', flexDirection: 'column', gap: 7, width: '100%', boxSizing: 'border-box', fontFamily: HG }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Badge label={t.prio} color={BC[t.pc]} />
        <span style={{ fontSize: 9.5, fontWeight: 300, color: COL.muted, whiteSpace: 'nowrap' }}>{t.loc} · {t.id}</span>
      </div>
      <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: COL.ink }}>{t.title}</p>
      {assigned ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 9, background: '#d9e1d3', color: COL.ink }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>✓&nbsp;&nbsp;{assigned}</span>
          <span style={{ fontSize: 11 }}>▾</span>
        </div>
      ) : (
        <button onClick={() => onAssign(t.id, t.suggest)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 9, background: COL.white2, border: `1px solid #cdcdbe`, color: COL.muted, cursor: 'pointer', fontFamily: HG, width: '100%' }}>
          <span style={{ fontSize: 11 }}>Assign a team…</span>
          <span style={{ fontSize: 12 }}>▾</span>
        </button>
      )}
    </div>
  )
}

export default function TeamDispatchScreen({ onNavigate }) {
  const [tasks, setTasks] = useState(TASKS)
  const [toast, setToast] = useState(null)
  const openCount = tasks.filter((t) => !t.assigned).length
  const assign = (id, team) => {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, assigned: team } : t)))
    setToast(`Assigned ${team}`); clearTimeout(assign._t); assign._t = setTimeout(() => setToast(null), 2200)
  }

  return (
    <div style={{ position: 'relative', width: 1280, height: 832, background: COL.canvas, fontFamily: HG, overflow: 'hidden' }}>
      <Sidebar active="dispatch" onNavigate={onNavigate} />
      <TopBar title="Team Dispatch" />

      {/* stats */}
      <div style={{ position: 'absolute', left: 345, top: 77, width: 899, display: 'flex', gap: 14, alignItems: 'stretch' }}>
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* field teams */}
      <div style={{ position: 'absolute', left: 345, top: 215, width: 556, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 300, color: COL.panel, letterSpacing: '1.2px' }}>ACTIVE FIELD TEAMS</span>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: COL.gold }}>6 / 8 DEPLOYED</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {TEAMS.map((t) => <TeamCard key={t.name} t={t} />)}
        </div>
      </div>

      {/* task assignment */}
      <div style={{ position: 'absolute', left: 914, top: 243, width: 330, height: 556, boxSizing: 'border-box', background: COL.panel, borderRadius: 21, padding: '18px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '0 0 auto' }}>
          <span style={{ fontSize: 11, fontWeight: 300, color: COL.label }}>TASK ASSIGNMENT</span>
          <Badge label={`${openCount} OPEN`} color={COL.gold} small />
        </div>
        <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4, marginRight: -4 }}>
          {tasks.map((t) => <TaskItem key={t.id} t={t} onAssign={assign} />)}
        </div>
        {/* bottom fade — masks the partial card at the scroll cutoff */}
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, height: 26, borderBottomLeftRadius: 21, borderBottomRightRadius: 21, background: `linear-gradient(to bottom, rgba(228,228,213,0), ${COL.panel})`, pointerEvents: 'none' }} />
      </div>

      {/* toast */}
      <div style={{ position: 'absolute', left: '50%', bottom: 20, transform: `translateX(-50%) translateY(${toast ? 0 : 12}px)`, opacity: toast ? 1 : 0, transition: 'opacity .2s ease, transform .2s ease', pointerEvents: 'none', background: 'rgba(0,40,34,0.92)', color: COL.white, padding: '10px 18px', borderRadius: 999, fontFamily: HG, fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', boxShadow: '0 10px 28px -10px rgba(0,0,0,0.5)', border: `1px solid ${COL.gold}` }}>
        {toast || ''}
      </div>
    </div>
  )
}
