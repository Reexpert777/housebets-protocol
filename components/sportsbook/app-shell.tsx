'use client'

import { ShieldCheck } from 'lucide-react'
import { SportsbookProvider, useSportsbook } from '@/lib/sportsbook/store'
import { BetSlipPanel } from './bet-slip'
import { MobileSlip } from './mobile-slip'
import { SideNav } from './side-nav'
import { TopBar } from './top-bar'
import { ViewTabs } from './view-tabs'
import { FootballView } from './views/football-view'
import { HomeView } from './views/home-view'
import { LiveView } from './views/live-view'
import { MatchView } from './views/match-view'

function BetsView() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bet Slip &amp; My Bets</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" aria-hidden />
          Stakes settle in USDT directly to your connected wallet.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4">
        <BetSlipPanel variant="page" />
      </div>
    </div>
  )
}

function Shell() {
  const { view } = useSportsbook()

  return (
    <div className="min-h-dvh bg-background">
      <TopBar />
      <div className="flex">
        <SideNav />
        <main className="min-w-0 flex-1 pb-24 xl:pb-10">
          <ViewTabs />
          <div className="px-3 py-4 md:px-6 md:py-6">
            {view === 'home' && <HomeView />}
            {view === 'live' && <LiveView />}
            {view === 'football' && <FootballView />}
            {view === 'match' && <MatchView />}
            {view === 'bets' && <BetsView />}
          </div>
        </main>
        {view !== 'bets' && (
          <aside
            aria-label="Bet slip"
            className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-[340px] shrink-0 flex-col border-l border-border bg-surface p-4 xl:flex"
          >
            <BetSlipPanel />
          </aside>
        )}
      </div>
      <MobileSlip />
    </div>
  )
}

export function AppShell() {
  return (
    <SportsbookProvider>
      <Shell />
    </SportsbookProvider>
  )
}
