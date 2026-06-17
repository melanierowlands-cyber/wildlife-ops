import { useState, useEffect } from 'react'
import { COL } from './shared'

const HG = '"Hanken Grotesk", sans-serif'
const field = { width: '100%', boxSizing: 'border-box', background: COL.inset, border: '1px solid #cdcdbe', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: COL.ink, fontFamily: HG, outline: 'none' }
const labelStyle = { fontSize: 10, fontWeight: 600, color: COL.label, letterSpacing: '0.6px', textTransform: 'uppercase' }

function Labeled({ label, children, style }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}><span style={labelStyle}>{label}</span>{children}</div>
}

function ReadOnly({ value }) {
  return <div style={{ ...field, background: COL.panel, fontWeight: 600 }}>{value}</div>
}

function Chips({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const on = o === value
        return (
          <button key={o} type="button" onClick={() => onChange(o)}
            style={{ padding: '7px 13px', borderRadius: 999, cursor: 'pointer', fontFamily: HG, fontSize: 12, fontWeight: 600, border: on ? `1px solid ${COL.gold}` : '1px solid #cdcdbe', background: on ? COL.gold : COL.white2, color: on ? COL.white : COL.ink, transition: 'background .12s ease, border-color .12s ease' }}>
            {o}
          </button>
        )
      })}
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...field, appearance: 'none', WebkitAppearance: 'none', paddingRight: 30, cursor: 'pointer' }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: COL.muted, fontSize: 11 }}>▾</span>
    </div>
  )
}

function Footer({ submitLabel, onCancel }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
      <button type="button" onClick={onCancel} style={{ flex: 1, padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: HG, fontSize: 13, fontWeight: 600, background: COL.panelStrong, color: COL.ink }}>Cancel</button>
      <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: HG, fontSize: 13, fontWeight: 600, background: COL.gold, color: COL.white }}>{submitLabel}</button>
    </div>
  )
}

function LogForm({ animal, onCancel, onSubmit }) {
  const [type, setType] = useState('Sighting')
  const [time, setTime] = useState('06:14')
  const [loc, setLoc] = useState('')
  const [notes, setNotes] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(`Observation logged · ${animal}`) }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Labeled label="Animal"><ReadOnly value={animal} /></Labeled>
      <Labeled label="Observation type"><Chips options={['Sighting', 'Behaviour', 'Health', 'Feeding', 'Movement']} value={type} onChange={setType} /></Labeled>
      <div style={{ display: 'flex', gap: 12 }}>
        <Labeled label="Time" style={{ flex: 1 }}><input style={field} value={time} onChange={(e) => setTime(e.target.value)} /></Labeled>
        <Labeled label="Location" style={{ flex: 1 }}><input style={field} value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Sector / coords" /></Labeled>
      </div>
      <Labeled label="Notes"><textarea style={{ ...field, resize: 'vertical', minHeight: 84 }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you observe?" /></Labeled>
      <Footer submitLabel="Log Observation" onCancel={onCancel} />
    </form>
  )
}

function VetForm({ animal, onCancel, onSubmit }) {
  const [vet, setVet] = useState('Dr. N. Pillay')
  const [priority, setPriority] = useState('Routine')
  const [date, setDate] = useState('18 Jun 2025')
  const [time, setTime] = useState('08:00')
  const [reason, setReason] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(`Vet scheduled · ${animal} · ${vet}`) }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Labeled label="Animal"><ReadOnly value={animal} /></Labeled>
      <Labeled label="Attending vet"><Select value={vet} onChange={setVet} options={['Dr. N. Pillay', 'Dr. S. Adams', 'On-call vet']} /></Labeled>
      <Labeled label="Priority"><Chips options={['Routine', 'Monitor', 'Urgent']} value={priority} onChange={setPriority} /></Labeled>
      <div style={{ display: 'flex', gap: 12 }}>
        <Labeled label="Date" style={{ flex: 1 }}><input style={field} value={date} onChange={(e) => setDate(e.target.value)} /></Labeled>
        <Labeled label="Time" style={{ flex: 1 }}><input style={field} value={time} onChange={(e) => setTime(e.target.value)} /></Labeled>
      </div>
      <Labeled label="Reason"><textarea style={{ ...field, resize: 'vertical', minHeight: 84 }} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for the visit…" /></Labeled>
      <Footer submitLabel="Schedule Visit" onCancel={onCancel} />
    </form>
  )
}

export default function ModalHost({ modal, onClose, onSubmit }) {
  useEffect(() => {
    if (!modal) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal, onClose])
  if (!modal) return null
  const isLog = modal.type === 'log'
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,30,26,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="proto-modal" onClick={(e) => e.stopPropagation()} style={{ width: 'min(440px, 94vw)', maxHeight: '90vh', overflowY: 'auto', background: COL.white2, borderRadius: 21, padding: 24, boxShadow: '0 24px 60px -20px rgba(0,0,0,0.55)', fontFamily: HG }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: COL.ink }}>{isLog ? 'Log Observation' : 'Schedule Vet Visit'}</h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: COL.muted }}>{modal.animal}</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: COL.muted, lineHeight: 1, padding: 0 }}>×</button>
        </div>
        {isLog
          ? <LogForm animal={modal.animal} onCancel={onClose} onSubmit={onSubmit} />
          : <VetForm animal={modal.animal} onCancel={onClose} onSubmit={onSubmit} />}
      </div>
    </div>
  )
}
