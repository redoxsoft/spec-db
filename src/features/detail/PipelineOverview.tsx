import { ChevronRight, Variable } from 'lucide-react'
import type { CatalogItem, PipelineTask } from '../../catalog'
import { InputVarList, type InputVarDisplay } from './InputVarList'

type PipelineOverviewProps = {
  item: CatalogItem
  onSelectTask: (taskKey: string) => void
}

function TaskStepList({
  tasks,
  onSelectTask,
}: {
  tasks: PipelineTask[]
  onSelectTask: (taskKey: string) => void
}) {
  return (
    <ol className="divide-y divide-ui-border rounded-xl border border-ui-border bg-white">
      {tasks.map((task, index) => {
        const iterates = task.iteratorFields ?? []
        return (
          <li key={task.key}>
            <button
              type="button"
              onClick={() => onSelectTask(task.key)}
              className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-gray-900">
                  {task.name}
                </span>
                {iterates.length > 0 ? (
                  <span className="mt-0.5 block text-xs text-emerald-700">
                    Iterates over: {iterates.join(', ')}
                  </span>
                ) : null}
              </span>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-gray-400"
                aria-hidden
              />
            </button>
          </li>
        )
      })}
    </ol>
  )
}

function toPipelineInputDisplays(item: CatalogItem): InputVarDisplay[] {
  const pipelineIterable = new Set(item.iteratorFields ?? [])
  return (item.inputVarDefinitions ?? []).map((def) => ({
    ...def,
    pipelineIterable: pipelineIterable.has(def.key),
  }))
}

/** Pipeline overview: steps + readonly inputs (WorkX-aligned metadata). */
export function PipelineOverview({
  item,
  onSelectTask,
}: PipelineOverviewProps) {
  const tasks = item.tasks ?? []
  const inputs = toPipelineInputDisplays(item)

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
          Steps
        </h3>
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No tasks defined.</p>
        ) : (
          <TaskStepList tasks={tasks} onSelectTask={onSelectTask} />
        )}
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
          <Variable className="h-3.5 w-3.5" aria-hidden />
          Inputs
        </h3>
        <p className="mb-3 text-xs leading-relaxed text-gray-500">
          Caller-supplied variables documented for this pipeline. Pipeline
          fan-out keys create separate full runs; step fan-out is shown on each
          step.
        </p>
        <InputVarList
          vars={inputs}
          emptyMessage="No caller-supplied input variables documented for this pipeline."
        />
      </section>
    </div>
  )
}
