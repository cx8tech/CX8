// Tool 5 equivalent matching, run on the server so the browser never needs
// the full actuator dataset. Mirrors the original logic in tool5.html.

function interp(pairs, p) {
  if (!pairs || !pairs.length) return null
  const s = pairs.filter(x => x[1] > 0).sort((a, b) => a[0] - b[0])
  if (!s.length) return null
  if (p <= s[0][0]) return s[0][1]
  if (p >= s[s.length - 1][0]) return s[s.length - 1][1]
  for (let i = 0; i < s.length - 1; i++) {
    if (s[i][0] <= p && p <= s[i + 1][0]) {
      const r = (p - s[i][0]) / (s[i + 1][0] - s[i][0])
      return Math.round((s[i][1] + r * (s[i + 1][1] - s[i][1])) * 10) / 10
    }
  }
  return null
}

// Spring row: exact SC = P*2, else highest SC <= target, else lowest SC
function getSpringRow(rec, p) {
  if (!rec.springs || !rec.springs.length) return null
  const target = Math.round(p * 2)
  const exact = rec.springs.find(sp => sp.hsc === target)
  if (exact) return exact
  const below = rec.springs.filter(sp => sp.hsc <= target)
  if (below.length) return below.reduce((a, b) => (b.hsc > a.hsc ? b : a))
  return rec.springs.reduce((a, b) => (b.hsc < a.hsc ? b : a))
}

// Sizing reference: DA = air torque at P, SA = spring 0° at the best spring row
export function getRefTorque(rec, p) {
  if (rec.mode === 'DA') return interp(rec.da, p)
  const sp = getSpringRow(rec, p)
  return sp && sp.s0 ? sp.s0 : null
}

// Best same-type equivalent, preferring models at or above the reference torque
export function findBestEquivalent(rec, p, brands, db) {
  const refT = getRefTorque(rec, p)
  if (!refT) return null
  let pool = db.filter(r => !(r.b === rec.b && r.m === rec.m && r.mode === rec.mode) && r.mode === rec.mode)
  if (brands.length) pool = pool.filter(r => brands.includes(r.b))
  let best = null
  for (const r of pool) {
    const t = getRefTorque(r, p)
    if (!t || t <= 0) continue
    const diff = Math.abs(t - refT) / refT
    const score = t >= refT ? diff : diff + 0.5
    if (!best || score < best.score) best = { rec: r, refT: t, diff, score }
  }
  return best ? { rec: best.rec, refT: best.refT, diff: best.diff } : null
}
