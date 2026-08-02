import { Repeat } from 'lucide-react'
import { cn } from '../../lib/cn'
import { formatInputVarPlaceholder } from '../../lib/inputVars'
import type { InputVarDefinition } from '../../catalog'

export type InputVarDisplay = InputVarDefinition & {
  /** Present in pipeline-level iteratorFields (full-run fan-out). */
  pipelineIterable?: boolean
  /** Present in step-level iteratorFields (step fan-out). */
  stepIterable?: boolean
}

type InputVarListProps = {
  vars: InputVarDisplay[]
  emptyMessage: string
  /** When true, show step-fan-out badge; pipeline badge always when flagged. */
  showStepIterable?: boolean
}

function IterableBadge({
  label,
  tone,
}: {
  label: string
  tone: 'pipeline' | 'step'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
        tone === 'pipeline'
          ? 'bg-violet-50 text-violet-700'
          : 'bg-emerald-50 text-emerald-700',
      )}
    >
      <Repeat className="h-3 w-3" aria-hidden />
      {label}
    </span>
  )
}

export function InputVarList({
  vars,
  emptyMessage,
  showStepIterable = false,
}: InputVarListProps) {
  if (vars.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-ui-border bg-gray-50 px-4 py-3 text-sm text-gray-500">
        {emptyMessage}
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {vars.map((input) => (
        <li
          key={input.key}
          className={cn(
            'rounded-xl border border-ui-border bg-white px-4 py-3',
            (input.pipelineIterable || input.stepIterable) &&
              'border-violet-100 bg-violet-50/30',
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <code className="text-sm font-semibold text-gray-900">
              {formatInputVarPlaceholder(input.key)}
            </code>
            {input.pipelineIterable ? (
              <IterableBadge label="Pipeline fan-out" tone="pipeline" />
            ) : null}
            {showStepIterable && input.stepIterable ? (
              <IterableBadge label="Step fan-out" tone="step" />
            ) : null}
          </div>
          {input.description ? (
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {input.description}
            </p>
          ) : null}
          {input.suggestedDefault ? (
            <p className="mt-2 text-xs text-gray-400">
              Suggested default:{' '}
              <span className="font-medium text-gray-600">
                {input.suggestedDefault}
              </span>
            </p>
          ) : null}
          {input.pipelineIterable ? (
            <p className="mt-2 text-xs text-violet-700/80">
              Expects an array at run time — host creates a separate full
              pipeline run per value.
            </p>
          ) : null}
          {showStepIterable && input.stepIterable ? (
            <p className="mt-2 text-xs text-emerald-700/80">
              This step runs once per array item (multi-key selections are
              zipped by index).
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
