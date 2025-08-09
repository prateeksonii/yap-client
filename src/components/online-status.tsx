import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'

interface OnlineStatusProps {
  isOnline?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function OnlineStatus({ 
  isOnline = false, 
  size = 'md', 
  showLabel = false,
  className 
}: OnlineStatusProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const statusText = isOnline ? 'Online' : 'Away'
  const statusColor = isOnline ? 'bg-green-400' : 'bg-gray-400'

  if (showLabel) {
    return (
      <Badge variant="outline" className={cn('flex items-center gap-1.5', className)}>
        <div className={cn(
          'rounded-full',
          statusColor,
          sizeClasses[size]
        )} />
        <span className="text-xs font-medium">
          {statusText}
        </span>
      </Badge>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'rounded-full',
        statusColor,
        sizeClasses[size]
      )} />
    </div>
  )
}
