export type SportId = 'football' | 'basketball' | 'tennis' | 'esports' | 'hockey'

export type Sport = { id: SportId; name: string }

export const SPORTS: Sport[] = [
  { id: 'football', name: 'Football' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'tennis', name: 'Tennis' },
  { id: 'esports', name: 'Esports' },
  { id: 'hockey', name: 'Ice Hockey' },
]

export type Competition = {
  id: string
  name: string
  sport: SportId
  region: string
  short: string
}

export const COMPETITIONS: Competition[] = [
  { id: 'epl', name: 'Premier League', sport: 'football', region: 'England', short: 'EPL' },
  { id: 'ucl', name: 'Champions League', sport: 'football', region: 'Europe', short: 'UCL' },
  { id: 'laliga', name: 'LaLiga', sport: 'football', region: 'Spain', short: 'LAL' },
  { id: 'seriea', name: 'Serie A', sport: 'football', region: 'Italy', short: 'SEA' },
  { id: 'bundesliga', name: 'Bundesliga', sport: 'football', region: 'Germany', short: 'BUN' },
  { id: 'nba', name: 'NBA', sport: 'basketball', region: 'USA', short: 'NBA' },
  { id: 'euroleague', name: 'EuroLeague', sport: 'basketball', region: 'Europe', short: 'EUL' },
  { id: 'atp', name: 'ATP Finals', sport: 'tennis', region: 'Italy', short: 'ATP' },
  { id: 'lec', name: 'LoL World Championship', sport: 'esports', region: 'International', short: 'LOL' },
  { id: 'cs2', name: 'CS2 Major', sport: 'esports', region: 'International', short: 'CS2' },
  { id: 'nhl', name: 'NHL', sport: 'hockey', region: 'USA', short: 'NHL' },
]

export type MatchStatus = 'live' | 'upcoming'

export type Match = {
  id: string
  sport: SportId
  competitionId: string
  home: string
  away: string
  homeShort: string
  awayShort: string
  status: MatchStatus
  /** live clock in seconds (counting up) */
  clock?: number
  period?: string
  score?: [number, number]
  /** minutes from "now" until kickoff for upcoming matches */
  startsIn?: number
  odds: { home: number; draw?: number; away: number }
  markets: number
}

export const MATCHES: Match[] = [
  // Live football
  { id: 'ars-bha', sport: 'football', competitionId: 'epl', home: 'Arsenal', away: 'Brighton', homeShort: 'ARS', awayShort: 'BHA', status: 'live', clock: 63 * 60 + 12, period: '2H', score: [2, 1], odds: { home: 1.32, draw: 5.4, away: 9.5 }, markets: 214 },
  { id: 'liv-new', sport: 'football', competitionId: 'epl', home: 'Liverpool', away: 'Newcastle', homeShort: 'LIV', awayShort: 'NEW', status: 'live', clock: 27 * 60 + 40, period: '1H', score: [0, 0], odds: { home: 1.85, draw: 3.6, away: 4.2 }, markets: 188 },
  { id: 'rma-sev', sport: 'football', competitionId: 'laliga', home: 'Real Madrid', away: 'Sevilla', homeShort: 'RMA', awayShort: 'SEV', status: 'live', clock: 78 * 60 + 5, period: '2H', score: [3, 0], odds: { home: 1.01, draw: 21, away: 101 }, markets: 96 },
  { id: 'int-nap', sport: 'football', competitionId: 'seriea', home: 'Inter', away: 'Napoli', homeShort: 'INT', awayShort: 'NAP', status: 'live', clock: 41 * 60 + 22, period: '1H', score: [1, 1], odds: { home: 2.45, draw: 2.9, away: 3.4 }, markets: 152 },
  { id: 'bvb-lev', sport: 'football', competitionId: 'bundesliga', home: 'Dortmund', away: 'Leverkusen', homeShort: 'BVB', awayShort: 'B04', status: 'live', clock: 12 * 60 + 3, period: '1H', score: [0, 1], odds: { home: 3.1, draw: 3.75, away: 2.15 }, markets: 140 },
  // Live other sports
  { id: 'lal-bos', sport: 'basketball', competitionId: 'nba', home: 'LA Lakers', away: 'Boston Celtics', homeShort: 'LAL', awayShort: 'BOS', status: 'live', clock: 7 * 60 + 48, period: 'Q3', score: [78, 81], odds: { home: 2.1, away: 1.74 }, markets: 86 },
  { id: 'gsw-den', sport: 'basketball', competitionId: 'nba', home: 'Golden State', away: 'Denver', homeShort: 'GSW', awayShort: 'DEN', status: 'live', clock: 2 * 60 + 15, period: 'Q1', score: [12, 9], odds: { home: 1.95, away: 1.88 }, markets: 74 },
  { id: 'sin-alc', sport: 'tennis', competitionId: 'atp', home: 'J. Sinner', away: 'C. Alcaraz', homeShort: 'SIN', awayShort: 'ALC', status: 'live', clock: 84 * 60, period: 'Set 2', score: [1, 0], odds: { home: 1.42, away: 2.8 }, markets: 42 },
  { id: 't1-geng', sport: 'esports', competitionId: 'lec', home: 'T1', away: 'Gen.G', homeShort: 'T1', awayShort: 'GEN', status: 'live', clock: 22 * 60 + 31, period: 'Map 3', score: [1, 1], odds: { home: 1.68, away: 2.12 }, markets: 31 },
  { id: 'nyr-tor', sport: 'hockey', competitionId: 'nhl', home: 'NY Rangers', away: 'Toronto', homeShort: 'NYR', awayShort: 'TOR', status: 'live', clock: 9 * 60 + 2, period: 'P2', score: [2, 2], odds: { home: 2.3, draw: 4.1, away: 2.6 }, markets: 58 },

  // Upcoming football
  { id: 'mci-che', sport: 'football', competitionId: 'epl', home: 'Man City', away: 'Chelsea', homeShort: 'MCI', awayShort: 'CHE', status: 'upcoming', startsIn: 18, odds: { home: 1.62, draw: 4.2, away: 5.1 }, markets: 246 },
  { id: 'tot-avl', sport: 'football', competitionId: 'epl', home: 'Tottenham', away: 'Aston Villa', homeShort: 'TOT', awayShort: 'AVL', status: 'upcoming', startsIn: 135, odds: { home: 2.25, draw: 3.5, away: 3.05 }, markets: 210 },
  { id: 'mun-whu', sport: 'football', competitionId: 'epl', home: 'Man United', away: 'West Ham', homeShort: 'MUN', awayShort: 'WHU', status: 'upcoming', startsIn: 1440 + 90, odds: { home: 1.9, draw: 3.7, away: 4.0 }, markets: 198 },
  { id: 'bay-psg', sport: 'football', competitionId: 'ucl', home: 'Bayern Munich', away: 'PSG', homeShort: 'BAY', awayShort: 'PSG', status: 'upcoming', startsIn: 42, odds: { home: 1.95, draw: 3.9, away: 3.55 }, markets: 260 },
  { id: 'bar-juv', sport: 'football', competitionId: 'ucl', home: 'Barcelona', away: 'Juventus', homeShort: 'BAR', awayShort: 'JUV', status: 'upcoming', startsIn: 42, odds: { home: 1.72, draw: 4.0, away: 4.6 }, markets: 255 },
  { id: 'atm-ben', sport: 'football', competitionId: 'ucl', home: 'Atletico Madrid', away: 'Benfica', homeShort: 'ATM', awayShort: 'BEN', status: 'upcoming', startsIn: 1440 + 42, odds: { home: 1.8, draw: 3.6, away: 4.5 }, markets: 230 },
  { id: 'bet-vil', sport: 'football', competitionId: 'laliga', home: 'Real Betis', away: 'Villarreal', homeShort: 'BET', awayShort: 'VIL', status: 'upcoming', startsIn: 95, odds: { home: 2.4, draw: 3.3, away: 2.95 }, markets: 160 },
  { id: 'ath-rso', sport: 'football', competitionId: 'laliga', home: 'Athletic Club', away: 'Real Sociedad', homeShort: 'ATH', awayShort: 'RSO', status: 'upcoming', startsIn: 200, odds: { home: 2.05, draw: 3.25, away: 3.8 }, markets: 150 },
  { id: 'mil-rom', sport: 'football', competitionId: 'seriea', home: 'AC Milan', away: 'Roma', homeShort: 'MIL', awayShort: 'ROM', status: 'upcoming', startsIn: 65, odds: { home: 2.0, draw: 3.4, away: 3.75 }, markets: 170 },
  { id: 'juv-ata', sport: 'football', competitionId: 'seriea', home: 'Lazio', away: 'Atalanta', homeShort: 'LAZ', awayShort: 'ATA', status: 'upcoming', startsIn: 260, odds: { home: 2.9, draw: 3.3, away: 2.4 }, markets: 140 },
  { id: 'rbl-sge', sport: 'football', competitionId: 'bundesliga', home: 'RB Leipzig', away: 'Frankfurt', homeShort: 'RBL', awayShort: 'SGE', status: 'upcoming', startsIn: 8, odds: { home: 1.75, draw: 4.1, away: 4.3 }, markets: 175 },
  { id: 'vfb-wob', sport: 'football', competitionId: 'bundesliga', home: 'Stuttgart', away: 'Wolfsburg', homeShort: 'VFB', awayShort: 'WOB', status: 'upcoming', startsIn: 320, odds: { home: 1.85, draw: 3.8, away: 4.0 }, markets: 150 },
  // Upcoming other sports
  { id: 'mia-nyk', sport: 'basketball', competitionId: 'nba', home: 'Miami Heat', away: 'NY Knicks', homeShort: 'MIA', awayShort: 'NYK', status: 'upcoming', startsIn: 25, odds: { home: 2.05, away: 1.8 }, markets: 90 },
  { id: 'zve-med', sport: 'tennis', competitionId: 'atp', home: 'A. Zverev', away: 'D. Medvedev', homeShort: 'ZVE', awayShort: 'MED', status: 'upcoming', startsIn: 55, odds: { home: 1.75, away: 2.05 }, markets: 38 },
  { id: 'navi-faze', sport: 'esports', competitionId: 'cs2', home: 'NAVI', away: 'FaZe', homeShort: 'NAV', awayShort: 'FAZ', status: 'upcoming', startsIn: 12, odds: { home: 1.9, away: 1.9 }, markets: 26 },
]

export const FEATURED_MATCH_ID = 'ars-bha'

export type Outcome = { key: string; label: string; odds: number }
export type Market = { id: string; name: string; outcomes: Outcome[]; columns?: 2 | 3 }
export type MarketGroup = { id: string; name: string; markets: Market[] }

export const MATCH_MARKET_GROUPS: MarketGroup[] = [
  {
    id: 'popular',
    name: 'Popular',
    markets: [
      { id: '1x2', name: 'Match Result', columns: 3, outcomes: [ { key: 'home', label: 'Arsenal', odds: 1.32 }, { key: 'draw', label: 'Draw', odds: 5.4 }, { key: 'away', label: 'Brighton', odds: 9.5 } ] },
      { id: 'dc', name: 'Double Chance', columns: 3, outcomes: [ { key: '1x', label: 'Arsenal or Draw', odds: 1.05 }, { key: '12', label: 'Arsenal or Brighton', odds: 1.14 }, { key: 'x2', label: 'Draw or Brighton', odds: 3.4 } ] },
      { id: 'btts', name: 'Both Teams to Score (Rest of Match)', columns: 2, outcomes: [ { key: 'yes', label: 'Yes', odds: 2.6 }, { key: 'no', label: 'No', odds: 1.45 } ] },
      { id: 'next-goal', name: 'Next Goal', columns: 3, outcomes: [ { key: 'home', label: 'Arsenal', odds: 1.72 }, { key: 'none', label: 'No Goal', odds: 3.9 }, { key: 'away', label: 'Brighton', odds: 3.6 } ] },
    ],
  },
  {
    id: 'goals',
    name: 'Goals',
    markets: [
      { id: 'ou35', name: 'Total Goals Over/Under 3.5', columns: 2, outcomes: [ { key: 'over', label: 'Over 3.5', odds: 1.48 }, { key: 'under', label: 'Under 3.5', odds: 2.55 } ] },
      { id: 'ou45', name: 'Total Goals Over/Under 4.5', columns: 2, outcomes: [ { key: 'over', label: 'Over 4.5', odds: 3.1 }, { key: 'under', label: 'Under 4.5', odds: 1.33 } ] },
      { id: 'home-goals', name: 'Arsenal Total Goals', columns: 2, outcomes: [ { key: 'over', label: 'Over 2.5', odds: 1.9 }, { key: 'under', label: 'Under 2.5', odds: 1.85 } ] },
      { id: 'exact', name: 'Correct Score', columns: 3, outcomes: [ { key: '2-1', label: '2 - 1', odds: 3.2 }, { key: '3-1', label: '3 - 1', odds: 4.5 }, { key: '2-2', label: '2 - 2', odds: 8.0 }, { key: '4-1', label: '4 - 1', odds: 11 }, { key: '3-2', label: '3 - 2', odds: 13 }, { key: '2-3', label: '2 - 3', odds: 41 } ] },
    ],
  },
  {
    id: 'halves',
    name: 'Halves',
    markets: [
      { id: '2h-result', name: '2nd Half Result', columns: 3, outcomes: [ { key: 'home', label: 'Arsenal', odds: 2.1 }, { key: 'draw', label: 'Draw', odds: 2.4 }, { key: 'away', label: 'Brighton', odds: 6.2 } ] },
      { id: '2h-goals', name: '2nd Half Goals Over/Under 1.5', columns: 2, outcomes: [ { key: 'over', label: 'Over 1.5', odds: 2.2 }, { key: 'under', label: 'Under 1.5', odds: 1.62 } ] },
      { id: 'hs-half', name: 'Highest Scoring Half', columns: 3, outcomes: [ { key: '1h', label: '1st Half', odds: 2.05 }, { key: 'tie', label: 'Tie', odds: 3.1 }, { key: '2h', label: '2nd Half', odds: 3.4 } ] },
    ],
  },
  {
    id: 'handicaps',
    name: 'Handicaps',
    markets: [
      { id: 'ah-1', name: 'Asian Handicap -1.5 / +1.5', columns: 2, outcomes: [ { key: 'home', label: 'Arsenal -1.5', odds: 2.95 }, { key: 'away', label: 'Brighton +1.5', odds: 1.38 } ] },
      { id: 'ah-0', name: 'Asian Handicap -0.5 / +0.5', columns: 2, outcomes: [ { key: 'home', label: 'Arsenal -0.5', odds: 1.32 }, { key: 'away', label: 'Brighton +0.5', odds: 3.25 } ] },
      { id: 'eh', name: 'European Handicap (0:1)', columns: 3, outcomes: [ { key: 'home', label: 'Arsenal', odds: 6.5 }, { key: 'draw', label: 'Draw', odds: 4.4 }, { key: 'away', label: 'Brighton', odds: 1.36 } ] },
    ],
  },
  {
    id: 'scorers',
    name: 'Goalscorers',
    markets: [
      { id: 'next-scorer', name: 'Next Goalscorer', columns: 2, outcomes: [ { key: 'saka', label: 'B. Saka', odds: 4.2 }, { key: 'havertz', label: 'K. Havertz', odds: 4.75 }, { key: 'odegaard', label: 'M. Ødegaard', odds: 6.0 }, { key: 'martinelli', label: 'G. Martinelli', odds: 5.5 }, { key: 'welbeck', label: 'D. Welbeck', odds: 8.5 }, { key: 'mitoma', label: 'K. Mitoma', odds: 9.0 } ] },
      { id: 'anytime', name: 'Anytime Goalscorer (Rest of Match)', columns: 2, outcomes: [ { key: 'saka', label: 'B. Saka', odds: 2.9 }, { key: 'havertz', label: 'K. Havertz', odds: 3.25 }, { key: 'welbeck', label: 'D. Welbeck', odds: 5.8 }, { key: 'joao-pedro', label: 'Georginio R.', odds: 7.5 } ] },
    ],
  },
  {
    id: 'corners',
    name: 'Corners & Cards',
    markets: [
      { id: 'corners-ou', name: 'Total Corners Over/Under 10.5', columns: 2, outcomes: [ { key: 'over', label: 'Over 10.5', odds: 1.8 }, { key: 'under', label: 'Under 10.5', odds: 1.95 } ] },
      { id: 'next-corner', name: 'Next Corner', columns: 3, outcomes: [ { key: 'home', label: 'Arsenal', odds: 1.5 }, { key: 'none', label: 'None', odds: 9.0 }, { key: 'away', label: 'Brighton', odds: 2.65 } ] },
      { id: 'cards-ou', name: 'Total Cards Over/Under 4.5', columns: 2, outcomes: [ { key: 'over', label: 'Over 4.5', odds: 2.3 }, { key: 'under', label: 'Under 4.5', odds: 1.58 } ] },
      { id: 'red-card', name: 'Red Card in Match', columns: 2, outcomes: [ { key: 'yes', label: 'Yes', odds: 5.5 }, { key: 'no', label: 'No', odds: 1.12 } ] },
    ],
  },
]

/** Selections that start suspended on the match page (demonstrates the suspended state) */
export const INITIALLY_SUSPENDED = ['ars-bha:next-goal:home', 'ars-bha:next-goal:none', 'ars-bha:next-goal:away']

export const FEATURED_STATS = {
  possession: [58, 42] as [number, number],
  shots: [14, 7] as [number, number],
  shotsOnTarget: [6, 3] as [number, number],
  corners: [6, 3] as [number, number],
  yellow: [1, 2] as [number, number],
  red: [0, 0] as [number, number],
  events: [
    { minute: 12, team: 'home' as const, type: 'goal' as const, player: 'B. Saka' },
    { minute: 34, team: 'away' as const, type: 'yellow' as const, player: 'L. Dunk' },
    { minute: 39, team: 'away' as const, type: 'goal' as const, player: 'D. Welbeck' },
    { minute: 51, team: 'home' as const, type: 'goal' as const, player: 'K. Havertz' },
    { minute: 58, team: 'home' as const, type: 'yellow' as const, player: 'D. Rice' },
  ],
}

export function getCompetition(id: string) {
  return COMPETITIONS.find((c) => c.id === id)!
}

export function getMatch(id: string) {
  return MATCHES.find((m) => m.id === id)!
}

export function selectionId(matchId: string, marketId: string, outcomeKey: string) {
  return `${matchId}:${marketId}:${outcomeKey}`
}

export function formatClock(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatStartsIn(minutes: number) {
  if (minutes < 60) return `in ${minutes}m`
  if (minutes < 1440) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m ? `in ${h}h ${m}m` : `in ${h}h`
  }
  return 'Tomorrow'
}

export function formatKickoff(minutes: number) {
  const base = new Date(2026, 10, 10, 19, 0)
  const d = new Date(base.getTime() + minutes * 60000)
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return minutes >= 1440 ? `Tomorrow ${time}` : `Today ${time}`
}

export function formatUSDT(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
