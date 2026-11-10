'use client'

import { Clock, Radio, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COMPETITIONS, MATCHES, SPORTS, getCompetition } from '@/lib/sportsbook/data'
import { useSportsbook } from '@/lib/sportsbook/store'
import { MatchRow } from '../match-row'
import { SectionHeader, SportIcon } from '../shared'

function Chip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors',
        active
          ? 'border-primary/50 bg-primary/10 text-primary'
          : 'border-border bg-surface text-muted-foreground hover:bg-surface-2 hover:text-foreground',
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn('font-mono text-[11px]', count > 0 ? (active ? 'text-primary' : 'text-down') : 'text-muted-foreground/60')}>
          {count}
        </span>
      )}
    </button>
  )
}

export function LiveView() {
  const { liveSport, setLiveSport, liveCompetition, setLiveCompetition } = useSportsbook()
  const allLive = MATCHES.filter((m) => m.status === 'live')

  const comps = COMPETITIONS.filter((c) => liveSport === 'all' || c.sport === liveSport)
  const filtered = allLive.filter(
    (m) => (liveSport === 'all' || m.sport === liveSport) && (liveCompetition === 'all' || m.competitionId === liveCompetition),
  )
  const grouped = Object.entries(
    filtered.reduce<Record<string, typeof filtered>>((acc, m) => {
      ;(acc[m.competitionId] ??= []).push(m)
      return acc
    }, {}),
  )

  const fallback = MATCHES.filter(
    (m) =>
      m.status === 'upcoming' &&
      (liveSport === 'all' || m.sport === liveSport) &&
      (liveCompetition === 'all' || m.competitionId === liveCompetition || m.sport === getCompetition(liveCompetition)?.sport),
  )
    .sort((a, b) => (a.startsIn ?? 0) - (b.startsIn ?? 0))
    .slice(0, 5)

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Radio className="size-6 text-down" aria-hidden />
            Live Betting
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {allLive.length} events in play · odds update in real time
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter by sport">
          <Chip
            active={liveSport === 'all'}
            onClick={() => {
              setLiveSport('all')
              setLiveCompetition('all')
            }}
            count={allLive.length}
          >
            All Sports
          </Chip>
          {SPORTS.map((s) => (
            <Chip
              key={s.id}
              active={liveSport === s.id}
              onClick={() => {
                setLiveSport(s.id)
                setLiveCompetition('all')
              }}
              count={allLive.filter((m) => m.sport === s.id).length}
            >
              <SportIcon sport={s.id} />
              {s.name}
            </Chip>
          ))}
        </div>
        <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter by competition">
          <Chip active={liveCompetition === 'all'} onClick={() => setLiveCompetition('all')}>
            All Competitions
          </Chip>
          {comps.map((c) => (
            <Chip
              key={c.id}
              active={liveCompetition === c.id}
              onClick={() => setLiveCompetition(c.id)}
              count={allLive.filter((m) => m.competitionId === c.id).length}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-surface/50 px-6 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-muted-foreground">
              <SearchX className="size-6" aria-hidden />
            </span>
            <p className="mt-3 text-base font-semibold text-foreground">No live matches right now</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Nothing is in play for this filter. Here&apos;s what&apos;s starting soon instead.
            </p>
            <button
              type="button"
              onClick={() => {
                setLiveSport('all')
                setLiveCompetition('all')
              }}
              className="mt-4 h-9 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-accent"
            >
              Reset filters
            </button>
          </div>
          {fallback.length > 0 && (
            <section>
              <SectionHeader icon={Clock} title="Starting Soon" />
              <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
                {fallback.map((m) => (
                  <MatchRow key={m.id} match={m} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([compId, matches]) => {
            const comp = getCompetition(compId)
            return (
              <section key={compId} className="overflow-hidden rounded-xl border border-border bg-surface animate-in fade-in">
                <header className="flex items-center gap-2 border-b border-border bg-surface-2/50 px-3 py-2.5 md:px-4">
                  <SportIcon sport={comp.sport} className="text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">{comp.name}</h2>
                  <span className="text-xs text-muted-foreground">{comp.region}</span>
                  <span className="ml-auto hidden w-[264px] grid-cols-3 pr-14 text-center text-[11px] font-medium text-muted-foreground sm:grid">
                    <span>1</span>
                    <span>{matches[0].odds.draw ? 'X' : ''}</span>
                    <span>2</span>
                  </span>
                </header>
                <div className="divide-y divide-border">
                  {matches.map((m) => (
                    <MatchRow key={m.id} match={m} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
