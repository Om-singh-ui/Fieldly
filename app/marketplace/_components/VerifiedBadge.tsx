// app/(marketplace)/_components/VerifiedBadge.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'  // Fixed: tooltip, not toolpit

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  tooltipText?: string
  className?: string
}

export function VerifiedBadge({
  size = 'md',
  showTooltip = true,
  tooltipText = 'Verified landowner',
  className
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] h-5 px-1',
    md: 'text-xs h-6 px-2',
    lg: 'text-sm h-7 px-3'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
  }

  const badge = (
    <Badge
      variant="outline"
      className={cn(
        'border-green-500 text-green-600 dark:text-green-400 gap-1',
        sizeClasses[size],
        className
      )}
    >
      <CheckCircle className={cn('fill-green-500 stroke-white dark:stroke-black', iconSizes[size])} />
      Verified
    </Badge>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return badge
}