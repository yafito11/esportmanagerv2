import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Tournament {
  id: number;
  name: string;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date;
  prizePool?: string;
  maxTeams: number;
  currentRound: string;
  bracketData?: Record<string, any>;
  createdAt: Date;
}

export interface Match {
  id: number;
  tournamentId?: number;
  homeTeamId: number;
  awayTeamId: number;
  scheduledDate: Date;
  homeScore: number;
  awayScore: number;
  status: string;
  map?: string;
  homeTeamDraft?: any[];
  awayTeamDraft?: any[];
  matchData?: Record<string, any>;
  completedAt?: Date;
  createdAt: Date;
}

export interface Agent {
  id: number;
  name: string;
  role: string;
  description: string;
  abilities: any[];
  difficulty: number;
  isOriginal: boolean;
}

interface TournamentStateStore {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  matches: Match[];
  upcomingMatches: Match[];
  currentMatch: Match | null;
  agents: Agent[];
  
  // Match simulation state
  matchPhase: 'draft' | 'map_ban' | 'strategy' | 'simulation' | 'timeout' | 'completed';
  currentRound: number;
  homeTeamScore: number;
  awayTeamScore: number;
  draftOrder: string[];
  selectedAgents: { home: Agent[], away: Agent[] };
  timeouts: { home: number, away: number };
  
  // Actions
  setTournaments: (tournaments: Tournament[]) => void;
  setCurrentTournament: (tournament: Tournament | null) => void;
  setMatches: (matches: Match[]) => void;
  setUpcomingMatches: (matches: Match[]) => void;
  setCurrentMatch: (match: Match | null) => void;
  setAgents: (agents: Agent[]) => void;
  
  // Match simulation actions
  setMatchPhase: (phase: 'draft' | 'map_ban' | 'strategy' | 'simulation' | 'timeout' | 'completed') => void;
  updateMatchScore: (homeScore: number, awayScore: number) => void;
  updateCurrentRound: (round: number) => void;
  selectAgent: (team: 'home' | 'away', agent: Agent) => void;
  useTimeout: (team: 'home' | 'away') => void;
  resetMatchState: () => void;
}

export const useTournamentState = create<TournamentStateStore>()(
  subscribeWithSelector((set, get) => ({
    tournaments: [],
    currentTournament: null,
    matches: [],
    upcomingMatches: [],
    currentMatch: null,
    agents: [],
    
    // Match simulation state
    matchPhase: 'map_selection',
    currentRound: 0,
    homeTeamScore: 0,
    awayTeamScore: 0,
    draftOrder: [],
    selectedAgents: { home: [], away: [] },
    timeouts: { home: 2, away: 2 },
    
    setTournaments: (tournaments) => set({ tournaments }),
    setCurrentTournament: (tournament) => set({ currentTournament: tournament }),
    setMatches: (matches) => set({ matches }),
    setUpcomingMatches: (matches) => set({ upcomingMatches: matches }),
    setCurrentMatch: (match) => set({ currentMatch: match }),
    setAgents: (agents) => set({ agents }),
    
    setMatchPhase: (phase) => set({ matchPhase: phase }),
    updateMatchScore: (homeScore, awayScore) => set({ homeTeamScore: homeScore, awayTeamScore: awayScore }),
    updateCurrentRound: (round) => set({ currentRound: round }),
    
    selectAgent: (team, agent) => {
      const { selectedAgents } = get();
      const safeSelectedAgents = selectedAgents || { home: [], away: [] };
      const currentTeamAgents = safeSelectedAgents[team] || [];
      
      const newSelectedAgents = {
        ...safeSelectedAgents,
        [team]: [...currentTeamAgents, agent]
      };
      set({ selectedAgents: newSelectedAgents });
    },
    
    useTimeout: (team) => {
      const { timeouts } = get();
      if (timeouts[team] > 0) {
        set({
          timeouts: {
            ...timeouts,
            [team]: timeouts[team] - 1
          }
        });
      }
    },
    
    resetMatchState: () => set({
      matchPhase: 'draft',
      currentRound: 0,
      homeTeamScore: 0,
      awayTeamScore: 0,
      selectedAgents: { home: [], away: [] },
      timeouts: { home: 2, away: 2 },
      currentMatch: null
    }),
  }))
);
