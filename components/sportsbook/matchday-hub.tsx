'use client'

import {
  ChevronRight,
  Clock,
  Flame,
  Star,
  Ticket,
  Trophy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  FEATURED_MATCH_ID,
  MATCHES,
  formatStartsIn,
  getCompetition,
  selectionId,
} from '@/lib/sportsbook/data'
import { useSlipIds, useSportsbook } from '@/lib/sportsbook/store'
import { LiveBadge, TeamCrest } from './shared'

export function MatchdayHub() {
  const {
    openMatch,
    navigate,
    toggleSelection,
    getOdds,
    isSuspended,
    myBets,
    followed,
    toggleFollow,
  } = useSportsbook()

  const slipIds = useSlipIds()

  const liveMatch =
    MATCHES.find((match) => match.id === FEATURED_MATCH_ID) ??
    MATCHES.find((match) => match.status === 'live')

  const startingSoon = MATCHES
    .filter((match) => match.status === 'upcoming')
    .sort((a, b) => (a.startsIn ?? 0) - (b.startsIn ?? 0))[0]

  if (!liveMatch || !startingSoon) return null

  const openBets = myBets.filter((bet) => bet.status === 'open')
  const liveCompetition = getCompetition(liveMatch.competitionId)
  const soonCompetition = getCompetition(startingSoon.competitionId)

  const homeSelectionId = selectionId(liveMatch.id, '1x2', 'home')
  const homeOdds = getOdds(homeSelectionId, liveMatch.odds.home)
  const selectionSuspended = isSuspended(homeSelectionId)
  const selectionAdded = slipIds.has(homeSelectionId)
  const followsHomeTeam = followed.has(liveMatch.home)

  function toggleLiveSelection() {
    if (selectionSuspended) return

    toggleSelection({
      id: homeSelectionId,
      matchId: liveMatch.id,
      matchLabel: `${liveMatch.home} vs ${liveMatch.away}`,
      marketName: 'Match Result',
      outcomeLabel: liveMatch.home,
      odds: liveMatch.odds.home,
    })
  }

  return (
    <section
      aria-labelledby="matchday-title"
      className="overflow-hidden rounded-2xl border border-primary/20 bg-surface"
    >
      <div className="relative border-b border-border bg-gradient-to-r from-primary/15 via-surface to-surface px-4 py-5 md:px-6">
        <div
          className="pointer-events-none absolute -right-14 -top-20 size-52 rounded-full bg-primary/15 blur-3xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Trophy className="size-4" aria-hidden />
              </span>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Your matchday
              </p>
            </div>

            <h1
              id="matchday-title"
              className="mt-3 text-balance text-2xl font-bold text-foreground md:text-3xl"
            >
              Everything that matters, in one place
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Follow live action, find the next match and track every single
              without losing context.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('live', { sport: 'all' })}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background/60 px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
            >
              <Flame className="size-4 text-down" aria-hidden />
              {MATCHES.filter((match) => match.status === 'live').length} live
            </button>

            <button
              type="button"
              onClick={() => navigate('bets')}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Ticket className="size-4" aria-hidden />
              {openBets.length
                ? `${openBets.length} open bet${openBets.length === 1 ? '' : 's'}`
                : 'My bets'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-border lg:grid-cols-[1.35fr_1fr_0.9fr]">
        {/* Live now */}
        <article className="bg-surface p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <LiveBadge />

                <span className="text-xs text-muted-foreground">
                  {liveCompetition.name}
                </span>
              </div>

              <h2 className="mt-2 font-semibold text-foreground">Live now</h2>
            </div>

            <button
              type="button"
              onClick={() => toggleFollow(liveMatch.home)}
              aria-pressed={followsHomeTeam}
              className={cn(
                'flex size-9 items-center justify-center rounded-lg border transition-colors',
                followsHomeTeam
                  ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300'
                  : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
              aria-label={
                followsHomeTeam
                  ? `Unfollow ${liveMatch.home}`
                  : `Follow ${liveMatch.home}`
              }
            >
              <Star
                className={cn('size-4', followsHomeTeam && 'fill-current')}
                aria-hidden
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => openMatch(liveMatch.id)}
            className="mt-4 block w-full rounded-xl bg-background/60 p-3 text-left transition-colors hover:bg-background"
          >
            <span className="flex items-center gap-3">
              <TeamCrest short={liveMatch.homeShort} />

              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                {liveMatch.home}
              </span>

              <span className="font-mono text-xl font-bold text-foreground">
                {liveMatch.score?.[0] ?? 0}
              </span>
            </span>

            <span className="mt-2 flex items-center gap-3">
              <TeamCrest short={liveMatch.awayShort} />

              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                {liveMatch.away}
              </span>

              <span className="font-mono text-xl font-bold text-foreground">
                {liveMatch.score?.[1] ?? 0}
              </span>
            </span>

            <span className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
              <span className="font-semibold text-down">
                {liveMatch.period} ·{' '}
                {Math.floor((liveMatch.clock ?? 0) / 60)}′
              </span>

              <span className="flex items-center gap-1 font-medium text-primary">
                Open match
                <ChevronRight className="size-3.5" aria-hidden />
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={toggleLiveSelection}
            disabled={selectionSuspended}
            className={cn(
              'mt-3 flex h-11 w-full items-center justify-between rounded-lg border px-3 text-sm transition-colors',
              selectionAdded
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-surface-2 text-foreground hover:border-primary/60',
                            selectionSuspended && 'cursor-not-allowed opacity-60',
            )}
          >
            <span className="font-medium">
              {selectionSuspended
                ? 'Market suspended'
                : selectionAdded
                  ? `${liveMatch.home} added`
                  : `${liveMatch.home} to win`}
            </span>

            <span className="font-mono font-bold">
              {selectionSuspended ? '—' : homeOdds.toFixed(2)}
            </span>
          </button>
        </article>

        {/* Starting soon */}
        <article className="bg-surface p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-4 text-yellow-300" aria-hidden />
                <span>{soonCompetition.name}</span>
              </div>

              <h2 className="mt-2 font-semibold text-foreground">
                Starting soon
              </h2>
            </div>

            <span className="rounded-full bg-yellow-400/10 px-2.5 py-1 text-xs font-bold text-yellow-300">
              {formatStartsIn(startingSoon.startsIn ?? 0)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => openMatch(startingSoon.id)}
            className="mt-4 block w-full rounded-xl bg-background/60 p-3 text-left transition-colors hover:bg-background"
          >
            <span className="flex items-center gap-3">
              <TeamCrest short={startingSoon.homeShort} />

              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                {startingSoon.home}
              </span>

              <span className="font-mono text-sm font-bold text-primary">
                {startingSoon.odds.home.toFixed(2)}
              </span>
            </span>

            <span className="mt-2 flex items-center gap-3">
              <TeamCrest short={startingSoon.awayShort} />

              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                {startingSoon.away}
              </span>

              <span className="font-mono text-sm font-bold text-primary">
                {startingSoon.odds.away.toFixed(2)}
              </span>
            </span>

            <span className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
              <span className="text-muted-foreground">
                {startingSoon.markets} markets available
              </span>

              <span className="flex items-center gap-1 font-medium text-primary">
                View match
                <ChevronRight className="size-3.5" aria-hidden />
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('football')}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
          >
            Explore football
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </article>

        {/* Your next move */}
        <article className="bg-surface p-4 md:p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Ticket className="size-4 text-primary" aria-hidden />
            <span>Personal shortcut</span>
          </div>

          <h2 className="mt-2 font-semibold text-foreground">
            Your next move
          </h2>

          {openBets.length > 0 ? (
            <>
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Ticket className="size-5" aria-hidden />
                </span>

                <p className="mt-3 text-sm font-semibold text-foreground">
                  Track {openBets.length} open bet
                  {openBets.length === 1 ? '' : 's'}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Live scores, potential returns and cash out are available in
                  My Bets.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('bets')}
                className="mt-3 flex h-11 w-full items-center justify-between rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <span>Open My Bets</span>
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </>
          ) : (
            <>
              <div className="mt-4 rounded-xl border border-border bg-background/60 p-4">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Flame className="size-5" aria-hidden />
                </span>

                <p className="mt-3 text-sm font-semibold text-foreground">
                  Follow the live action
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Open Arsenal vs Brighton and choose a single market without
                  leaving the match.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openMatch(liveMatch.id)}
                className="mt-3 flex h-11 w-full items-center justify-between rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <span>Open live match</span>
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </>
          )}
        </article>
      </div>
    </section>
  )
}

              
