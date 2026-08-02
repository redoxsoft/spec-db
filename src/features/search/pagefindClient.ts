import type { ResourceKind } from '../../catalog'

export type PagefindHit = {
  slug: string
  kind: ResourceKind
}

type PagefindResultData = {
  meta?: Record<string, string>
  url?: string
}

type PagefindSearchResult = {
  data: () => Promise<PagefindResultData>
}

type PagefindSearchResponse = {
  results: PagefindSearchResult[]
}

type PagefindModule = {
  init?: () => Promise<void>
  preload?: (query: string) => Promise<unknown>
  search: (query: string) => Promise<PagefindSearchResponse>
}

let loading: Promise<PagefindModule> | null = null
let api: PagefindModule | null = null

function slugFromUrl(url: string | undefined): string | null {
  if (!url) return null
  const match = /\/([^/]+)\.html(?:[?#]|$)/.exec(url)
  return match?.[1] ?? null
}

/**
 * Load Pagefind from /public without a source `import()` — Vite rejects
 * importing files that live under public/.
 */
function importPagefindBundle(): Promise<PagefindModule> {
  return new Promise((resolve, reject) => {
    const marker = '__specDbPagefind'
    const done = 'spec-db:pagefind-ready'
    const failed = 'spec-db:pagefind-error'

    function onReady() {
      cleanup()
      const mod = (window as unknown as Record<string, PagefindModule | undefined>)[
        marker
      ]
      if (!mod?.search) {
        reject(new Error('Pagefind loaded without a search() export'))
        return
      }
      resolve(mod)
    }

    function onError(event: Event) {
      cleanup()
      const detail = (event as CustomEvent<unknown>).detail
      reject(
        detail instanceof Error
          ? detail
          : new Error('Failed to load /pagefind/pagefind.js'),
      )
    }

    function cleanup() {
      window.removeEventListener(done, onReady)
      window.removeEventListener(failed, onError)
    }

    window.addEventListener(done, onReady, { once: true })
    window.addEventListener(failed, onError, { once: true })

    const script = document.createElement('script')
    script.type = 'module'
    script.textContent = `
      try {
        const pagefind = await import('/pagefind/pagefind.js');
        window[${JSON.stringify(marker)}] = pagefind;
        window.dispatchEvent(new Event(${JSON.stringify(done)}));
      } catch (error) {
        window.dispatchEvent(new CustomEvent(${JSON.stringify(failed)}, { detail: error }));
      }
    `
    document.head.appendChild(script)
  })
}

/** Lazy-load the Pagefind browser bundle (call on search focus). */
export function ensurePagefind(): Promise<PagefindModule> {
  if (api) return Promise.resolve(api)
  if (loading) return loading

  loading = importPagefindBundle()
    .then(async (pagefind) => {
      await pagefind.init?.()
      api = pagefind
      return pagefind
    })
    .catch((error) => {
      loading = null
      throw error
    })

  return loading
}

export async function searchPagefind(query: string): Promise<PagefindHit[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const pagefind = await ensurePagefind()
  const response = await pagefind.search(trimmed)
  const hits: PagefindHit[] = []

  for (const result of response.results) {
    const data = await result.data()
    const slug = data.meta?.slug ?? slugFromUrl(data.url)
    const kind = data.meta?.kind as ResourceKind | undefined
    if (!slug || !kind) continue
    if (kind !== 'spec' && kind !== 'template' && kind !== 'pipeline') continue
    hits.push({ slug, kind })
  }

  return hits
}
