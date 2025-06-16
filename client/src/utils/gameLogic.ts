import { Agent } from "../data/agents";
import { MapLayout } from "../data/maps";

export interface MatchResult {
  homeScore: number;
  awayScore: number;
  rounds: RoundResult[];
  mvp: string;
  duration: number; // in minutes
  winner: 'home' | 'away' | 'tie';
}

export interface RoundResult {
  roundNumber: number;
  winner: 'home' | 'away';
  type: 'elimination' | 'defuse' | 'explode' | 'time';
  duration: number; // in seconds
  kills: KillEvent[];
  economy: { home: number; away: number };
}

export interface KillEvent {
  killer: string;
  victim: string;
  weapon: string;
  headshot: boolean;
  timestamp: number;
}

export interface TeamComposition {
  duelist: number;
  initiator: number;
  controller: number;
  sentinel: number;
  flex: number;
}

export interface PlayerStats {
  name: string;
  kills: number;
  deaths: number;
  assists: number;
  rating: number;
  adr: number; // Average damage per round
  headshots: number;
  clutches: number;
}

// Calculate team synergy based on role composition and player chemistry
export const calculateTeamSynergy = (
  composition: TeamComposition,
  players: any[],
  map: MapLayout
): number => {
  let synergy = 50; // Base synergy
  
  // Role composition scoring
  const idealComposition = getIdealComposition(map);
  const compositionScore = calculateCompositionScore(composition, idealComposition);
  synergy += compositionScore * 20;
  
  // Player chemistry (based on teamwork stats)
  const avgTeamwork = players.reduce((sum, p) => sum + p.teamwork, 0) / players.length;
  synergy += (avgTeamwork - 75) * 0.3;
  
  // Role coverage - ensure each role is covered
  const roleCoverage = Object.values(composition).filter(count => count > 0).length;
  if (roleCoverage >= 4) synergy += 10;
  
  return Math.max(0, Math.min(100, synergy));
};

const getIdealComposition = (map: MapLayout): TeamComposition => {
  if (map.bombSites.length === 3) {
    // Three-site maps need more area control
    return { duelist: 1, initiator: 1, controller: 2, sentinel: 1, flex: 0 };
  }
  
  if (map.chokePoints.length > 4) {
    // Maps with many chokes need more info gathering
    return { duelist: 1, initiator: 2, controller: 1, sentinel: 1, flex: 0 };
  }
  
  // Standard composition
  return { duelist: 1, initiator: 1, controller: 1, sentinel: 1, flex: 1 };
};

const calculateCompositionScore = (
  actual: TeamComposition,
  ideal: TeamComposition
): number => {
  let score = 0;
  const roles = Object.keys(ideal) as (keyof TeamComposition)[];
  
  roles.forEach(role => {
    const diff = Math.abs(actual[role] - ideal[role]);
    score += Math.max(0, 1 - diff * 0.5); // Penalty for deviation
  });
  
  return score / roles.length;
};

// Simulate a round outcome based on team strengths and tactical factors
export const simulateRound = (
  homeTeam: any[],
  awayTeam: any[],
  homeAgents: Agent[],
  awayAgents: Agent[],
  map: MapLayout,
  side: 'attack' | 'defense',
  economy: { home: number; away: number }
): RoundResult => {
  const roundNumber = Math.floor(Math.random() * 30) + 1;
  
  // Calculate team strengths
  const homeStrength = calculateTeamStrength(homeTeam, homeAgents, map, side === 'attack' ? 'attack' : 'defense');
  const awayStrength = calculateTeamStrength(awayTeam, awayAgents, map, side === 'attack' ? 'defense' : 'attack');
  
  // Economy impact
  const economyFactor = calculateEconomyFactor(economy);
  const adjustedHomeStrength = homeStrength * economyFactor.home;
  const adjustedAwayStrength = awayStrength * economyFactor.away;
  
  // Determine winner
  const totalStrength = adjustedHomeStrength + adjustedAwayStrength;
  const homeWinChance = adjustedHomeStrength / totalStrength;
  const winner = Math.random() < homeWinChance ? 'home' : 'away';
  
  // Generate round events
  const kills = generateKillEvents(homeTeam, awayTeam, winner);
  const roundType = determineRoundType(winner, side);
  const duration = 45 + Math.random() * 90; // 45-135 seconds
  
  return {
    roundNumber,
    winner,
    type: roundType,
    duration,
    kills,
    economy: updateEconomy(economy, winner, roundType)
  };
};

const calculateTeamStrength = (
  players: any[],
  agents: Agent[],
  map: MapLayout,
  side: 'attack' | 'defense'
): number => {
  if (players.length === 0 || agents.length === 0) return 50;
  
  // Base skill average
  const avgSkill = players.reduce((sum, p) => {
    const playerSkill = (p.aim + p.gameIq + p.clutch + p.teamwork + p.positioning) / 5;
    return sum + playerSkill;
  }, 0) / players.length;
  
  // Agent composition bonus
  const composition = getTeamComposition(agents);
  const synergy = calculateTeamSynergy(composition, players, map);
  
  // Side-specific adjustments
  const sideBonus = side === 'attack' ? 
    composition.duelist * 5 + composition.initiator * 3 :
    composition.sentinel * 5 + composition.controller * 3;
  
  // Morale factor
  const avgMorale = players.reduce((sum, p) => sum + p.morale, 0) / players.length;
  const moraleBonus = (avgMorale - 75) * 0.2;
  
  return avgSkill + synergy * 0.3 + sideBonus + moraleBonus;
};

const getTeamComposition = (agents: Agent[]): TeamComposition => {
  const composition: TeamComposition = {
    duelist: 0,
    initiator: 0,
    controller: 0,
    sentinel: 0,
    flex: 0
  };
  
  agents.forEach(agent => {
    if (agent.role in composition) {
      composition[agent.role as keyof TeamComposition]++;
    } else {
      composition.flex++;
    }
  });
  
  return composition;
};

const calculateEconomyFactor = (economy: { home: number; away: number }) => {
  const homeEcoLevel = economy.home < 3000 ? 0.8 : economy.home < 5000 ? 1.0 : 1.2;
  const awayEcoLevel = economy.away < 3000 ? 0.8 : economy.away < 5000 ? 1.0 : 1.2;
  
  return { home: homeEcoLevel, away: awayEcoLevel };
};

const generateKillEvents = (
  homeTeam: any[],
  awayTeam: any[],
  winner: 'home' | 'away'
): KillEvent[] => {
  const kills: KillEvent[] = [];
  const weapons = ['Vandal', 'Phantom', 'Operator', 'Sheriff', 'Spectre'];
  
  // Generate 2-4 kills per round
  const killCount = 2 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < killCount; i++) {
    const isHomeKill = Math.random() < (winner === 'home' ? 0.7 : 0.3);
    const killer = isHomeKill ? 
      homeTeam[Math.floor(Math.random() * homeTeam.length)].name :
      awayTeam[Math.floor(Math.random() * awayTeam.length)].name;
    
    const victim = isHomeKill ?
      awayTeam[Math.floor(Math.random() * awayTeam.length)].name :
      homeTeam[Math.floor(Math.random() * homeTeam.length)].name;
    
    kills.push({
      killer,
      victim,
      weapon: weapons[Math.floor(Math.random() * weapons.length)],
      headshot: Math.random() < 0.25,
      timestamp: Math.random() * 120
    });
  }
  
  return kills;
};

const determineRoundType = (
  winner: 'home' | 'away',
  side: 'attack' | 'defense'
): RoundResult['type'] => {
  const isAttackWin = (side === 'attack' && winner === 'home') || 
                     (side === 'defense' && winner === 'away');
  
  if (isAttackWin) {
    return Math.random() < 0.7 ? 'elimination' : 'explode';
  } else {
    const rand = Math.random();
    if (rand < 0.6) return 'elimination';
    if (rand < 0.8) return 'defuse';
    return 'time';
  }
};

const updateEconomy = (
  economy: { home: number; away: number },
  winner: 'home' | 'away',
  roundType: RoundResult['type']
): { home: number; away: number } => {
  const winBonus = 3000;
  const lossBonus = 1900;
  const plantBonus = 800;
  
  let homeEarnings = lossBonus;
  let awayEarnings = lossBonus;
  
  if (winner === 'home') {
    homeEarnings = winBonus;
    if (roundType === 'explode') homeEarnings += plantBonus;
  } else {
    awayEarnings = winBonus;
    if (roundType === 'explode') awayEarnings += plantBonus;
  }
  
  return {
    home: Math.min(9000, economy.home + homeEarnings),
    away: Math.min(9000, economy.away + awayEarnings)
  };
};

// Calculate match MVP based on performance metrics
export const calculateMVP = (
  homeStats: PlayerStats[],
  awayStats: PlayerStats[]
): PlayerStats => {
  const allStats = [...homeStats, ...awayStats];
  
  return allStats.reduce((mvp, player) => {
    const playerScore = calculatePlayerScore(player);
    const mvpScore = calculatePlayerScore(mvp);
    return playerScore > mvpScore ? player : mvp;
  });
};

const calculatePlayerScore = (stats: PlayerStats): number => {
  const kd = stats.deaths > 0 ? stats.kills / stats.deaths : stats.kills;
  return stats.rating * 0.4 + kd * 0.3 + stats.adr * 0.002 + stats.clutches * 0.1;
};

// Predict match outcome based on team analysis
export const predictMatchOutcome = (
  homeTeam: any[],
  awayTeam: any[],
  homeAgents: Agent[],
  awayAgents: Agent[],
  map: MapLayout
): { homeWinChance: number; confidence: number; factors: string[] } => {
  const homeStrength = calculateTeamStrength(homeTeam, homeAgents, map, 'attack');
  const awayStrength = calculateTeamStrength(awayTeam, awayAgents, map, 'defense');
  
  const totalStrength = homeStrength + awayStrength;
  const homeWinChance = homeStrength / totalStrength;
  
  // Calculate confidence based on strength difference
  const strengthDiff = Math.abs(homeStrength - awayStrength);
  const confidence = Math.min(0.9, strengthDiff / 50);
  
  // Identify key factors
  const factors = [];
  if (strengthDiff > 20) factors.push("Significant skill gap");
  if (homeTeam.some(p => p.morale > 90)) factors.push("High team morale");
  if (homeAgents.length !== 5) factors.push("Incomplete agent selection");
  
  return { homeWinChance, confidence, factors };
};

// Generate post-match analysis
export const generateMatchAnalysis = (
  result: MatchResult,
  homeTeam: any[],
  awayTeam: any[]
): string[] => {
  const analysis = [];
  
  if (result.homeScore > result.awayScore) {
    analysis.push("Strong performance from the home team");
  } else {
    analysis.push("Away team executed their game plan effectively");
  }
  
  if (result.duration > 60) {
    analysis.push("Long match indicates closely matched teams");
  }
  
  const totalRounds = result.rounds.length;
  const clutchRounds = result.rounds.filter(r => r.kills.length <= 2).length;
  
  if (clutchRounds > totalRounds * 0.3) {
    analysis.push("Many clutch situations decided the outcome");
  }
  
  return analysis;
};
