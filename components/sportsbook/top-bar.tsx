'use client'

import { Bell, Crown, Gift, Menu, Plus, Trophy, User, Wallet } from 'lucide-react'
import { formatUSDT } from '@/lib/sportsbook/data'
import { useSportsbook } from '@/lib/sportsbook/store'

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:size-8">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11 12 4l8 7" />
          <path d="M7 10v9h10v-9" />
          <path d="M10.5 19v-4.5h3V19" />
        </svg>
      </span>
      <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
        House<span className="text-primary">bets</span>
      </span>
    </span>
  )
}

export function TopBar() {
  const { balance, setNavOpen, navigate } = useSportsbook()

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-1.5 border-b border-border bg-background/90 px-2 backdrop-blur sm:px-3 md:gap-3 md:px-4">
      <button
        type="button"
        onClick={() => setNavOpen(true)}
        className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" aria-hidden />
      </button>
      <button type="button" onClick={() => navigate('home')} aria-label="Housebets home" className="rounded-md">
        <Logo />
      </button>

      <div className="ml-auto flex items-center gap-1 sm:gap-1.5 md:gap-2">
        <div className="hidden items-center gap-1.5 md:flex">
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 text-xs font-semibold text-yellow-300 hover:bg-yellow-400/15"
          >
            <Trophy className="size-3.5" aria-hidden />
            3 Prizes
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 text-xs font-semibold text-fuchsia-300 hover:bg-fuchsia-400/15"
          >
            <Crown className="size-3.5" aria-hidden />
            VIP Gold
          </button>
        </div>
        <button
          type="button"
          aria-label="Rewards, 3 available"
          className="relative flex size-9 items-center justify-center rounded-full text-yellow-300 hover:bg-accent md:hidden"
        >
          <Gift className="size-5" aria-hidden />
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-bold text-black">
            3
          </span>
        </button>

        <div className="flex h-9 items-center overflow-hidden rounded-lg border border-border bg-surface">
          <span className="flex items-center gap-1.5 px-2 md:px-3">
            <Wallet className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
            <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white" aria-hidden>
              ₮
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{formatUSDT(balance)}</span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline">USDT</span>
          </span>
          <button
            type="button"
            className="flex h-full items-center gap-1 bg-primary px-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 md:px-3"
          >
            <Plus className="size-4 md:hidden" aria-hidden />
            <span className="sr-only md:not-sr-only">Deposit</span>
          </button>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative hidden size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground sm:flex"
        >
          <Bell className="size-5" aria-hidden />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
        </button>
        <button
          type="button"
          aria-label="Profile"
          className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-fuchsia-500/80 text-white ring-2 ring-border hover:ring-primary/60"
        >
          <User className="size-4" aria-hidden />
        </button>
      </div>
    </header>
  )
}
