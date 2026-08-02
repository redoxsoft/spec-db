/**
 * Emit JSON Schema for external Spec DB shapes (non-TS contributors).
 * Usage: npm run schema:json
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import {
  importPackageSchema,
  pipelinePackageSchema,
  specPackageSchema,
  templatePackageSchema,
} from '../src/mapper/packageSchemas.ts'
import {
  metadataSchema,
  pipelineContentSchema,
  tagsRegistrySchema,
  templateContentSchema,
} from '../src/mapper/schemas.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'schemas')

const targets: { name: string; schema: z.ZodType }[] = [
  { name: 'metadata', schema: metadataSchema },
  { name: 'tags-registry', schema: tagsRegistrySchema },
  { name: 'template-content', schema: templateContentSchema },
  { name: 'pipeline-content', schema: pipelineContentSchema },
  { name: 'import-package', schema: importPackageSchema },
  { name: 'template-package', schema: templatePackageSchema },
  { name: 'pipeline-package', schema: pipelinePackageSchema },
  { name: 'spec-package', schema: specPackageSchema },
]

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  for (const { name, schema } of targets) {
    const json = z.toJSONSchema(schema)
    const filePath = path.join(OUT_DIR, `${name}.schema.json`)
    await writeFile(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8')
    console.log(`wrote ${path.relative(ROOT, filePath)}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
