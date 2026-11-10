'use client'

import { useState } from 'react'
import { ChevronDown, ChevronLeft, Info, Lock, RectangleVertical, Tv, Volleyball } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  FEATURED_MATCH_ID,
  FEATURED_STATS,
  MATCH_MARKET_GROUPS,
  formatClock,
  formatKickoff,
  getCompetition,
  getMatch,
  selectionId,
  type Market,
  type MarketGroup,
  type Match,
} from '@/lib/sportsbook/data'
import { useSportsbook } from '@/lib/sportsbook/store'
import { OddsButton } from '../odds-button'
import { FollowStar, LiveBadge, SportIcon, TeamCrest } from '../shared'

function marketGroupsFor(match: Match): MarketGroup[] {
  if (match.id === FEATURED_MATCH_ID) return MATCH_MARKET_GROUPS
  return [
    {
      id: 'popular',
      name: 'Popular',
      markets: [
        {
          id: '1x2',
          name: match.odds.draw ? 'Match Result' : 'Winner',
          columns: match.odds.draw ? 3 : 2,
          outcomes: [
            { key: 'home', label: match.home, odds: match.odds.home },
            ...(match.odds.draw ? [{ key: 'draw', label: 'Draw', odds: match.odds.draw }] : []),
            { key: 'away', label: match.away, odds: match.odds.away },
          ],
        },
      ],
    },
  ]
}

function Scoreboard({ match }: { match: Match }) {
  const { clocks, navigate } = useSportsbook()
  const comp = getCompetition(match.competitionId)
  const live = match.status === 'live'
  const seconds = clocks[match.id] ?? match.clock ?? 0
  const featured = match.id === FEATURED_MATCH_ID

  return (
    <section aria-label="Scoreboard" className="relative overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/15 to-transparent" aria-hidden />
      <div className="relative flex items-center justify-between gap-2 px-3 pt-3 md:px-5 md:pt-4">
        <button
          type="button"
          onClick={() => navigate(match.sport === 'football' ? 'football' : 'live')}
          className="flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
          <SportIcon sport={match.sport} className="size-3.5" />
          {comp.name}
        </button>
        <div className="flex items-center gap-1">
          <button type="button" className="flex h-8 items-center gap-1.5 rounded-md bg-background/60 px-2.5 text-xs font-medium text-foreground hover:bg-accent">
            <Tv className="size-3.5 text-primary" aria-hidden />
            <span className="hidden sm:inline">Live Tracker</span>
          </button>
          <FollowStar followKey={match.id} label={`${match.home} vs ${match.away}`} />
        </div>
      </div>

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-5 md:gap-6 md:px-8 md:py-7">
        <div className="flex flex-col items-center gap-2 text-center">
          <TeamCrest short={match.homeShort} className="size-14 text-sm md:size-16" />
          <span className="text-sm font-semibold text-foreground md:text-base">{match.home}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          {live ? (
            <>
              <LiveBadge />
              <span className="font-mono text-4xl font-bold tabular-nums tracking-tight text-foreground md:text-5xl" aria-live="polite">
                {match.score?.[0]}
                <span className="mx-2 text-muted-foreground">-</span>
                {match.score?.[1]}
              </span>
              <span className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-sm font-semibold tabular-nums text-primary">
                {match.period} · {formatClock(seconds)}
              </span>
            </>
          ) : (
            <>
              <span className="text-xs text-muted-foreground">Kick-off</span>
              <span className="font-mono text-2xl font-bold text-foreground">{formatKickoff(match.startsIn ?? 0)}</span>
            </>
          )}
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <TeamCrest short={match.awayShort} className="size-14 text-sm md:size-16" />
          <span className="text-sm font-semibold text-foreground md:text-base">{match.away}</span>
        </div>
      </div>

      {featured && live && <MatchStats />}
    </section>
  )
}

function StatBar({ label, values, percent }: { label: string; values: [number, number]; percent?: boolean }) {
  const total = values[0] + values[1] || 1
  const homePct = (values[0] / total) * 100
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-mono font-semibold text-foreground">{values[0]}{percent && '%'}</span>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold text-foreground">{values[1]}{percent && '%'}</span>
      </div>
      <div className="flex h-1.5 gap-1 overflow-hidden rounded-full">
        <span className="rounded-full bg-primary" style={{ width: `${homePct}%` }} />
        <span className="flex-1 rounded-full bg-muted-foreground/40" />
      </div>
    </div>
  )
}

function MatchStats() {
  const s = FEATURED_STATS
  return (
    <div className="relative grid gap-5 border-t border-border px-4 py-4 md:grid-cols-[1.2fr_1fr] md:px-6">
      <div className="space-y-3">
        <StatBar label="Possession" values={s.possession} percent />
        <StatBar label="Shots" values={s.shots} />
        <StatBar label="Shots on target" values={s.shotsOnTarget} />
        <StatBar label="Corners" values={s.corners} />
      </div>
      <ol className="space-y-2" aria-label="Match events">
        {s.events.map((e, i) => (
          <li key={i} className={cn('flex items-center gap-2 text-xs', e.team === 'away' && 'flex-row-reverse text-right')}>
            <span className="w-8 shrink-0 font-mono text-muted-foreground">{`${e.minute}'`}</span>
            {e.type === 'goal' ? (
              <Volleyball className="size-3.5 shrink-0 text-primary" aria-label="Goal" />
            ) : (
              <RectangleVertical className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" aria-label="Yellow card" />
            )}
            <span className="truncate text-foreground">{e.player}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function MarketCard({ match, market }: { match: Match; market: Market }) {
  const { isSuspended } = useSportsbook()
  const [open, setOpen] = useState(true)
  const ids = market.outcomes.map((o) => selectionId(match.id, market.id, o.key))
  const suspended = ids.every((id) => isSuspended(id))
  const cols = market.columns ?? 2

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-surface-2/50"
      >
        <h3 className="flex-1 truncate text-sm font-semibold text-foreground">{market.name}</h3>
        {suspended && (
          <span className="flex items-center gap-1 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[11px] font-semibold text-yellow-300 animate-in fade-in">
            <Lock className="size-3" aria-hidden />
            Selection Suspended
          </span>
        )}
        <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', !open && '-rotate-90')} aria-hidden />
      </button>
      {open && (
        <div className={cn('grid gap-2 px-4 pb-4', cols === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2')}>
          {market.outcomes.map((o) => (
            <OddsButton
              key={o.key}
              id={selectionId(match.id, market.id, o.key)}
              matchId={match.id}
              matchLabel={`${match.home} vs ${match.away}`}
              marketName={market.name}
              outcomeLabel={o.label}
              base={o.odds}
              label={o.label}
              layout="inline"
            />
          ))}
        </div>
      )}
    </section>
  )
}

export function MatchView() {
  const { matchId } = useSportsbook()
  const match = getMatch(matchId)
  const groups = marketGroupsFor(match)
  const [groupId, setGroupId] = useState('popular')
  const group = groups.find((g) => g.id === groupId) ?? groups[0]
  const featured = match.id === FEATURED_MATCH_ID

  return (
    <div className="space-y-4">
      <Scoreboard match={match} />

      <div
        role="tablist"
        aria-label="Market groups"
        className="no-scrollbar sticky top-[6.75rem] z-20 -mx-3 flex gap-1 overflow-x-auto border-b border-border bg-background/95 px-3 py-2 backdrop-blur md:mx-0 md:rounded-xl md:border md:bg-surface md:px-2"
      >
        {(featured ? MATCH_MARKET_GROUPS : groups).map((g) => (
          <button
            key={g.id}
            role="tab"
            type="button"
            aria-selected={group.id === g.id}
            onClick={() => setGroupId(g.id)}
            className={cn(
              'h-9 shrink-0 rounded-lg px-3.5 text-sm font-medium transition-colors',
              group.id === g.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            {g.name}
            <span className="ml-1.5 font-mono text-[11px] opacity-70">{g.markets.length}</span>
          </button>
        ))}
      </div>

      {!featured && (
        <p className="flex items-center gap-2 rounded-lg bg-surface px-4 py-3 text-xs text-muted-foreground">
          <Info className="size-4 shrink-0 text-primary" aria-hidden />
          Full market depth in this prototype is available on Arsenal vs Brighton.
        </p>
      )}

      <div key={group.id} className="grid gap-3 animate-in fade-in slide-in-from-bottom-1 2xl:grid-cols-2">
        {group.markets.map((m) => (
          <MarketCard key={m.id} match={match} market={m} />
        ))}
      </div>
    </div>
  )
}
