import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface User {
  id: number;
  username: string;
}

export interface GameState {
  id: number;
  userId: number;
  currentDate: Date;
  currentSeason: number;
  phase: string;
  tutorialCompleted: boolean;
  settings: Record<string, any>;
  updatedAt: Date;
}

interface GameStateStore {
  user: User | null;
  gameState: GameState | null;
  currentView: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setGameState: (gameState: GameState | null) => void;
  setCurrentView: (view: string) => void;
  logout: () => void;
}

export const useGameState = create<GameStateStore>()(
  subscribeWithSelector((set) => ({
    user: null,
    gameState: null,
    currentView: "schedule",
    
    setUser: (user) => set({ user }),
    setGameState: (gameState) => set({ gameState }),
    setCurrentView: (view) => set({ currentView: view }),
    logout: () => set({ user: null, gameState: null, currentView: "schedule" }),
  }))
);
