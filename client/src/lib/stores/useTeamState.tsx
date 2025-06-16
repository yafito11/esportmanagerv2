import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Team {
  id: number;
  userId: number;
  name: string;
  region: string;
  logo?: string;
  budget: string;
  reputation: number;
  createdAt: Date;
}

export interface Player {
  id: number;
  name: string;
  teamId?: number | null;
  role: string;
  nationality: string;
  age: number;
  aim: number;
  gameIq: number;
  clutch: number;
  teamwork: number;
  positioning: number;
  salary?: string | null;
  contractEnd?: Date | null;
  morale: number;
  energy: number;
  isStarter: boolean;
  isSubstitute: boolean;
  isAvailable: boolean;
  marketValue: string;
  createdAt: Date;
}

export interface Staff {
  id: number;
  teamId?: number | null;
  name: string;
  role: string;
  specialty?: string;
  salary?: string;
  contractEnd?: Date | null;
  experience: number;
  reputation: number;
  isAvailable: boolean;
  createdAt: Date;
}

interface TeamStateStore {
  currentTeam: Team | null;
  teamPlayers: Player[];
  teamStaff: Staff[];
  availablePlayers: Player[];
  availableStaff: Staff[];
  lineup: {
    starters: Player[];
    substitute: Player | null;
  };
  
  // Actions
  setCurrentTeam: (team: Team | null) => void;
  setTeamPlayers: (players: Player[]) => void;
  setTeamStaff: (staff: Staff[]) => void;
  setAvailablePlayers: (players: Player[]) => void;
  setAvailableStaff: (staff: Staff[]) => void;
  updatePlayer: (player: Player) => void;
  addPlayerToTeam: (player: Player) => void;
  removePlayerFromTeam: (playerId: number) => void;
  setLineup: (starters: Player[], substitute: Player | null) => void;
  updateLineup: (playerId: number, position: 'starter' | 'substitute' | 'bench') => void;
}

export const useTeamState = create<TeamStateStore>()(
  subscribeWithSelector((set, get) => ({
    currentTeam: null,
    teamPlayers: [],
    teamStaff: [],
    availablePlayers: [],
    availableStaff: [],
    lineup: {
      starters: [],
      substitute: null,
    },
    
    setCurrentTeam: (team) => set({ currentTeam: team }),
    
    setTeamPlayers: (players) => {
      const starters = players.filter(p => p.isStarter);
      const substitute = players.find(p => p.isSubstitute) || null;
      
      set({ 
        teamPlayers: players,
        lineup: { starters, substitute }
      });
    },
    
    setTeamStaff: (staff) => set({ teamStaff: staff }),
    setAvailablePlayers: (players) => set({ availablePlayers: players }),
    setAvailableStaff: (staff) => set({ availableStaff: staff }),
    
    updatePlayer: (updatedPlayer) => {
      const { teamPlayers, availablePlayers } = get();
      
      set({
        teamPlayers: teamPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p),
        availablePlayers: availablePlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p)
      });
    },
    
    addPlayerToTeam: (player) => {
      const { teamPlayers, availablePlayers } = get();
      
      set({
        teamPlayers: [...teamPlayers, player],
        availablePlayers: availablePlayers.filter(p => p.id !== player.id)
      });
    },
    
    removePlayerFromTeam: (playerId) => {
      const { teamPlayers, availablePlayers } = get();
      const player = teamPlayers.find(p => p.id === playerId);
      
      if (player) {
        set({
          teamPlayers: teamPlayers.filter(p => p.id !== playerId),
          availablePlayers: [...availablePlayers, { ...player, teamId: null, isAvailable: true, isStarter: false, isSubstitute: false }]
        });
      }
    },
    
    setLineup: (starters, substitute) => {
      set({ lineup: { starters, substitute } });
    },
    
    updateLineup: (playerId, position) => {
      const { teamPlayers } = get();
      
      const updatedPlayers = teamPlayers.map(player => {
        if (player.id === playerId) {
          return {
            ...player,
            isStarter: position === 'starter',
            isSubstitute: position === 'substitute'
          };
        }
        
        // If setting a new starter/substitute, remove others from that position
        if (position === 'starter' && player.isStarter && player.id !== playerId) {
          return { ...player, isStarter: false };
        }
        if (position === 'substitute' && player.isSubstitute && player.id !== playerId) {
          return { ...player, isSubstitute: false };
        }
        
        return player;
      });
      
      const starters = updatedPlayers.filter(p => p.isStarter);
      const substitute = updatedPlayers.find(p => p.isSubstitute) || null;
      
      set({
        teamPlayers: updatedPlayers,
        lineup: { starters, substitute }
      });
    },
  }))
);
