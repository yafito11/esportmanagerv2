interface GeneratedContent {
  text: string;
  confidence: number;
  context: string;
}

interface PlayerProfile {
  name: string;
  nationality: string;
  background: string;
  playstyle: string;
  signature_agents: string[];
}

interface TeamStrategy {
  mapStrategy: string;
  economyPlan: string;
  roleDistribution: string;
  tacticalApproach: string;
}

// Pre-generated content pools to avoid real-time AI generation
const PLAYER_NAMES = {
  male: ['Alex', 'Jordan', 'Sam', 'Casey', 'Riley', 'Blake', 'Cameron', 'Drew', 'Hunter', 'Logan', 'Mason', 'Noah', 'Parker', 'Tyler'],
  female: ['Avery', 'Emery', 'Finley', 'Gray', 'Jaden', 'Kai', 'Quinn', 'Reese', 'Sage', 'Taylor', 'Vale', 'Wren', 'Zion'],
  surnames: ['Anderson', 'Baker', 'Clark', 'Davis', 'Evans', 'Foster', 'Green', 'Hall', 'Jackson', 'King', 'Lee', 'Miller', 'Nelson', 'Parker', 'Roberts', 'Smith', 'Taylor', 'Turner', 'Walker', 'White', 'Wilson', 'Young']
};

const NATIONALITIES = [
  'USA', 'Canada', 'UK', 'Germany', 'France', 'Spain', 'Italy', 'Sweden', 'Denmark', 'Finland', 'Norway',
  'Brazil', 'Argentina', 'Mexico', 'Japan', 'Korea', 'China', 'Thailand', 'Philippines', 'Australia', 'New Zealand'
];

const PLAYSTYLES = [
  'Aggressive entry fragger', 'Strategic support player', 'Clutch specialist', 'IGL and shot caller',
  'Flexible role player', 'Defensive anchor', 'Utility specialist', 'Aim duelist', 'Map control expert',
  'Economic strategist', 'Mental game specialist', 'Team motivator'
];

const BACKGROUNDS = [
  'Former CS professional', 'Rising rookie talent', 'Converted from another FPS', 'Academy graduate',
  'Regional champion', 'Streamer turned pro', 'International import', 'Veteran comeback',
  'Young prodigy', 'Technical specialist', 'Former coach player', 'Multi-game competitor'
];

const STRATEGIC_APPROACHES = [
  'Fast execution plays', 'Slow default rounds', 'Heavy utility usage', 'Aim duel focused',
  'Map control oriented', 'Anti-strat specialists', 'Adaptation masters', 'Economic warfare',
  'Information gathering', 'Site takes priority', 'Retake specialists', 'Clutch scenarios'
];

// Generate a realistic player profile
export const generatePlayerProfile = (role?: string): PlayerProfile => {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const firstName = PLAYER_NAMES[gender][Math.floor(Math.random() * PLAYER_NAMES[gender].length)];
  const lastName = PLAYER_NAMES.surnames[Math.floor(Math.random() * PLAYER_NAMES.surnames.length)];
  const nationality = NATIONALITIES[Math.floor(Math.random() * NATIONALITIES.length)];
  
  return {
    name: `${firstName} "${getGamerTag()}" ${lastName}`,
    nationality,
    background: BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)],
    playstyle: PLAYSTYLES[Math.floor(Math.random() * PLAYSTYLES.length)],
    signature_agents: generateSignatureAgents(role)
  };
};

const getGamerTag = (): string => {
  const prefixes = ['Shadow', 'Void', 'Storm', 'Fire', 'Ice', 'Dark', 'Light', 'Swift', 'Steel', 'Ghost'];
  const suffixes = ['Strike', 'Blade', 'Shot', 'Wolf', 'Hawk', 'Fox', 'Lion', 'Bear', 'Viper', 'Eagle'];
  const numbers = ['', '7', '21', '99', '13', '42'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  
  return `${prefix}${suffix}${number}`;
};

const generateSignatureAgents = (role?: string): string[] => {
  const agentsByRole = {
    duelist: ['Phoenix', 'Jett', 'Reyna', 'Raze', 'Yoru', 'Neon', 'Iso'],
    controller: ['Brimstone', 'Viper', 'Omen', 'Astra', 'Harbor', 'Clove', 'Tempest'],
    initiator: ['Sova', 'Breach', 'Skye', 'KAY/O', 'Fade', 'Gekko', 'Nexus'],
    sentinel: ['Sage', 'Cypher', 'Killjoy', 'Chamber', 'Deadlock', 'Vyse']
  };
  
  if (role && role in agentsByRole) {
    const roleAgents = agentsByRole[role as keyof typeof agentsByRole];
    const count = Math.min(3, roleAgents.length);
    return roleAgents.sort(() => Math.random() - 0.5).slice(0, count);
  }
  
  // Random agents from any role
  const allAgents = Object.values(agentsByRole).flat();
  return allAgents.sort(() => Math.random() - 0.5).slice(0, 3);
};

// Generate strategic advice based on current game state
export const generateStrategicAdvice = (
  context: {
    currentScore: { home: number; away: number };
    currentRound: number;
    side: 'attack' | 'defense';
    economy: { home: number; away: number };
    mapName: string;
    recentRounds: string[];
  }
): GeneratedContent => {
  const advice = [];
  
  // Score-based advice
  if (context.currentScore.home > context.currentScore.away + 3) {
    advice.push("Maintain momentum with consistent utility usage");
  } else if (context.currentScore.away > context.currentScore.home + 3) {
    advice.push("Consider tactical reset and anti-strat adjustments");
  } else {
    advice.push("Close game - focus on fundamentals and communication");
  }
  
  // Economy advice
  if (context.economy.home < 3000) {
    advice.push("Force buy or save - avoid half-buys");
  } else if (context.economy.home > 6000) {
    advice.push("Full utility available - execute practiced strategies");
  }
  
  // Side-specific advice
  if (context.side === 'attack') {
    advice.push("Control map early and execute site takes");
  } else {
    advice.push("Play for information and force attackers into bad positions");
  }
  
  // Round-specific advice
  if (context.currentRound > 20) {
    advice.push("Overtime mentality - every round is crucial");
  } else if (context.currentRound > 10) {
    advice.push("Second half adjustments based on opponent patterns");
  }
  
  const selectedAdvice = advice[Math.floor(Math.random() * advice.length)];
  
  return {
    text: selectedAdvice,
    confidence: 0.8,
    context: `Round ${context.currentRound}, ${context.side} side`
  };
};

// Generate team composition recommendations
export const generateCompositionAdvice = (
  mapName: string,
  currentAgents: string[],
  availableAgents: string[]
): GeneratedContent => {
  const mapStrategies = {
    'Ascent': 'Balanced composition with strong mid control',
    'Bind': 'Teleporter control with area denial utilities',
    'Haven': 'Flexible composition for three-site coverage',
    'Split': 'Vertical control with elevation advantages',
    'Icebox': 'Long-range duels and zip line control'
  };
  
  const strategy = mapStrategies[mapName as keyof typeof mapStrategies] || 'Adaptive gameplay';
  
  const recommendations = [];
  
  // Check role coverage
  const roles = ['duelist', 'controller', 'initiator', 'sentinel'];
  const missingRoles = roles.filter(role => !currentAgents.some(agent => 
    getAgentRole(agent) === role
  ));
  
  if (missingRoles.length > 0) {
    recommendations.push(`Consider adding a ${missingRoles[0]} for role balance`);
  }
  
  // Map-specific recommendations
  if (mapName === 'Haven' && !currentAgents.includes('Astra')) {
    recommendations.push('Astra provides excellent three-site control');
  }
  
  if (mapName === 'Bind' && !currentAgents.includes('Raze')) {
    recommendations.push('Raze excels at clearing tight spaces');
  }
  
  const advice = recommendations.length > 0 ? 
    recommendations[Math.floor(Math.random() * recommendations.length)] :
    `Focus on ${strategy.toLowerCase()}`;
  
  return {
    text: advice,
    confidence: 0.75,
    context: `Map: ${mapName}, Current agents: ${currentAgents.length}/5`
  };
};

const getAgentRole = (agentName: string): string => {
  const agentRoles: { [key: string]: string } = {
    'Phoenix': 'duelist', 'Jett': 'duelist', 'Reyna': 'duelist', 'Raze': 'duelist',
    'Yoru': 'duelist', 'Neon': 'duelist', 'Iso': 'duelist',
    'Brimstone': 'controller', 'Viper': 'controller', 'Omen': 'controller',
    'Astra': 'controller', 'Harbor': 'controller', 'Clove': 'controller', 'Tempest': 'controller',
    'Sova': 'initiator', 'Breach': 'initiator', 'Skye': 'initiator',
    'KAY/O': 'initiator', 'Fade': 'initiator', 'Gekko': 'initiator', 'Nexus': 'initiator',
    'Sage': 'sentinel', 'Cypher': 'sentinel', 'Killjoy': 'sentinel',
    'Chamber': 'sentinel', 'Deadlock': 'sentinel', 'Vyse': 'sentinel'
  };
  
  return agentRoles[agentName] || 'flex';
};

// Generate scouting reports for players
export const generateScoutingReport = (
  player: any,
  recentMatches: any[] = []
): GeneratedContent => {
  const strengths = [];
  const weaknesses = [];
  
  // Analyze stats
  if (player.aim > 85) strengths.push('exceptional aim');
  if (player.gameIq > 85) strengths.push('strong game sense');
  if (player.clutch > 85) strengths.push('clutch performer');
  if (player.teamwork > 85) strengths.push('excellent team player');
  if (player.positioning > 85) strengths.push('superior positioning');
  
  if (player.aim < 70) weaknesses.push('mechanical inconsistency');
  if (player.gameIq < 70) weaknesses.push('tactical awareness gaps');
  if (player.teamwork < 70) weaknesses.push('communication issues');
  
  // Generate recommendation
  let recommendation = 'monitor';
  const overallRating = (player.aim + player.gameIq + player.clutch + player.teamwork + player.positioning) / 5;
  
  if (overallRating > 85 && strengths.length >= 3) {
    recommendation = 'sign';
  } else if (overallRating < 65 || weaknesses.length >= 3) {
    recommendation = 'pass';
  }
  
  const report = `${player.name} shows ${strengths.length > 0 ? strengths.join(', ') : 'balanced skills'}.
    ${weaknesses.length > 0 ? `Areas for improvement: ${weaknesses.join(', ')}.` : ''}
    Overall rating: ${overallRating.toFixed(1)}/100. Recommendation: ${recommendation.toUpperCase()}.`;
  
  return {
    text: report,
    confidence: 0.85,
    context: `Player evaluation for ${player.name}`
  };
};

// Generate match predictions
export const generateMatchPrediction = (
  homeTeam: any,
  awayTeam: any,
  mapName: string,
  historical: any[] = []
): GeneratedContent => {
  const factors = [];
  
  // Team strength comparison
  const homeStrength = calculateTeamStrength(homeTeam);
  const awayStrength = calculateTeamStrength(awayTeam);
  
  if (homeStrength > awayStrength + 10) {
    factors.push('Home team has significant skill advantage');
  } else if (awayStrength > homeStrength + 10) {
    factors.push('Away team favored based on individual skill');
  } else {
    factors.push('Closely matched teams - expect competitive match');
  }
  
  // Map-specific factors
  factors.push(`${mapName} favors ${Math.random() > 0.5 ? 'defensive' : 'aggressive'} playstyles`);
  
  const prediction = factors.join('. ') + '.';
  
  return {
    text: prediction,
    confidence: 0.7,
    context: `Pre-match analysis for ${mapName}`
  };
};

const calculateTeamStrength = (team: any): number => {
  if (!team || !team.players || team.players.length === 0) return 50;
  
  const players = Array.isArray(team) ? team : team.players;
  return players.reduce((sum: number, player: any) => {
    return sum + (player.aim + player.gameIq + player.clutch + player.teamwork + player.positioning) / 5;
  }, 0) / players.length;
};

// Generate tournament storylines and narratives
export const generateTournamentNarrative = (
  tournament: any,
  teams: any[],
  currentRound: string
): GeneratedContent => {
  const narratives = [
    `${tournament.name} enters ${currentRound} with intense competition`,
    `Underdogs challenging established powerhouses in ${currentRound}`,
    `International rivalry takes center stage in ${tournament.name}`,
    `Rising stars face veteran experience in ${currentRound}`,
    `Regional pride on the line as ${tournament.name} intensifies`
  ];
  
  const selectedNarrative = narratives[Math.floor(Math.random() * narratives.length)];
  
  return {
    text: selectedNarrative,
    confidence: 0.9,
    context: `${tournament.name} - ${currentRound}`
  };
};

// Export utility functions
export const generateRandomEvents = (count: number = 5): string[] => {
  const events = [
    'Team chemistry reaching new heights',
    'Tactical innovation changes meta',
    'Rookie player exceeds expectations',
    'Veteran announces retirement plans',
    'New agent composition proves effective',
    'Regional tournament circuit expansion',
    'International bootcamp opportunity',
    'Sponsorship deal announcement',
    'Coaching staff restructuring',
    'Academy team promotion'
  ];
  
  return events.sort(() => Math.random() - 0.5).slice(0, count);
};

export const generateMotivationalQuotes = (): string[] => {
  return [
    "Excellence is not a skill, it's an attitude.",
    "Champions are made in practice, proven in competition.",
    "Teamwork makes the dream work.",
    "Adapt, overcome, dominate.",
    "Every round is a new opportunity.",
    "Precision and strategy win matches.",
    "Trust your training, trust your team.",
    "Mental fortitude separates good from great.",
    "Consistency is the mark of champions.",
    "Learn from every loss, build from every win."
  ];
};
