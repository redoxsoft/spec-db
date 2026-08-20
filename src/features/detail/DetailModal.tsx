import { useEffect, useState } from 'react'
import { Tag, X } from 'lucide-react'
import {
  fetchResourceDetail,
  getTagLabel,
  type ResourceDetail,
  type TagsRegistry,
} from '../../catalog'
import { cn } from '../../lib/cn'
import { GithubIcon } from '../../lib/icons'
import { getKindStyles } from '../../lib/kindStyles'
import { githubResourceUrl } from '../../lib/paths'
import { ImportButton } from './ImportButton'
import { PipelineOverview } from './PipelineOverview'
import { PreviewContent } from './PreviewContent'
import { ProseHtml } from './ProseHtml'
import { TaskDetailPanel } from './TaskDetailPanel'

type DetailModalProps = {
  slug: string | null
  tags: TagsRegistry
  onClose: () => void
}

export function DetailModal({ slug, tags, onClose }: DetailModalProps) {
  const [item, setItem] = useState<ResourceDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [taskKey, setTaskKey] = useState<string | null>(null)

  useEffect(() => {
    setTaskKey(null)
  }, [slug])

  useEffect(() => {
    if (!slug) {
      setItem(null)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void fetchResourceDetail(slug)
      .then((detail) => {
        if (!cancelled) setItem(detail)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setItem(null)
          setError(err instanceof Error ? err.message : String(err))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (!slug) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (taskKey) {
        setTaskKey(null)
        return
      }
      onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [slug, taskKey, onClose])

  if (!slug) return null

  const styles = item ? getKindStyles(item.kind) : null
  const KindIcon = styles?.icon
  const selectedTask =
    item?.tasks?.find((task) => task.key === taskKey) ?? null
  const isPipeline = item?.kind === 'pipeline'

  return (
    <div className="fixed inset-0 z-[100]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-200"
        aria-label="Close detail"
        onClick={() => {
          if (taskKey) setTaskKey(null)
          else onClose()
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
        className={cn(
          'detail-panel absolute flex flex-col overflow-hidden bg-white shadow-xl',
          'inset-0',
          'md:inset-y-0 md:left-auto md:right-0 md:w-full md:max-w-xl md:border-l md:border-ui-border lg:max-w-2xl',
        )}
      >
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          {loading || !item || !styles || !KindIcon ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              {error ? (
                <>
                  <p className="text-sm font-medium text-gray-900">
                    Could not load resource
                  </p>
                  <p className="max-w-sm text-sm text-gray-500">{error}</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 min-h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-500">Loading…</p>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-none items-start justify-between gap-3 border-b border-ui-border bg-gray-50/50 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-sm',
                      styles.bg,
                      styles.color,
                      styles.border,
                    )}
                  >
                    <KindIcon className="h-6 w-6" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
                          styles.badge,
                        )}
                      >
                        {styles.label}
                      </span>
                      <span className="flex min-w-0 items-center gap-1 text-xs text-gray-500">
                        <Tag className="h-3 w-3 shrink-0" aria-hidden />
                        <span className="break-words">
                          {item.tags
                            .map((tagId) => getTagLabel(tags, tagId))
                            .join(', ')}
                        </span>
                      </span>
                    </div>
                    <h2
                      id="detail-modal-title"
                      className="text-xl font-bold break-words text-gray-900"
                    >
                      {item.title}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                {item.summaryHtml ? (
                  <ProseHtml className="mb-6 text-gray-600" html={item.summaryHtml} />
                ) : (
                  <p className="mb-6 text-sm leading-relaxed text-gray-600">
                    {item.summary}
                  </p>
                )}
                {isPipeline ? (
                  <PipelineOverview item={item} onSelectTask={setTaskKey} />
                ) : (
                  <div className="relative rounded-xl border border-ui-border bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                      {item.kind === 'template' ? 'Outline' : 'Preview'}
                    </h3>
                    <div className="text-sm text-gray-700">
                      <PreviewContent item={item} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-none flex-col gap-3 border-t border-ui-border bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="text-xs text-gray-500">
                  Catalog Entry updated: {item.updatedAt}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <a
                    href={githubResourceUrl(item.kind, item.slug)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                  >
                    <GithubIcon className="h-4 w-4" aria-hidden />
                    View Source
                  </a>
                  <ImportButton
                    item={item}
                    importTarget={styles.importTarget}
                    onImported={onClose}
                  />
                </div>
              </div>

              {selectedTask ? (
                <TaskDetailPanel
                  pipelineTitle={item.title}
                  item={item}
                  task={selectedTask}
                  onBack={() => setTaskKey(null)}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
