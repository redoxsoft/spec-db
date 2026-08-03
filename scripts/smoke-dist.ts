/**
 * Post-build smoke: ensure ship artifacts exist under dist/.
 * Usage: tsx scripts/smoke-dist.ts
 */
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')

const REQUIRED_FILES = [
  'index.html',
  'host-mock.html',
  '_headers',
  '_redirects',
  'generated/catalog-lite.json',
  'generated/tags.json',
  'pagefind/pagefind.js',
  'pagefind/pagefind-entry.json',
]

async function main() {
  const missing: string[] = []

  for (const rel of REQUIRED_FILES) {
    try {
      await access(path.join(DIST, rel))
    } catch {
      missing.push(rel)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `smoke-dist: missing under dist/:\n  - ${missing.join('\n  - ')}\nRun npm run build first.`,
    )
  }

  const headers = await readFile(path.join(DIST, '_headers'), 'utf8')
  if (!headers.includes('frame-ancestors')) {
    throw new Error('smoke-dist: dist/_headers missing frame-ancestors CSP')
  }

  const lite = JSON.parse(
    await readFile(path.join(DIST, 'generated/catalog-lite.json'), 'utf8'),
  ) as unknown
  if (!Array.isArray(lite) || lite.length === 0) {
    throw new Error('smoke-dist: catalog-lite.json empty or invalid')
  }

  const packageSamples = [
    'generated/packages/template/feature-spec-lite.json',
    'generated/packages/pipeline/project-discovery.json',
    'generated/packages/spec/discovery-rules.json',
  ]
  for (const rel of packageSamples) {
    const raw = await readFile(path.join(DIST, rel), 'utf8')
    const pkg = JSON.parse(raw) as { packageVersion?: string; kind?: string }
    if (pkg.packageVersion !== '1') {
      throw new Error(`smoke-dist: ${rel} missing packageVersion "1"`)
    }
  }

  console.log(
    `smoke-dist: ok (${REQUIRED_FILES.length} paths, ${lite.length} catalog items, ${packageSamples.length} package samples)`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
