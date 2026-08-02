/** Implied system keys resolved by hosts — not caller-supplied catalog inputs. */
export const IMPLIED_SYSTEM_INPUT_VAR_KEYS = [
  'WORKSPACE.TITLE',
  'WORKSPACE.DESCRIPTION',
  'WORKER.INSTRUCTIONS',
  'SPEC.DOCUMENT_TITLE',
  'SPEC.DOCUMENT_VERSION',
  'SPEC.TARGET_TITLE',
  'SPEC.TARGET_SUMMARY',
  'SPEC.CONTEXT_MARKDOWN',
  'SPEC.CONTEXT_JSON',
] as const

const IMPLIED_SYSTEM_INPUT_VAR_KEY_SET = new Set<string>(
  IMPLIED_SYSTEM_INPUT_VAR_KEYS,
)

const INPUT_VAR_PATTERN = /\$\{([^}]+)\}/g

export function isImpliedSystemInputVarKey(key: string): boolean {
  return IMPLIED_SYSTEM_INPUT_VAR_KEY_SET.has(key)
}

/** Extract `${var}` keys from task/prompt text (M9 may switch to AST-aware extraction). */
export function extractInputVarKeysFromText(text: string): string[] {
  if (!text) return []

  const keys: string[] = []
  const pattern = new RegExp(INPUT_VAR_PATTERN)
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    const key = match[1]?.trim()
    if (key) keys.push(key)
  }

  return keys
}

export function filterDiscoverableInputVarKeys(keys: string[]): string[] {
  const unique = new Set<string>()
  for (const key of keys) {
    if (!isImpliedSystemInputVarKey(key)) unique.add(key)
  }
  return Array.from(unique).sort()
}

export function formatInputVarPlaceholder(key: string): string {
  return `\${${key}}`
}
