'use client'

import { ArrowDown, ArrowUp, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSlipIds, useSportsbook } from '@/lib/sportsbook/store'

type OddsButtonProps = {
  id: string
  matchId: string
  matchLabel: string
  marketName: string
  outcomeLabel: string
  base: number
  /** label shown inside the button (e.g. "1", "X", "Over 2.5") */
  label?: string
  layout?: 'stacked' | 'inline'
  className?: string
}

export function OddsButton({
  id,
  matchId,
  matchLabel,
  marketName,
  outcomeLabel,
  base,
  label,
  layout = 'stacked',
  className,
}: OddsButtonProps) {
  const { getOdds, getMovement, isSuspended, toggleSelection } = useSportsbook()
  const selectedIds = useSlipIds()
  const value = getOdds(id, base)
  const movement = getMovement(id)
  const suspended = isSuspended(id)
  const selected = selectedIds.has(id)

  return (
    <button
      type="button"
      disabled={suspended}
      aria-pressed={selected}
      aria-label={`${outcomeLabel} at ${value.toFixed(2)}${suspended ? ', suspended' : ''}`}
      onClick={() => toggleSelection({ id, matchId, matchLabel, marketName, outcomeLabel, odds: value })}
      className={cn(
        'group relative flex min-w-0 items-center overflow-hidden rounded-md border text-sm transition-colors',
        layout === 'stacked' ? 'h-11 flex-col justify-center px-2' : 'h-11 justify-between gap-2 px-3',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-surface-2 text-foreground hover:border-primary/60 hover:bg-accent',
        suspended && 'cursor-not-allowed border-border/60 bg-surface-2/50 text-muted-foreground hover:border-border/60 hover:bg-surface-2/50',
        className,
      )}
    >
      {movement && !selected && !suspended && (
        <span
          key={`${value}-${movement}`}
          aria-hidden
          className={cn('absolute inset-0', movement === 'up' ? 'animate-flash-up' : 'animate-flash-down')}
        />
      )}
      {label && (
        <span
          className={cn(
            'relative truncate',
            layout === 'stacked' ? 'max-w-full text-[10px] leading-tight' : 'text-xs',
            selected ? 'text-primary-foreground/80' : 'text-muted-foreground',
          )}
        >
          {label}
        </span>
      )}
      <span className="relative flex items-center gap-0.5 font-mono text-[13px] font-semibold tabular-nums">
        {suspended ? (
          <Lock className="size-3.5" aria-hidden />
        ) : (
          <>
            {movement === 'up' && <ArrowUp className={cn('size-3', selected ? '' : 'text-up')} aria-hidden />}
            {movement === 'down' && <ArrowDown className={cn('size-3', selected ? '' : 'text-down')} aria-hidden />}
            <span className={cn(!selected && movement === 'up' && 'text-up', !selected && movement === 'down' && 'text-down')}>
              {value.toFixed(2)}
            </span>
          </>
        )}
      </span>
    </button>
  )
}
