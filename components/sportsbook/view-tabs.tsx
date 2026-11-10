'use client'

import { House, Radio, Ticket, Tv, Volleyball, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FEATURED_MATCH_ID, getMatch } from '@/lib/sportsbook/data'
import { useSportsbook, type View } from '@/lib/sportsbook/store'

export function ViewTabs() {
  const { view, navigate, openMatch, matchId, slip, setSlipTab } = useSportsbook()
  const match = getMatch(view === 'match' ? matchId : FEATURED_MATCH_ID)

  const tabs: { id: View; label: string; icon: LucideIcon; onClick: () => void; extra?: React.ReactNode }[] = [
    { id: 'home', label: 'Sports Home', icon: House, onClick: () => navigate('home') },
    { id: 'live', label: 'Live', icon: Radio, onClick: () => navigate('live', { sport: 'all' }) },
    { id: 'football', label: 'Football', icon: Volleyball, onClick: () => navigate('football') },
    {
      id: 'match',
      label: `${match.homeShort} v ${match.awayShort}`,
      icon: Tv,
      onClick: () => openMatch(view === 'match' ? matchId : FEATURED_MATCH_ID),
      extra: match.status === 'live' ? <span className="size-1.5 animate-pulse rounded-full bg-down" aria-hidden /> : null,
    },
    {
      id: 'bets',
      label: 'Bet Slip & My Bets',
      icon: Ticket,
      onClick: () => {
        setSlipTab('slip')
        navigate('bets')
      },
      extra:
        slip.length > 0 ? (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-bold text-primary-foreground">
            {slip.length}
          </span>
        ) : null,
    },
  ]

  return (
    <div className="sticky top-14 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div role="tablist" aria-label="Page switcher" className="no-scrollbar flex gap-1 overflow-x-auto px-3 py-2 md:px-6">
        {tabs.map((t) => {
          const active = view === t.id
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={t.onClick}
              className={cn(
                'flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <t.icon className="size-4" aria-hidden />
              {t.label}
              {t.extra}
            </button>
          )
        })}
      </div>
    </div>
  )
}
