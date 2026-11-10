'use client'

import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatKickoff, formatStartsIn, type Match } from '@/lib/sportsbook/data'
import { useSportsbook } from '@/lib/sportsbook/store'
import { FollowStar, LiveBadge, LiveClock, MatchOdds, TeamCrest } from './shared'

export function MatchRow({ match, showFollow = false, className }: { match: Match; showFollow?: boolean; className?: string }) {
  const { openMatch } = useSportsbook()
  const live = match.status === 'live'

  return (
    <div
      className={cn(
        'flex flex-col gap-3 px-3 py-3 transition-colors hover:bg-surface-2/60 sm:flex-row sm:items-center sm:gap-4 md:px-4',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex w-16 shrink-0 flex-col items-start gap-1">
          {live ? (
            <>
              <LiveBadge />
              <LiveClock match={match} />
            </>
          ) : (
            <>
              <span className="text-xs font-medium text-foreground">{formatKickoff(match.startsIn ?? 0).split(' ')[1]}</span>
              <span className="text-[11px] text-muted-foreground">{formatStartsIn(match.startsIn ?? 0)}</span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => openMatch(match.id)}
          className="flex min-w-0 flex-1 flex-col gap-1.5 text-left"
          aria-label={`Open ${match.home} vs ${match.away}`}
        >
          {([
            [match.home, match.homeShort, match.score?.[0]],
            [match.away, match.awayShort, match.score?.[1]],
          ] as const).map(([name, short, score]) => (
            <span key={name} className="flex items-center gap-2">
              <TeamCrest short={short} className="size-5 text-[8px]" />
              <span className="truncate text-sm font-medium text-foreground">{name}</span>
              {live && <span className="ml-auto font-mono text-sm font-bold tabular-nums text-foreground">{score}</span>}
            </span>
          ))}
        </button>
        {showFollow && (
          <div className="flex flex-col">
            <FollowStar followKey={match.home} label={match.home} className="size-6" />
            <FollowStar followKey={match.away} label={match.away} className="size-6" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 sm:w-[264px] sm:shrink-0">
        <MatchOdds match={match} className="flex-1" />
        <button
          type="button"
          onClick={() => openMatch(match.id)}
          className="flex h-11 w-12 shrink-0 flex-col items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
          aria-label={`${match.markets} more markets for ${match.home} vs ${match.away}`}
        >
          <span className="font-mono text-[11px] font-semibold">+{match.markets}</span>
          <ChevronRight className="size-3.5" aria-hidden />
        </button>
      </div>
    </div>
  )
}
