import { ArrowLeft, Variable } from 'lucide-react'
import {
  extractInputVarKeysFromText,
  filterDiscoverableInputVarKeys,
} from '../../lib/inputVars'
import type {
  CatalogItem,
  InputVarDefinition,
  PipelineTask,
} from '../../catalog'
import { InputVarList, type InputVarDisplay } from './InputVarList'
import { ProseHtml } from './ProseHtml'

type TaskDetailPanelProps = {
  pipelineTitle: string
  item: CatalogItem
  task: PipelineTask
  onBack: () => void
}

function defsByKey(
  defs: InputVarDefinition[] | undefined,
): Map<string, InputVarDefinition> {
  const map = new Map<string, InputVarDefinition>()
  for (const def of defs ?? []) map.set(def.key, def)
  return map
}

function taskInputDisplays(
  item: CatalogItem,
  task: PipelineTask,
): InputVarDisplay[] {
  const keys = filterDiscoverableInputVarKeys(
    extractInputVarKeysFromText(task.prompt),
  )
  const definitions = defsByKey(item.inputVarDefinitions)
  const pipelineIterable = new Set(item.iteratorFields ?? [])
  const stepIterable = new Set(task.iteratorFields ?? [])

  return keys.map((key) => {
    const def = definitions.get(key)
    return {
      key,
      description: def?.description,
      suggestedDefault: def?.suggestedDefault,
      pipelineIterable: pipelineIterable.has(key),
      stepIterable: stepIterable.has(key),
    }
  })
}

/** Nested layer for a single pipeline task prompt + task-scoped variables. */
export function TaskDetailPanel({
  pipelineTitle,
  item,
  task,
  onBack,
}: TaskDetailPanelProps) {
  const taskVars = taskInputDisplays(item, task)

  return (
    <div
      className="detail-panel absolute inset-0 z-10 flex flex-col overflow-hidden bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-title"
    >
      <div className="flex flex-none items-start gap-2 border-b border-ui-border bg-gray-50/50 px-3 py-3 sm:px-5">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          aria-label="Back to pipeline"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 pt-2">
          <nav
            className="mb-1 flex flex-wrap items-center gap-1 text-xs text-gray-500"
            aria-label="Breadcrumb"
          >
            <button
              type="button"
              onClick={onBack}
              className="truncate font-medium text-brand-700 hover:underline"
            >
              {pipelineTitle}
            </button>
            <span aria-hidden>/</span>
            <span className="truncate text-gray-700">{task.name}</span>
          </nav>
          <h2
            id="task-detail-title"
            className="text-lg font-bold break-words text-gray-900"
          >
            {task.name}
          </h2>
          {(task.iteratorFields?.length ?? 0) > 0 ? (
            <p className="mt-1 text-xs text-emerald-700">
              Iterates over: {task.iteratorFields!.join(', ')}
            </p>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
        <section className="rounded-xl border border-ui-border bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Instructions
          </h3>
          {task.previewHtml ? (
            <ProseHtml html={task.previewHtml} />
          ) : (
            <p className="text-sm text-gray-400 italic">No preview available.</p>
          )}
        </section>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
            <Variable className="h-3.5 w-3.5" aria-hidden />
            Variables in this task
          </h3>
          <InputVarList
            vars={taskVars}
            showStepIterable
            emptyMessage="No discoverable input placeholders in this task’s instructions."
          />
        </section>
      </div>
    </div>
  )
}
