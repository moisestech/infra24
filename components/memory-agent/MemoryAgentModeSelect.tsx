'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'
import type { MemoryAgentMode } from '@/types/memory-agent'

type MemoryAgentModeSelectProps = {
  value: MemoryAgentMode
  onChange: (mode: MemoryAgentMode) => void
  disabled?: boolean
}

export function MemoryAgentModeSelect({
  value,
  onChange,
  disabled,
}: MemoryAgentModeSelectProps) {
  return (
    <div className="flex flex-col gap-2 md:items-end">
      <Label className={ma.label}>Mode</Label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as MemoryAgentMode)}
        disabled={disabled}
      >
        <SelectTrigger className={cn(ma.selectTrigger, 'w-[200px]')}>
          <SelectValue placeholder="Select mode" />
        </SelectTrigger>
        <SelectContent className={ma.selectContent}>
          <SelectItem value="staff_operator" className={ma.selectItem}>
            Staff / operator
          </SelectItem>
          <SelectItem value="public" className={ma.selectItem}>
            Public preview
          </SelectItem>
        </SelectContent>
      </Select>
      <span className={cn('max-w-[200px] text-xs leading-snug', ma.caption)}>
        {value === 'public'
          ? 'Visitor kiosk: public answer only.'
          : 'Operator tools: staff briefs, leadership, signage, saves.'}
      </span>
    </div>
  )
}
