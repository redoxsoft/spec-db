export {
  collectionRegistryIssues,
  collectionsById,
  placementFor,
  resourceCollectionIssues,
  type CollectionLookup,
  type PackagePlacement,
} from './collections'

export {
  collectionDefinitionSchema,
  collectionsRegistrySchema,
  inputVarDefinitionSchema,
  metadataSchema,
  outlineCardinalitySchema,
  outlineNodeSchema,
  pipelineContentSchema,
  pipelineStepSchema,
  resourceKindSchema,
  schemaVersionSchema,
  tagDefinitionSchema,
  tagsRegistrySchema,
  templateContentSchema,
  type CollectionDefinition,
  type CollectionsRegistryFile,
  type OutlineCardinality,
  type OutlineNode,
  type PipelineContent,
  type ResourceKind,
  type ResourceMetadata,
  type TagDefinition,
  type TagsRegistryFile,
  type TemplateContent,
} from './schemas'

export {
  collectOutlineInvariantIssues,
  findDuplicateOutlineKey,
  MAX_OUTLINE_DEPTH,
  type OutlineInvariantCode,
  type OutlineInvariantIssue,
} from './outline'

export {
  importPackageSchema,
  packageBlockSchema,
  packageCalloutToneSchema,
  packageOutlineNodeSchema,
  packageSectionSchema,
  packageVersionSchema,
  pipelinePackageSchema,
  pipelinePackageStepSchema,
  specPackageSchema,
  templatePackageSchema,
  type ImportPackage,
  type PackageBlock,
  type PackageCalloutTone,
  type PackageOutlineNode,
  type PackageSection,
  type PackageVersion,
  type PipelinePackage,
  type SpecPackage,
  type TemplatePackage,
} from './packageSchemas'

export {
  buildPipelinePackage,
  buildSpecPackage,
  buildTemplatePackage,
  loadImportPackage,
  toPackageEnvelope,
  loadPipelinePackage,
  loadSpecPackage,
  loadTemplatePackage,
  toPackageOutline,
  type PackageBuildWarnings,
  type PackageEnvelopeSource,
} from './buildPackage'

export {
  markdownToSpecSections,
  MAX_SPEC_SECTION_DEPTH,
  type MarkdownToSpecResult,
} from './markdownToSpecPackage'

export {
  checkPipelineVarCoverage,
  type PipelineVarIssue,
} from './pipelineVars'

export {
  compileMarkdownToHtml,
  extractMarkdownStructure,
  markdownContainsMedia,
  type MarkdownStructure,
} from './markdown'
