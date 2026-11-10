'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  FEATURED_MATCH_ID,
  INITIALLY_SUSPENDED,
  MATCHES,
  MATCH_MARKET_GROUPS,
  selectionId,
  type SportId,
} from './data'

export type View = 'home' | 'live' | 'football' | 'match' | 'bets'

export type OddsState = { value: number; dir: 'up' | 'down'; changedAt: number }

export type SlipItem = {
  id: string
  matchId: string
  matchLabel: string
  marketName: string
  outcomeLabel: string
  baseOdds: number
  acceptedOdds: number
  stake: string
}

export type BetStatus = 'open' | 'won' | 'lost' | 'cashed'

export type PlacedBet = {
  id: string
  matchId: string
  matchLabel: string
  marketName: string
  outcomeLabel: string
  selectionId: string
  odds: number
  stake: number
  status: BetStatus
  placedAt: string
  payout?: number
}

export type Confirmation = { bets: PlacedBet[]; totalStake: number; totalReturn: number }

export type AddSelectionInput = {
  id: string
  matchId: string
  matchLabel: string
  marketName: string
  outcomeLabel: string
  odds: number
}

const TICKABLE: { id: string; base: number }[] = (() => {
  const list: { id: string; base: number }[] = []
  for (const m of MATCHES) {
    if (m.status !== 'live') continue
    list.push({ id: selectionId(m.id, '1x2', 'home'), base: m.odds.home })
    if (m.odds.draw) list.push({ id: selectionId(m.id, '1x2', 'draw'), base: m.odds.draw })
    list.push({ id: selectionId(m.id, '1x2', 'away'), base: m.odds.away })
  }
  for (const g of MATCH_MARKET_GROUPS) {
    for (const mk of g.markets) {
      if (mk.id === '1x2') continue
      for (const o of mk.outcomes) list.push({ id: selectionId(FEATURED_MATCH_ID, mk.id, o.key), base: o.odds })
    }
  }
  return list
})()

const SUSPENDABLE_MARKETS = MATCH_MARKET_GROUPS.flatMap((g) => g.markets)
  .filter((m) => m.id !== '1x2')
  .map((m) => m.outcomes.map((o) => selectionId(FEATURED_MATCH_ID, m.id, o.key)))

const INITIAL_BETS: PlacedBet[] = [
  { id: 'HB-48213', matchId: 'liv-new', matchLabel: 'Liverpool vs Newcastle', marketName: 'Match Result', outcomeLabel: 'Liverpool', selectionId: 'liv-new:1x2:home', odds: 1.95, stake: 50, status: 'open', placedAt: 'Today 18:52' },
  { id: 'HB-48190', matchId: 'int-nap', matchLabel: 'Inter vs Napoli', marketName: 'Match Result', outcomeLabel: 'Draw', selectionId: 'int-nap:1x2:draw', odds: 3.2, stake: 25, status: 'open', placedAt: 'Today 18:40' },
  { id: 'HB-47911', matchId: 'x', matchLabel: 'Chelsea vs Everton', marketName: 'Both Teams to Score', outcomeLabel: 'Yes', selectionId: 'x', odds: 1.8, stake: 100, status: 'won', placedAt: 'Yesterday 21:10', payout: 180 },
  { id: 'HB-47820', matchId: 'x', matchLabel: 'Juventus vs Torino', marketName: 'Match Result', outcomeLabel: 'Juventus', selectionId: 'x', odds: 1.65, stake: 40, status: 'lost', placedAt: 'Yesterday 19:45', payout: 0 },
  { id: 'HB-47702', matchId: 'x', matchLabel: 'Lakers vs Suns', marketName: 'Moneyline', outcomeLabel: 'Lakers', selectionId: 'x', odds: 2.1, stake: 30, status: 'cashed', placedAt: '08 Nov 02:15', payout: 41.2 },
]

function round2(n: number) {
  return Math.round(n * 100) / 100
}

type Ctx = ReturnType<typeof useSportsbookState>
const SportsbookContext = createContext<Ctx | null>(null)

function useSportsbookState() {
  const [view, setView] = useState<View>('home')
  const [matchId, setMatchId] = useState<string>(FEATURED_MATCH_ID)
  const [balance, setBalance] = useState(2480.5)
  const [clocks, setClocks] = useState<Record<string, number>>(() =>
    Object.fromEntries(MATCHES.filter((m) => m.status === 'live').map((m) => [m.id, m.clock ?? 0])),
  )
  const [odds, setOdds] = useState<Record<string, OddsState>>({})
  const [suspended, setSuspended] = useState<Set<string>>(() => new Set(INITIALLY_SUSPENDED))
  const [slip, setSlip] = useState<SlipItem[]>([])
  const [slipTab, setSlipTab] = useState<'slip' | 'bets'>('slip')
  const [myBets, setMyBets] = useState<PlacedBet[]>(INITIAL_BETS)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [placing, setPlacing] = useState(false)
  const [followed, setFollowed] = useState<Set<string>>(() => new Set(['Arsenal', 'epl']))
  const [mobileSlipOpen, setMobileSlipOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [liveSport, setLiveSport] = useState<SportId | 'all'>('all')
  const [liveCompetition, setLiveCompetition] = useState<string>('all')
  const [now, setNow] = useState(0)

  const slipRef = useRef(slip)
  slipRef.current = slip
  const oddsRef = useRef(odds)
  oddsRef.current = odds

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setNow(Date.now())
      setClocks((prev) => {
        const next: Record<string, number> = {}
        for (const k in prev) next[k] = prev[k] + 1
        return next
      })
    }, 1000)

    const oddsTimer = setInterval(() => {
      const picks = new Set<string>()
      const slipIds = slipRef.current.map((s) => s.id).filter((id) => TICKABLE.some((t) => t.id === id))
      if (slipIds.length && Math.random() < 0.35) picks.add(slipIds[Math.floor(Math.random() * slipIds.length)])
      while (picks.size < 4) picks.add(TICKABLE[Math.floor(Math.random() * TICKABLE.length)].id)

      const stamp = Date.now()
      setOdds((prev) => {
        const next = { ...prev }
        for (const id of picks) {
          const base = TICKABLE.find((t) => t.id === id)!.base
          const current = prev[id]?.value ?? base
          const up = Math.random() > 0.5
          const factor = 1 + (up ? 1 : -1) * (0.02 + Math.random() * 0.07)
          const value = Math.max(1.01, round2(current * factor))
          if (value === current) continue
          next[id] = { value, dir: value > current ? 'up' : 'down', changedAt: stamp }
        }
        return next
      })

      if (Math.random() < 0.3) {
        const market = SUSPENDABLE_MARKETS[Math.floor(Math.random() * SUSPENDABLE_MARKETS.length)]
        setSuspended((prev) => {
          const next = new Set(prev)
          const isSuspended = market.every((id) => next.has(id))
          for (const id of market) {
            if (isSuspended) next.delete(id)
            else next.add(id)
          }
          return next
        })
      }
    }, 2500)

    return () => {
      clearInterval(clockTimer)
      clearInterval(oddsTimer)
    }
  }, [])

  const getOdds = useCallback((id: string, base: number) => odds[id]?.value ?? base, [odds])

  const getMovement = useCallback(
    (id: string): 'up' | 'down' | null => {
      const o = odds[id]
      if (!o || now - o.changedAt > 2400) return null
      return o.dir
    },
    [odds, now],
  )

  const isSuspended = useCallback((id: string) => suspended.has(id), [suspended])

  const toggleSelection = useCallback((input: AddSelectionInput) => {
    setConfirmation(null)
    setSlipTab('slip')
    setSlip((prev) => {
      if (prev.some((s) => s.id === input.id)) return prev.filter((s) => s.id !== input.id)
      const current = oddsRef.current[input.id]?.value ?? input.odds
      return [
        ...prev,
        {
          id: input.id,
          matchId: input.matchId,
          matchLabel: input.matchLabel,
          marketName: input.marketName,
          outcomeLabel: input.outcomeLabel,
          baseOdds: input.odds,
          acceptedOdds: current,
          stake: '',
        },
      ]
    })
  }, [])

  const removeSelection = useCallback((id: string) => setSlip((p) => p.filter((s) => s.id !== id)), [])
  const clearSlip = useCallback(() => setSlip([]), [])

  const setStake = useCallback((id: string, stake: string) => {
    setSlip((p) => p.map((s) => (s.id === id ? { ...s, stake } : s)))
  }, [])

  const addStake = useCallback(
    (id: string, amount: number | 'max') => {
      setSlip((p) => {
        const othersTotal = p.filter((s) => s.id !== id).reduce((sum, s) => sum + (parseFloat(s.stake) || 0), 0)
        const available = Math.max(0, round2(balance - othersTotal))
        return p.map((s) => {
          if (s.id !== id) return s
          const next = amount === 'max' ? available : Math.min(available, round2((parseFloat(s.stake) || 0) + amount))
          return { ...s, stake: String(next) }
        })
      })
    },
    [balance],
  )

  const acceptOddsChanges = useCallback(() => {
    setSlip((p) => p.map((s) => ({ ...s, acceptedOdds: oddsRef.current[s.id]?.value ?? s.baseOdds })))
  }, [])

  const placeBets = useCallback(() => {
    const items = slipRef.current.filter((s) => (parseFloat(s.stake) || 0) > 0)
    if (!items.length) return
    setPlacing(true)
    setTimeout(() => {
      const bets: PlacedBet[] = items.map((s, i) => ({
        id: `HB-${48300 + Math.floor(Math.random() * 600) + i}`,
        matchId: s.matchId,
        matchLabel: s.matchLabel,
        marketName: s.marketName,
        outcomeLabel: s.outcomeLabel,
        selectionId: s.id,
        odds: s.acceptedOdds,
        stake: round2(parseFloat(s.stake)),
        status: 'open',
        placedAt: 'Just now',
      }))
      const totalStake = round2(bets.reduce((a, b) => a + b.stake, 0))
      const totalReturn = round2(bets.reduce((a, b) => a + b.stake * b.odds, 0))
      setBalance((b) => round2(b - totalStake))
      setMyBets((prev) => [...bets, ...prev])
      setSlip([])
      setConfirmation({ bets, totalStake, totalReturn })
      setPlacing(false)
    }, 1100)
  }, [])

  const cashOut = useCallback((betId: string, value: number) => {
    setMyBets((prev) => prev.map((b) => (b.id === betId ? { ...b, status: 'cashed', payout: value } : b)))
    setBalance((b) => round2(b + value))
  }, [])

  const toggleFollow = useCallback((key: string) => {
    setFollowed((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const openMatch = useCallback((id: string) => {
    setMatchId(id)
    setView('match')
    setNavOpen(false)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const navigate = useCallback((v: View, opts?: { sport?: SportId | 'all' }) => {
    setView(v)
    setNavOpen(false)
    if (opts?.sport) {
      setLiveSport(opts.sport)
      setLiveCompetition('all')
    }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return {
    view,
    navigate,
    matchId,
    openMatch,
    balance,
    clocks,
    getOdds,
    getMovement,
    isSuspended,
    slip,
    slipTab,
    setSlipTab,
    toggleSelection,
    removeSelection,
    clearSlip,
    setStake,
    addStake,
    acceptOddsChanges,
    placeBets,
    placing,
    confirmation,
    dismissConfirmation: () => setConfirmation(null),
    myBets,
    cashOut,
    followed,
    toggleFollow,
    mobileSlipOpen,
    setMobileSlipOpen,
    navOpen,
    setNavOpen,
    liveSport,
    setLiveSport,
    liveCompetition,
    setLiveCompetition,
  }
}

export function SportsbookProvider({ children }: { children: React.ReactNode }) {
  const value = useSportsbookState()
  return <SportsbookContext.Provider value={value}>{children}</SportsbookContext.Provider>
}

export function useSportsbook() {
  const ctx = useContext(SportsbookContext)
  if (!ctx) throw new Error('useSportsbook must be used inside SportsbookProvider')
  return ctx
}

export function useSlipIds() {
  const { slip } = useSportsbook()
  return useMemo(() => new Set(slip.map((s) => s.id)), [slip])
}
