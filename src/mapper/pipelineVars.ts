import {
  extractInputVarKeysFromText,
  filterDiscoverableInputVarKeys,
  isImpliedSystemInputVarKey,
} from '../lib/inputVars'
import type { PipelineContent } from './schemas'

export type PipelineVarIssue = {
  code:
    | 'undefined-var'
    | 'orphan-definition'
    | 'undefined-iterator-field'
    | 'iterator-not-referenced'
  message: string
}

/**
 * Enforce Spec DB `${var}` ↔ `inputVarDefinitions` rules (stricter than WorkX).
 * Implied system keys are excluded from coverage (see `lib/inputVars`).
 */
export function checkPipelineVarCoverage(
  content: PipelineContent,
  taskBodies: Record<string, string>,
): PipelineVarIssue[] {
  const issues: PipelineVarIssue[] = []
  const defined = new Set(
    content.inputVarDefinitions.map((definition) => definition.key),
  )

  const referenced = new Set<string>()
  for (const [taskKey, body] of Object.entries(taskBodies)) {
    for (const key of filterDiscoverableInputVarKeys(
      extractInputVarKeysFromText(body),
    )) {
      referenced.add(key)
      if (!defined.has(key)) {
        issues.push({
          code: 'undefined-var',
          message: `tasks/${taskKey}.md uses \${${key}} but it is missing from inputVarDefinitions`,
        })
      }
    }
  }

  for (const definition of content.inputVarDefinitions) {
    if (isImpliedSystemInputVarKey(definition.key)) {
      issues.push({
        code: 'orphan-definition',
        message: `inputVarDefinitions includes implied system key "${definition.key}" (not catalog-documentable)`,
      })
      continue
    }
    if (!referenced.has(definition.key)) {
      issues.push({
        code: 'orphan-definition',
        message: `inputVarDefinitions key "${definition.key}" is never referenced in tasks/*.md`,
      })
    }
  }

  const iteratorKeys = new Set<string>([
    ...(content.iteratorFields ?? []),
    ...content.steps.flatMap((step) => step.iteratorFields ?? []),
  ])

  for (const key of iteratorKeys) {
    if (isImpliedSystemInputVarKey(key)) {
      issues.push({
        code: 'undefined-iterator-field',
        message: `iteratorFields key "${key}" is an implied system key and cannot be used for fan-out documentation`,
      })
      continue
    }
    if (!defined.has(key)) {
      issues.push({
        code: 'undefined-iterator-field',
        message: `iteratorFields key "${key}" is missing from inputVarDefinitions`,
      })
    } else if (!referenced.has(key)) {
      issues.push({
        code: 'iterator-not-referenced',
        message: `iteratorFields key "${key}" must also be referenced from tasks/*.md`,
      })
    }
  }

  return issues
}
