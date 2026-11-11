'use client'

import { useMemo, useState } from 'react'
import { ChevronRight, Clock, Flame, Search, Trophy, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  COMPETITIONS,
  MATCHES,
  MATCH_MARKET_GROUPS,
  SPORTS,
  FEATURED_MATCH_ID,
  getCompetition,
} from '@/lib/sportsbook/data'
import { useSportsbook } from '@/lib/sportsbook/store'
import { CompetitionLabel, LiveBadge, LiveClock, MatchOdds, SectionHeader, SportIcon, TeamCrest } from '../shared'
import { MatchRow } from '../match-row'
import { MatchdayHub } from '../matchday-hub'

function SearchBar() {
  const { openMatch, navigate } = useSportsbook()
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const results = useMemo(() => {
    if (query.length < 2) return null
    const teams = MATCHES.filter(
      (m) => m.home.toLowerCase().includes(query) || m.away.toLowerCase().includes(query),
    ).slice(0, 5)
    const comps = COMPETITIONS.filter((c) => c.name.toLowerCase().includes(query)).slice(0, 4)
    const players = MATCH_MARKET_GROUPS.flatMap((g) => g.markets)
      .filter((m) => m.id === 'next-scorer')
      .flatMap((m) => m.outcomes)
      .filter((o) => o.label.toLowerCase().includes(query))
      .slice(0, 4)
    const markets = MATCH_MARKET_GROUPS.flatMap((g) => g.markets)
      .filter((m) => m.name.toLowerCase().includes(query))
      .slice(0, 4)
    return { teams, comps, players, markets }
  }, [query])

  const empty = results && !results.teams.length && !results.comps.length && !results.players.length && !results.markets.length

  return (
    <div className="relative">
      <label className="relative block">
        <span className="sr-only">Search teams, players, competitions and markets</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search teams, players, competitions, markets…"
          className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </label>
      {results && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-96 overflow-y-auto rounded-xl border border-border bg-popover p-2 shadow-2xl animate-in fade-in slide-in-from-top-1">
          {empty && <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results for “{q}”</p>}
          {!!results.teams.length && (
            <ResultGroup title="Teams & Matches">
              {results.teams.map((m) => (
                <ResultItem
                  key={m.id}
                  onClick={() => {
                    setQ('')
                    openMatch(m.id)
                  }}
                  primary={`${m.home} vs ${m.away}`}
                  secondary={getCompetition(m.competitionId).name}
                  live={m.status === 'live'}
                />
              ))}
            </ResultGroup>
          )}
          {!!results.players.length && (
            <ResultGroup title="Players">
              {results.players.map((p) => (
                <ResultItem
                  key={p.key}
                  onClick={() => {
                    setQ('')
                    openMatch(FEATURED_MATCH_ID)
                  }}
                  primary={p.label}
                  secondary="Next Goalscorer · Arsenal vs Brighton"
                />
              ))}
            </ResultGroup>
          )}
          {!!results.comps.length && (
            <ResultGroup title="Competitions">
              {results.comps.map((c) => (
                <ResultItem
                  key={c.id}
                  onClick={() => {
                    setQ('')
                    navigate(c.sport === 'football' ? 'football' : 'live', { sport: c.sport })
                  }}
                  primary={c.name}
                  secondary={c.region}
                />
              ))}
            </ResultGroup>
          )}
          {!!results.markets.length && (
            <ResultGroup title="Markets">
              {results.markets.map((m) => (
                <ResultItem
                  key={m.id}
                  onClick={() => {
                    setQ('')
                    openMatch(FEATURED_MATCH_ID)
                  }}
                  primary={m.name}
                  secondary="Arsenal vs Brighton"
                />
              ))}
            </ResultGroup>
          )}
        </div>
      )}
    </div>
  )
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

function ResultItem({ primary, secondary, onClick, live }: { primary: string; secondary: string; onClick: () => void; live?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-foreground">{primary}</span>
        <span className="block truncate text-xs text-muted-foreground">{secondary}</span>
      </span>
      {live && <LiveBadge />}
      <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
    </button>
  )
}

function SportsMenu() {
  const { navigate } = useSportsbook()
  return (
    <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 md:mx-0 md:px-0">
      {SPORTS.map((s) => {
        const live = MATCHES.filter((m) => m.sport === s.id && m.status === 'live').length
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => (s.id === 'football' ? navigate('football') : navigate('live', { sport: s.id }))}
            className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/50 hover:bg-surface-2"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <SportIcon sport={s.id} />
            </span>
            <span className="flex flex-col items-start">
              <span className="text-sm font-medium text-foreground">{s.name}</span>
              <span className="text-[11px] text-down">{live} live</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function LiveNowCards() {
  const { openMatch, navigate } = useSportsbook()
  const live = MATCHES.filter((m) => m.status === 'live').slice(0, 6)
  return (
    <section>
      <SectionHeader
        icon={Flame}
        title="Live Now"
        action={
          <button type="button" onClick={() => navigate('live', { sport: 'all' })} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ChevronRight className="size-3.5" aria-hidden />
          </button>
        }
      />
      <div className="no-scrollbar -mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-1 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 2xl:grid-cols-3">
        {live.map((m) => (
          <article
            key={m.id}
            className="flex w-[300px] shrink-0 snap-start flex-col rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40 md:w-auto"
          >
            <div className="flex items-center justify-between gap-2">
              <CompetitionLabel match={m} />
              <LiveClock match={m} />
            </div>
            <button type="button" onClick={() => openMatch(m.id)} className="mt-3 space-y-2 text-left" aria-label={`Open ${m.home} vs ${m.away}`}>
              {([
                [m.home, m.homeShort, m.score?.[0]],
                [m.away, m.awayShort, m.score?.[1]],
              ] as const).map(([name, short, score]) => (
                <span key={name} className="flex items-center gap-2.5">
                  <TeamCrest short={short} />
                  <span className="flex-1 truncate text-sm font-semibold text-foreground">{name}</span>
                  <span className="font-mono text-lg font-bold tabular-nums text-foreground">{score}</span>
                </span>
              ))}
            </button>
            <MatchOdds match={m} className="mt-4" />
          </article>
        ))}
      </div>
    </section>
  )
}

function StartingSoon() {
  const soon = MATCHES.filter((m) => m.status === 'upcoming')
    .sort((a, b) => (a.startsIn ?? 0) - (b.startsIn ?? 0))
    .slice(0, 6)
  return (
    <section className="min-w-0">
      <SectionHeader icon={Clock} title="Starting Soon" />
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {soon.map((m) => (
          <div key={m.id}>
            <CompetitionLabel match={m} className="px-3 pt-3 md:px-4" />
            <MatchRow match={m} className="pt-2" />
          </div>
        ))}
      </div>
    </section>
  )
}

function TopCompetitions() {
  const { navigate, openMatch } = useSportsbook()
  const comps = ['epl', 'ucl', 'laliga', 'nba', 'seriea', 'lec'].map(getCompetition)
  const accents = ['from-fuchsia-500/20', 'from-blue-500/20', 'from-orange-500/20', 'from-red-500/20', 'from-sky-500/20', 'from-amber-500/20']

  return (
    <section>
      <SectionHeader icon={Trophy} title="Top Competitions" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {comps.map((c, i) => {
          const matches = MATCHES.filter((m) => m.competitionId === c.id)
          const live = matches.filter((m) => m.status === 'live').length
          const top = matches[0]
          return (
            <article key={c.id} className={cn('rounded-xl border border-border bg-gradient-to-br to-surface p-4', accents[i])}>
              <button
                type="button"
                onClick={() => navigate(c.sport === 'football' ? 'football' : 'live', { sport: c.sport })}
                className="flex w-full items-center gap-3 text-left"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-background/60 font-mono text-xs font-bold text-foreground">
                  {c.short}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{c.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {matches.length} events{live ? ` · ${live} live` : ''}
                  </span>
                </span>
                <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
              </button>
              {top && (
                <button
                  type="button"
                  onClick={() => openMatch(top.id)}
                  className="mt-3 flex w-full items-center justify-between gap-2 rounded-lg bg-background/50 px-3 py-2 text-left text-xs hover:bg-background/80"
                >
                  <span className="truncate text-foreground">
                    {top.home} v {top.away}
                  </span>
                  <span className="shrink-0 font-mono text-primary">{top.odds.home.toFixed(2)}</span>
                </button>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

function PromoBanner() {
  const { openMatch } = useSportsbook()
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/20 via-surface to-surface p-5 md:p-6">
      <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl" aria-hidden />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Featured · Premier League</p>
      <h1 className="mt-1 text-balance text-2xl font-bold text-foreground md:text-3xl">Arsenal vs Brighton is live</h1>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        214 in-play markets, instant USDT settlement and cash out on every single.
      </p>
      <button
        type="button"
        onClick={() => openMatch(FEATURED_MATCH_ID)}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90"
      >
        Bet in-play <ChevronRight className="size-4" aria-hidden />
      </button>
    </div>
  )
}

export function HomeView() {
  return (
    <div className="space-y-6 md:space-y-8">
      <SearchBar />
      <SportsMenu />
      <MatchdayHub />
      <LiveNowCards />

      <div className="grid gap-6 2xl:grid-cols-[1.4fr_1fr]">
        <StartingSoon />
        <TopCompetitions />
      </div>
    </div>
  )
}
