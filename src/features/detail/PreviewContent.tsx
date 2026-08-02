import type { CatalogItem, OutlineSection } from '../../catalog'
import { ProseHtml } from './ProseHtml'

function TemplatePreview({ item }: { item: CatalogItem }) {
  const sections: OutlineSection[] =
    item.sections ??
    item.outline?.map((title) => ({ title, guidance: '' })) ??
    []

  return (
    <div className="space-y-6">
      {item.templateGuidanceHtml ? (
        <ProseHtml html={item.templateGuidanceHtml} />
      ) : null}
      <ol className="space-y-5">
        {sections.map((section, index) => (
          <li key={`${section.title}-${index}`} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
              {index + 1}
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-gray-900">
                {section.title}
              </h4>
              {section.guidanceHtml ? (
                <ProseHtml className="mt-1" html={section.guidanceHtml} />
              ) : section.guidance ? (
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {section.guidance}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Non-pipeline preview bodies (pipelines use PipelineOverview + TaskDetailPanel). */
export function PreviewContent({ item }: { item: CatalogItem }) {
  if (item.kind === 'template') {
    return <TemplatePreview item={item} />
  }

  if (item.previewHtml) {
    return <ProseHtml html={item.previewHtml} />
  }

  return <p className="text-gray-400 italic">No preview available.</p>
}
