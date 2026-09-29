import type { Tag } from '../../catalog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/Select'

/** Radix Select disallows an empty item value; map "All" through this sentinel. */
const ALL_VALUE = '__all__'

type LibraryTagDropdownsProps = {
  domain: Tag[]
  usecase: Tag[]
  selected: readonly string[]
  onSetGroupTag: (groupTagIds: readonly string[], tagId: string | null) => void
}

function selectedInGroup(
  selected: readonly string[],
  options: readonly Tag[],
): string {
  return selected.find((id) => options.some((tag) => tag.id === id)) ?? ALL_VALUE
}

function TagDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly Tag[]
  value: string
  onChange: (tagId: string | null) => void
}) {
  if (options.length === 0) return null

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      <Select
        value={value}
        onValueChange={(next) =>
          onChange(next === ALL_VALUE ? null : next)
        }
      >
        <SelectTrigger aria-label={label}>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All</SelectItem>
          {options.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              {tag.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/** Domain and Use Case apply only on the Library page. */
export function LibraryTagDropdowns({
  domain,
  usecase,
  selected,
  onSetGroupTag,
}: LibraryTagDropdownsProps) {
  return (
    <div className="mt-4 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
      <TagDropdown
        label="Domain"
        options={domain}
        value={selectedInGroup(selected, domain)}
        onChange={(tagId) =>
          onSetGroupTag(
            domain.map((tag) => tag.id),
            tagId,
          )
        }
      />
      <TagDropdown
        label="Use Case"
        options={usecase}
        value={selectedInGroup(selected, usecase)}
        onChange={(tagId) =>
          onSetGroupTag(
            usecase.map((tag) => tag.id),
            tagId,
          )
        }
      />
    </div>
  )
}
