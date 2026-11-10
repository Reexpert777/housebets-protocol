'use client'

import { useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Banknote,
  CircleCheck,
  History,
  LoaderCircle,
  Lock,
  Receipt,
  Ticket,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  FEATURED_MATCH_ID,
  MATCHES,
  MATCH_MARKET_GROUPS,
  formatUSDT,
} from '@/lib/sportsbook/data'
import { useSportsbook, type PlacedBet, type SlipItem } from '@/lib/sportsbook/store'
import { LiveBadge } from './shared'

const QUICK_STAKES = [10, 50, 100] as const

function baseOddsFor(selId: string, fallback: number) {
  const [matchId, marketId, key] = selId.split(':')
  const match = MATCHES.find((m) => m.id === matchId)
  if (!match) return fallback
  if (marketId === '1x2' && key in match.odds) return match.odds[key as 'home' | 'draw' | 'away'] ?? fallback
  if (matchId === FEATURED_MATCH_ID) {
    for (const g of MATCH_MARKET_GROUPS)
      for (const m of g.markets) if (m.id === marketId) return m.outcomes.find((o) => o.key === key)?.odds ?? fallback
  }
  return fallback
}

export function BetSlipPanel({ variant = 'sidebar' }: { variant?: 'sidebar' | 'sheet' | 'page' }) {
  const { slipTab, setSlipTab, slip, myBets } = useSportsbook()
  const openCount = myBets.filter((b) => b.status === 'open').length

  return (
    <div className={cn('flex min-h-0 flex-col', variant !== 'page' && 'h-full')}>
      <div role="tablist" aria-label="Bet slip" className="grid shrink-0 grid-cols-2 gap-1 rounded-lg bg-background p-1">
        <TabButton active={slipTab === 'slip'} onClick={() => setSlipTab('slip')} icon={Ticket} label="Bet Slip" count={slip.length} />
        <TabButton active={slipTab === 'bets'} onClick={() => setSlipTab('bets')} icon={Receipt} label="My Bets" count={openCount} />
      </div>
      <div className={cn('mt-3 flex min-h-0 flex-1 flex-col', variant !== 'page' && 'overflow-hidden')}>
        {slipTab === 'slip' ? <SlipContent variant={variant} /> : <MyBets />}
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Ticket
  label: string
  count: number
}) {
  return (
    <button
      role="tab"
      type="button"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'flex h-9 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors',
        active ? 'bg-surface-2 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <Icon className="size-4" aria-hidden />
      {label}
      {count > 0 && (
        <span
          className={cn(
            'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[11px] font-bold',
            active ? 'bg-primary text-primary-foreground' : 'bg-accent text-foreground',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function SlipContent({ variant }: { variant: 'sidebar' | 'sheet' | 'page' }) {
  const {
    slip,
    confirmation,
    dismissConfirmation,
    getOdds,
    isSuspended,
    acceptOddsChanges,
    placeBets,
    placing,
    clearSlip,
    balance,
    setSlipTab,
  } = useSportsbook()

  if (confirmation) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-primary/30 bg-primary/5 p-5 text-center animate-in fade-in zoom-in-95">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <CircleCheck className="size-8" aria-hidden />
        </span>
        <h3 className="mt-3 text-lg font-semibold text-foreground">Bet Placed</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {confirmation.bets.length} single{confirmation.bets.length > 1 ? 's' : ''} confirmed on-chain.
        </p>
        <ul className="mt-4 w-full space-y-2 text-left">
          {confirmation.bets.map((b) => (
            <li key={b.id} className="rounded-lg bg-surface-2 p-3">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium text-foreground">{b.outcomeLabel}</span>
                <span className="font-mono font-semibold text-primary">{b.odds.toFixed(2)}</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {b.marketName} · {b.matchLabel}
              </p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">Ref {b.id}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 w-full space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Total stake</dt>
            <dd className="font-mono text-foreground">{formatUSDT(confirmation.totalStake)} USDT</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Potential return</dt>
            <dd className="font-mono font-semibold text-up">{formatUSDT(confirmation.totalReturn)} USDT</dd>
          </div>
        </dl>
        <div className="mt-5 grid w-full grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              dismissConfirmation()
              setSlipTab('bets')
            }}
            className="h-10 rounded-lg border border-border bg-surface-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            View My Bets
          </button>
          <button
            type="button"
            onClick={dismissConfirmation}
            className="h-10 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  if (!slip.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-muted-foreground">
          <Ticket className="size-6" aria-hidden />
        </span>
        <p className="mt-3 text-sm font-medium text-foreground">Your bet slip is empty</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Tap any odds across Housebets to add a selection as a single bet.
        </p>
      </div>
    )
  }

  const rows = slip.map((s) => {
    const current = getOdds(s.id, s.baseOdds)
    const stake = parseFloat(s.stake) || 0
    return { item: s, current, stake, changed: current !== s.acceptedOdds, suspended: isSuspended(s.id) }
  })
  const totalStake = rows.reduce((a, r) => a + r.stake, 0)
  const totalReturn = rows.reduce((a, r) => a + r.stake * r.item.acceptedOdds, 0)
  const anyChanged = rows.some((r) => r.changed)
  const anySuspended = rows.some((r) => r.suspended && r.stake > 0)
  const insufficient = totalStake > balance

  const stakedCount = rows.filter((r) => r.stake > 0).length
  let cta = `Place ${stakedCount} Bet${stakedCount === 1 ? '' : 's'}`
  let disabled = placing || totalStake <= 0
  if (totalStake <= 0) cta = 'Enter a stake'
  if (insufficient) {
    cta = 'Insufficient balance'
    disabled = true
  }
  if (anySuspended) {
    cta = 'Selection suspended'
    disabled = true
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium uppercase tracking-wider text-muted-foreground">
          Singles · {slip.length}
        </span>
        <button
          type="button"
          onClick={clearSlip}
          className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-down"
        >
          <Trash2 className="size-3.5" aria-hidden />
          Clear all
        </button>
      </div>
      <ul className={cn('space-y-2', variant !== 'page' && 'min-h-0 flex-1 overflow-y-auto pr-1')}>
        {rows.map((r) => (
          <SlipCard key={r.item.id} item={r.item} current={r.current} changed={r.changed} suspended={r.suspended} />
        ))}
      </ul>

      <div className="mt-3 shrink-0 space-y-3 border-t border-border pt-3">
        {anyChanged && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-200">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-yellow-400" aria-hidden />
            <div className="flex-1">
              <p className="font-semibold text-yellow-300">Odds Changed</p>
              <p className="mt-0.5 leading-relaxed text-yellow-200/80">
                One or more prices moved. Accept the new odds to continue.
              </p>
            </div>
          </div>
        )}
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Total stake</dt>
            <dd className="font-mono text-foreground">{formatUSDT(totalStake)} USDT</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Potential return</dt>
            <dd className="font-mono text-base font-semibold text-up">{formatUSDT(totalReturn)} USDT</dd>
          </div>
        </dl>
        {anyChanged ? (
          <button
            type="button"
            onClick={acceptOddsChanges}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-yellow-400 text-sm font-bold text-black transition-colors hover:bg-yellow-300"
          >
            Accept Odds Changes
          </button>
        ) : (
          <button
            type="button"
            onClick={placeBets}
            disabled={disabled}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted-foreground"
          >
            {placing && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
            {placing ? 'Placing bets…' : cta}
            {!placing && totalStake > 0 && !disabled && (
              <span className="font-mono font-semibold opacity-80">· {formatUSDT(totalStake)} USDT</span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function SlipCard({
  item,
  current,
  changed,
  suspended,
}: {
  item: SlipItem
  current: number
  changed: boolean
  suspended: boolean
}) {
  const { removeSelection, setStake, addStake } = useSportsbook()
  const stake = parseFloat(item.stake) || 0
  const potential = stake * item.acceptedOdds
  const up = current > item.acceptedOdds
  const isLive = MATCHES.find((m) => m.id === item.matchId)?.status === 'live'

  return (
    <li
      className={cn(
        'rounded-lg border bg-surface-2 p-3 transition-colors animate-in fade-in slide-in-from-right-2',
        suspended ? 'border-border/60 opacity-80' : changed ? 'border-yellow-500/40' : 'border-border',
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isLive && <LiveBadge />}
            <p className="truncate text-sm font-semibold text-foreground">{item.outcomeLabel}</p>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.marketName}</p>
          <p className="truncate text-xs text-muted-foreground">{item.matchLabel}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            {changed && !suspended && (
              <span className="font-mono text-xs text-muted-foreground line-through">{item.acceptedOdds.toFixed(2)}</span>
            )}
            <span
              className={cn(
                'flex items-center gap-0.5 font-mono text-sm font-bold',
                suspended ? 'text-muted-foreground' : changed ? (up ? 'text-up' : 'text-down') : 'text-primary',
              )}
            >
              {changed && !suspended && (up ? <ArrowUp className="size-3" aria-hidden /> : <ArrowDown className="size-3" aria-hidden />)}
              {current.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => removeSelection(item.id)}
          aria-label={`Remove ${item.outcomeLabel}`}
          className="-mr-1 -mt-1 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      {suspended ? (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-background px-3 py-2 text-xs font-medium text-muted-foreground">
          <Lock className="size-3.5" aria-hidden />
          Selection Suspended
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center gap-2">
            <label className="relative flex-1">
              <span className="sr-only">Stake in USDT for {item.outcomeLabel}</span>
              <input
                inputMode="decimal"
                placeholder="0.00"
                value={item.stake}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, '')
                  if (/^\d*\.?\d{0,2}$/.test(v)) setStake(item.id, v)
                }}
                className="h-10 w-full rounded-md border border-input bg-background pl-3 pr-14 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                USDT
              </span>
            </label>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {QUICK_STAKES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => addStake(item.id, q)}
                className="h-8 rounded-md bg-background font-mono text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                +{q}
              </button>
            ))}
            <button
              type="button"
              onClick={() => addStake(item.id, 'max')}
              className="h-8 rounded-md bg-primary/10 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
            >
              MAX
            </button>
          </div>
          <div className="mt-2 flex justify-between text-xs">
            <span className="text-muted-foreground">Potential return</span>
            <span className="font-mono font-semibold text-foreground">{formatUSDT(potential)} USDT</span>
          </div>
        </>
      )}
    </li>
  )
}

type BetsTab = 'open' | 'cashout' | 'settled'

function MyBets() {
  const { myBets } = useSportsbook()
  const [tab, setTab] = useState<BetsTab>('open')
  const open = myBets.filter((b) => b.status === 'open')
  const settled = myBets.filter((b) => b.status !== 'open')
  const list = tab === 'settled' ? settled : open

  const tabs: { id: BetsTab; label: string; count: number }[] = [
    { id: 'open', label: 'Open', count: open.length },
    { id: 'cashout', label: 'Cash Out', count: open.length },
    { id: 'settled', label: 'Settled', count: settled.length },
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div role="tablist" aria-label="My bets filter" className="flex shrink-0 gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
              tab === t.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
            <span className="font-mono text-[11px] text-muted-foreground">{t.count}</span>
          </button>
        ))}
      </div>
      <ul className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {list.length === 0 && (
          <li className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-10 text-center">
            <History className="size-6 text-muted-foreground" aria-hidden />
            <p className="mt-2 text-sm text-muted-foreground">No bets here yet.</p>
          </li>
        )}
        {list.map((b) => (
          <BetCard key={b.id} bet={b} mode={tab} />
        ))}
      </ul>
    </div>
  )
}

function BetCard({ bet, mode }: { bet: PlacedBet; mode: BetsTab }) {
  const { getOdds, isSuspended, cashOut } = useSportsbook()
  const [confirming, setConfirming] = useState(false)
  const current = getOdds(bet.selectionId, baseOddsFor(bet.selectionId, bet.odds))
  const cashOutValue = Math.round(((bet.stake * bet.odds) / current) * 0.94 * 100) / 100
  const potential = bet.stake * bet.odds
  const suspended = isSuspended(bet.selectionId)
  const match = MATCHES.find((m) => m.id === bet.matchId)

  const statusStyles: Record<PlacedBet['status'], string> = {
    open: 'bg-primary/10 text-primary',
    won: 'bg-up/15 text-up',
    lost: 'bg-down/15 text-down',
    cashed: 'bg-yellow-400/15 text-yellow-300',
  }
  const statusLabel: Record<PlacedBet['status'], string> = {
    open: 'Open',
    won: 'Won',
    lost: 'Lost',
    cashed: 'Cashed Out',
  }

  return (
    <li className="rounded-lg border border-border bg-surface-2 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', statusStyles[bet.status])}>
          {statusLabel[bet.status]}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {bet.id} · {bet.placedAt}
        </span>
      </div>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{bet.outcomeLabel}</p>
          <p className="truncate text-xs text-muted-foreground">
            {bet.marketName} · {bet.matchLabel}
          </p>
          {match?.status === 'live' && bet.status === 'open' && (
            <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <LiveBadge />
              <span className="font-mono">
                {match.score?.[0]} - {match.score?.[1]}
              </span>
            </p>
          )}
        </div>
        <span className="font-mono text-sm font-bold text-primary">{bet.odds.toFixed(2)}</span>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Stake</dt>
          <dd className="font-mono text-foreground">{formatUSDT(bet.stake)} USDT</dd>
        </div>
        <div className="text-right">
          <dt className="text-muted-foreground">{bet.status === 'open' ? 'Potential return' : 'Returned'}</dt>
          <dd className={cn('font-mono font-semibold', bet.status === 'lost' ? 'text-down' : 'text-up')}>
            {formatUSDT(bet.status === 'open' ? potential : (bet.payout ?? 0))} USDT
          </dd>
        </div>
      </dl>
      {bet.status === 'open' && mode !== 'settled' && (
        <div className="mt-3">
          {suspended ? (
            <div className="flex h-10 items-center justify-center gap-2 rounded-md bg-background text-xs font-medium text-muted-foreground">
              <Lock className="size-3.5" aria-hidden />
              Cash Out Suspended
            </div>
          ) : confirming ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="h-10 rounded-md border border-border text-xs font-medium text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => cashOut(bet.id, cashOutValue)}
                className="h-10 rounded-md bg-yellow-400 text-xs font-bold text-black hover:bg-yellow-300"
              >
                Confirm {formatUSDT(cashOutValue)}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className={cn(
                'flex h-10 w-full items-center justify-center gap-2 rounded-md text-xs font-bold transition-colors',
                mode === 'cashout'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border border-primary/40 text-primary hover:bg-primary/10',
              )}
            >
              <Banknote className="size-4" aria-hidden />
              Cash Out <span className="font-mono">{formatUSDT(cashOutValue)} USDT</span>
            </button>
          )}
        </div>
      )}
    </li>
  )
}
