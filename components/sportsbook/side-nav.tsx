'use client'

import { BadgePercent, House, Radio, Receipt, Star, X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COMPETITIONS, MATCHES, SPORTS, type SportId } from '@/lib/sportsbook/data'
import { useSportsbook, type View } from '@/lib/sportsbook/store'
import { SPORT_ICONS } from './shared'
import { Logo } from './top-bar'

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
  live,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick: () => void
  badge?: number
  live?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="flex-1 truncate text-left">{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            'rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold',
            live ? 'bg-down/15 text-down' : 'bg-sidebar-accent text-muted-foreground',
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

function NavContent() {
  const { view, navigate, liveSport, followed, myBets, setSlipTab } = useSportsbook()
  const liveCount = MATCHES.filter((m) => m.status === 'live').length
  const sportCount = (s: SportId) => MATCHES.filter((m) => m.sport === s).length
  const favorites = COMPETITIONS.filter((c) => followed.has(c.id))

  const isActive = (v: View) => view === v

  return (
    <nav aria-label="Sports" className="flex flex-col gap-1 p-3">
      <NavItem icon={House} label="Sports Home" active={isActive('home')} onClick={() => navigate('home')} />
      <NavItem
        icon={Radio}
        label="Live"
        badge={liveCount}
        live
        active={isActive('live') && liveSport === 'all'}
        onClick={() => navigate('live', { sport: 'all' })}
      />
      <NavItem
        icon={Receipt}
        label="My Bets"
        badge={myBets.filter((b) => b.status === 'open').length}
        active={isActive('bets')}
        onClick={() => {
          setSlipTab('bets')
          navigate('bets')
        }}
      />

      <p className="mb-1 mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Sports</p>
      {SPORTS.map((s) => (
        <NavItem
          key={s.id}
          icon={SPORT_ICONS[s.id]}
          label={s.name}
          badge={sportCount(s.id)}
          active={
            s.id === 'football' ? isActive('football') || isActive('match') : isActive('live') && liveSport === s.id
          }
          onClick={() => (s.id === 'football' ? navigate('football') : navigate('live', { sport: s.id }))}
        />
      ))}

      {favorites.length > 0 && (
        <>
          <p className="mb-1 mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Favourites
          </p>
          {favorites.map((c) => (
            <NavItem key={c.id} icon={Star} label={c.name} onClick={() => navigate('football')} />
          ))}
        </>
      )}

      <div className="mt-4 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 to-transparent p-4">
        <BadgePercent className="size-5 text-primary" aria-hidden />
        <p className="mt-2 text-sm font-semibold text-foreground">Weekend Odds Boost</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          +25% on all Premier League singles up to 500 USDT.
        </p>
      </div>
    </nav>
  )
}

export function SideNav() {
  const { navOpen, setNavOpen } = useSportsbook()

  return (
    <>
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar lg:block">
        <NavContent />
      </aside>

      <div
        className={cn('fixed inset-0 z-50 lg:hidden', navOpen ? 'pointer-events-auto' : 'pointer-events-none')}
        aria-hidden={!navOpen}
      >
        <div
          className={cn('absolute inset-0 bg-black/60 transition-opacity', navOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setNavOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className={cn(
            'absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-sidebar shadow-2xl transition-transform duration-300',
            navOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
            <Logo />
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              aria-label="Close navigation"
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          {navOpen && <NavContent />}
        </div>
      </div>
    </>
  )
}
