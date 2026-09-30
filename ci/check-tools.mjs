// Runs at the start of every build (npm run build), including Vercel deploys.
// Stops a tool HTML upload from going live if it would leak the Tool 5
// dataset or skip the login check on PDF downloads. See TOOL_UPDATES.md.
import { readdirSync, readFileSync } from 'fs'

const DIR = process.argv[2] || 'public/tools'
const problems = []

for (const file of readdirSync(DIR).filter(f => f.endsWith('.html'))) {
  const html = readFileSync(`${DIR}/${file}`, 'utf8')

  // The actuator dataset must only come from the API, never be embedded
  const torqueArrays = (html.match(/"?(da|springs)"?\s*:\s*\[\s*[[{]/g) || []).length
  if (torqueArrays > 5) {
    problems.push(`${file}: contains the actuator dataset (${torqueArrays} torque tables). ` +
      'Tool 5 data must stay in Supabase. Do not upload the original Tool 5 file.')
  }

  if (/Download PDF/i.test(html) && !html.includes('cx8RequireLogin(')) {
    problems.push(`${file}: has a Download PDF button without the login check (cx8RequireLogin).`)
  }
}

if (problems.length) {
  console.error('\nTool file check failed — this deploy was stopped:\n')
  for (const p of problems) console.error(`  ✗ ${p}`)
  console.error('\nSee TOOL_UPDATES.md for how to update tool files safely.\n')
  process.exit(1)
}
console.log('Tool file check passed.')
