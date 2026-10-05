// Calcula el contraste (WCAG) entre pares de colores. Uso: node scripts/contrast.mjs
const lum = (hex) => {
  const [r, g, b] = hex.match(/\w\w/g).map((h) => parseInt(h, 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }
const pairs = process.argv.slice(2).length ? [['', ...process.argv.slice(2)]] : [
  ['normal: ink / bg', '#1C2629', '#FBF7EE'],
  ['normal: ink-soft / bg', '#45524F', '#FBF7EE'],
  ['normal: ink-soft / surface', '#45524F', '#FFFFFF'],
  ['normal: primary / surface', '#1D5C46', '#FFFFFF'],
  ['normal: on-primary / primary', '#FFFFFF', '#1D5C46'],
  ['normal: primary / primary-soft', '#1D5C46', '#E3F0E8'],
  ['normal: ink / accent', '#1C2629', '#F2C14E'],
  ['normal: ink / accent-soft', '#1C2629', '#FCEFC7'],
  ['normal: danger / surface', '#9B2C1F', '#FFFFFF'],
  ['normal: border / surface (UI 3:1)', '#6E7A76', '#FFFFFF'],
  ['normal: focus / bg', '#1747A6', '#FBF7EE'],
  ['normal: ink / blue-soft', '#1C2629', '#E1ECF8'],
  ['normal: ink / rose-soft', '#1C2629', '#F8E4E1'],
  ['high: ink / bg', '#000000', '#FFFFFF'],
  ['high: primary / surface', '#0A3D2B', '#FFFFFF'],
  ['high: on-primary / primary', '#FFFFFF', '#0A3D2B'],
  ['high: ink-soft / bg', '#1F1F1F', '#FFFFFF'],
  ['high: danger / surface', '#7A1A10', '#FFFFFF'],
  ['high: ink / accent', '#000000', '#FFD54A'],
]
for (const [name, a, b] of pairs) console.log(`${ratio(a, b).toFixed(2).padStart(6)}  ${name ?? ''} ${a} ${b}`)
