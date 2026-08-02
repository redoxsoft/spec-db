import { cn } from '../../lib/cn'

type ProseHtmlProps = {
  html: string
  className?: string
}

/** Renders build-time sanitized HTML with typography styles. */
export function ProseHtml({ html, className }: ProseHtmlProps) {
  return (
    <div
      className={cn('prose prose-sm max-w-none text-gray-700', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
