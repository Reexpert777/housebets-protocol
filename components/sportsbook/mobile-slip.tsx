'use client'

import { useEffect } from 'react'
import { ChevronDown, ChevronUp, Ticket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatUSDT } from '@/lib/sportsbook/data'
import { useSportsbook } from '@/lib/sportsbook/store'
import { BetSlipPanel } from './bet-slip'

export function MobileSlip() {
  const { slip, mobileSlipOpen, setMobileSlipOpen, getOdds, confirmation, view } = useSportsbook()

  useEffect(() => {
    if (!mobileSlipOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileSlipOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileSlipOpen, setMobileSlipOpen])

  if (view === 'bets') return null

  const totalStake = slip.reduce((a, s) => a + (parseFloat(s.stake) || 0), 0)
  const totalReturn = slip.reduce((a, s) => a + (parseFloat(s.stake) || 0) * s.acceptedOdds, 0)
  const lastOdds = slip.length ? getOdds(slip[slip.length - 1].id, slip[slip.length - 1].baseOdds) : null

  return (
    <div className="xl:hidden">
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 transition-opacity',
          mobileSlipOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileSlipOpen(false)}
        aria-hidden
      />
      <section
        aria-label="Bet slip"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-xl flex-col rounded-t-2xl border border-b-0 border-border bg-surface shadow-[0_-12px_40px_rgba(0,0,0,0.5)] transition-[max-height] duration-300 ease-out',
          mobileSlipOpen ? 'max-h-[85dvh]' : 'max-h-16',
        )}
      >
        <button
          type="button"
          onClick={() => setMobileSlipOpen(!mobileSlipOpen)}
          aria-expanded={mobileSlipOpen}
          className="flex h-16 shrink-0 items-center gap-3 px-4"
        >
          <span className="relative flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Ticket className="size-5" aria-hidden />
            {slip.length > 0 && (
              <span
                key={slip.length}
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-foreground font-mono text-[10px] font-bold text-background animate-in zoom-in"
              >
                {slip.length}
              </span>
            )}
          </span>
          <span className="flex min-w-0 flex-1 flex-col items-start">
            <span className="text-sm font-semibold text-foreground">
              {confirmation ? 'Bet Placed!' : slip.length ? `Bet Slip · ${slip.length} single${slip.length > 1 ? 's' : ''}` : 'Bet Slip'}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {slip.length === 0
                ? 'Tap odds to add selections'
                : totalStake > 0
                  ? `Return ${formatUSDT(totalReturn)} USDT`
                  : `Latest @ ${lastOdds?.toFixed(2)} · add a stake`}
            </span>
          </span>
          {mobileSlipOpen ? (
            <ChevronDown className="size-5 text-muted-foreground" aria-hidden />
          ) : (
            <ChevronUp className="size-5 text-muted-foreground" aria-hidden />
          )}
        </button>
        <div className={cn('flex min-h-0 flex-1 flex-col px-4 pb-4', !mobileSlipOpen && 'hidden')}>
          <BetSlipPanel variant="sheet" />
        </div>
      </section>
    </div>
  )
}
