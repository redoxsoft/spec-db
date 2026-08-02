/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** SpecX standalone import base URL (query: kind, slug). */
  readonly VITE_SPECX_IMPORT_BASE?: string
  /** WorkX standalone import base URL (query: kind, slug). */
  readonly VITE_WORKX_IMPORT_BASE?: string
  /** GitHub tree base for View Source (…/tree/main). */
  readonly VITE_GITHUB_TREE_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
