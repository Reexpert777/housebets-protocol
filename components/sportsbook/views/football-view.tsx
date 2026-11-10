'use client'

import { useState } from 'react'
import { Volleyball } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MATCHES, getCompetition } from '@/lib/sportsbook/data'
import { MatchRow } from '../match-row'
import { FollowStar } from '../shared'

const LEAGUES = ['epl', 'ucl', 'laliga', 'seriea', 'bundesliga']

export function FootballView() {
  const [league, setLeague] = useState<string>('all')
  const [period, setPeriod] = useState<'all' | 'live' | 'today'>('all')
  const visible = league === 'all' ? LEAGUES : [league]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Volleyball className="size-6 text-primary" aria-hidden />
          Football
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Top European leagues · 1X2 decimal odds</p>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-3 flex gap-1 overflow-x-auto px-3 md:mx-0 md:px-0" role="tablist" aria-label="League">
          {['all', ...LEAGUES].map((id) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={league === id}
              onClick={() => setLeague(id)}
              className={cn(
                'h-9 shrink-0 rounded-lg px-3 text-sm font-medium transition-colors',
                league === id ? 'bg-surface-2 text-foreground ring-1 ring-primary/50' : 'text-muted-foreground hover:bg-surface hover:text-foreground',
              )}
            >
              {id === 'all' ? 'All Leagues' : getCompetition(id).name}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 gap-1 rounded-lg bg-surface p-1" role="group" aria-label="Time filter">
          {(['all', 'live', 'today'] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={period === p}
              onClick={() => setPeriod(p)}
              className={cn(
                'h-7 rounded-md px-3 text-xs font-medium capitalize transition-colors',
                period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p === 'all' ? 'All' : p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {visible.map((id) => {
          const comp = getCompetition(id)
          const matches = MATCHES.filter((m) => m.competitionId === id)
            .filter((m) =>
              period === 'live' ? m.status === 'live' : period === 'today' ? m.status === 'live' || (m.startsIn ?? 0) < 1440 : true,
            )
            .sort((a, b) => (a.status === 'live' ? -1 : 0) - (b.status === 'live' ? -1 : 0) || (a.startsIn ?? 0) - (b.startsIn ?? 0))
          if (!matches.length) return null
          return (
            <section key={id} className="overflow-hidden rounded-xl border border-border bg-surface animate-in fade-in">
              <header className="flex items-center gap-2 border-b border-border bg-surface-2/50 py-2 pl-2 pr-3 md:pr-4">
                <FollowStar followKey={id} label={comp.name} />
                <span className="flex size-7 items-center justify-center rounded-md bg-background font-mono text-[10px] font-bold text-foreground">
                  {comp.short}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-foreground">{comp.name}</h2>
                  <p className="text-[11px] text-muted-foreground">{comp.region}</p>
                </div>
                <span className="ml-auto hidden w-[264px] grid-cols-3 pr-14 text-center text-[11px] font-medium text-muted-foreground sm:grid">
                  <span>1</span>
                  <span>X</span>
                  <span>2</span>
                </span>
              </header>
              <div className="divide-y divide-border">
                {matches.map((m) => (
                  <MatchRow key={m.id} match={m} showFollow />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
