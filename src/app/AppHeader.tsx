import { Link } from 'react-router-dom'
import { GithubIcon } from '../lib/icons'
import { githubRepoUrl, githubTreePath } from '../lib/paths'

export function AppHeader() {
  const whitepaperUrl = githubTreePath('docs/ai-native-sdlc-whitepaper.md')
  const docsUrl = githubTreePath('docs')
  const contributeUrl = githubTreePath('CONTRIBUTING.md')
  const repoUrl = githubRepoUrl()

  return (
    <header className="flex-none border-b border-ui-border bg-white transition-all duration-300 origin-top">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold tracking-tight text-white"
            aria-label="Spec DB home"
          >
            DB
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Link to="/" className="font-semibold text-gray-900">
              Spec DB
            </Link>
            <span className="text-gray-400">/</span>
            <span className="rounded-md bg-brand-50 px-2 py-1 text-xs text-brand-700">
              Catalog
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-500 md:flex">
            <a
              href={whitepaperUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-gray-900"
            >
              Whitepaper
            </a>
            <a
              href={docsUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-gray-900"
            >
              Documentation
            </a>
            <a
              href={contributeUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-gray-900"
            >
              Contribute
            </a>
          </nav>
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 w-11 items-center justify-center text-gray-400 transition-colors hover:text-gray-900"
            aria-label="GitHub"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  )
}
