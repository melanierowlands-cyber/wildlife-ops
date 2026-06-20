import { useState, useEffect } from 'react'

/* Mziki prototype — shared design tokens & helpers */
export const COL = {
  canvas: '#004b42', topbar: '#05907f', stat: '#02695d', panel: '#e4e4d5',
  panelStrong: '#cacabb', white2: '#fbfaf6', inset: '#f4f1ea', insetEdge: '#edeadf',
  gold: '#d29b00', healthy: '#5a8021', monitor: '#d29b00', critical: '#b0492f',
  white: '#ffffff', ink: '#004b42', muted: '#828174', label: '#52524d', search: '#068071',
  faint: '#a8a294',
}
export const A = '/proto/ov'
export const REDUCED = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Responsive tiers:
   phone   (<760px)        → single-column fluid layout
   tablet  (760–1199px)    → multi-column fluid layout (iPads)
   desktop (≥1200px)       → pixel-faithful 1280×832 artboard */
export const TABLET_MAX = 1200
export const PHONE_MAX = 760
export function useViewportMode() {
  const get = () => {
    if (typeof window === 'undefined') return 'desktop'
    const w = window.innerWidth
    return w < PHONE_MAX ? 'phone' : w < TABLET_MAX ? 'tablet' : 'desktop'
  }
  const [mode, setMode] = useState(get)
  useEffect(() => {
    const on = () => setMode(get())
    on()
    window.addEventListener('resize', on)
    window.addEventListener('orientationchange', on)
    return () => {
      window.removeEventListener('resize', on)
      window.removeEventListener('orientationchange', on)
    }
  }, [])
  return mode
}

/* shared mobile UI tokens */
export const HG = '"Hanken Grotesk", sans-serif'
export const mCard = { background: COL.panel, borderRadius: 18, boxSizing: 'border-box' }
export const mSection = { fontSize: 11, fontWeight: 300, letterSpacing: '1.1px', color: COL.label, textTransform: 'uppercase' }

function fmt(n, decimals, grouped) {
  const fixed = decimals > 0 ? n.toFixed(decimals) : String(Math.round(n))
  if (!grouped) return fixed
  const [i, d] = fixed.split('.')
  return d != null ? `${Number(i).toLocaleString('en-US')}.${d}` : Number(i).toLocaleString('en-US')
}

export function AnimatedValue({ value, duration = 850 }) {
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

/* absolute-position text helper */
export const text = (left, top, opts = {}) => ({
  position: 'absolute', left, top, margin: 0, lineHeight: 'normal',
  fontFamily: '"Hanken Grotesk", sans-serif', whiteSpace: opts.wrap ? 'normal' : 'nowrap', ...opts,
})

/* per-animal photo set (Wild Dog has no photo → colored avatar) */
export const PHOTOS = {
  lion: `${A}/lion.jpg`, cheetah: `${A}/cheetah.jpg`, elephant: `${A}/elephant.png`,
  buffalo: `${A}/buffalo.jpg`, rhino: `${A}/rhino.jpg`, wilddog: null,
}
export const statusColor = (s) => (s === 'critical' ? COL.critical : s === 'monitor' ? COL.monitor : COL.healthy)
