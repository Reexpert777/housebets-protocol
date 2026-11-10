'use client'

import { CircleDot, Gamepad2, Star, Swords, Target, Volleyball, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatClock, getCompetition, selectionId, type Match, type SportId } from '@/lib/sportsbook/data'
import { useSportsbook } from '@/lib/sportsbook/store'
import { OddsButton } from './odds-button'

export const SPORT_ICONS: Record<SportId, LucideIcon> = {
  football: Volleyball,
  basketball: CircleDot,
  tennis: Target,
  esports: Gamepad2,
  hockey: Swords,
}

export function SportIcon({ sport, className }: { sport: SportId; className?: string }) {
  const Icon = SPORT_ICONS[sport]
  return <Icon className={cn('size-4', className)} aria-hidden />
}

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded bg-down/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-down',
        className,
      )}
    >
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-down opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-down" />
      </span>
      Live
    </span>
  )
}

export function LiveClock({ match }: { match: Match }) {
  const { clocks } = useSportsbook()
  const seconds = clocks[match.id] ?? match.clock ?? 0
  const showSeconds = match.sport === 'football' || match.sport === 'basketball' || match.sport === 'hockey'
  return (
    <span className="font-mono text-xs tabular-nums text-primary">
      {match.period}
      {showSeconds && <span className="ml-1.5">{formatClock(seconds)}</span>}
    </span>
  )
}

export function TeamCrest({ short, className }: { short: string; className?: string }) {
  let hash = 0
  for (const c of short) hash = (hash * 31 + c.charCodeAt(0)) % 360
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ring-1 ring-white/10',
        className,
      )}
      style={{ backgroundColor: `hsl(${hash} 45% 32%)` }}
    >
      {short.slice(0, 3)}
    </span>
  )
}

export function FollowStar({ followKey, label, className }: { followKey: string; label: string; className?: string }) {
  const { followed, toggleFollow } = useSportsbook()
  const active = followed.has(followKey)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggleFollow(followKey)
      }}
      aria-pressed={active}
      aria-label={active ? `Unfollow ${label}` : `Follow ${label}`}
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent',
        active ? 'text-yellow-400' : 'text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      <Star className={cn('size-4 transition-transform', active && 'scale-110 fill-yellow-400')} aria-hidden />
    </button>
  )
}

export function MatchOdds({ match, className }: { match: Match; className?: string }) {
  const matchLabel = `${match.home} vs ${match.away}`
  const marketName = match.odds.draw ? 'Match Result' : 'Winner'
  const outcomes = [
    { key: 'home', label: '1', outcome: match.home, odds: match.odds.home },
    ...(match.odds.draw ? [{ key: 'draw', label: 'X', outcome: 'Draw', odds: match.odds.draw }] : []),
    { key: 'away', label: '2', outcome: match.away, odds: match.odds.away },
  ]
  return (
    <div className={cn('grid gap-1.5', match.odds.draw ? 'grid-cols-3' : 'grid-cols-2', className)}>
      {outcomes.map((o) => (
        <OddsButton
          key={o.key}
          id={selectionId(match.id, '1x2', o.key)}
          matchId={match.id}
          matchLabel={matchLabel}
          marketName={marketName}
          outcomeLabel={o.outcome}
          base={o.odds}
          label={o.label}
        />
      ))}
    </div>
  )
}

export function CompetitionLabel({ match, className }: { match: Match; className?: string }) {
  const comp = getCompetition(match.competitionId)
  return (
    <span className={cn('flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground', className)}>
      <SportIcon sport={match.sport} className="size-3.5 shrink-0" />
      <span className="truncate">
        {comp.region} · {comp.name}
      </span>
    </span>
  )
}

export function SectionHeader({
  icon: Icon,
  title,
  action,
}: {
  icon?: LucideIcon
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        {Icon && <Icon className="size-4 text-primary" aria-hidden />}
        {title}
      </h2>
      {action}
    </div>
  )
}
