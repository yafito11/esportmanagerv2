import { 
  users, teams, players, agents, matches, tournaments, scouting, gameState, staff,
  type User, type InsertUser, type Team, type Player, type Agent, 
  type Match, type Tournament, type Scouting, type GameState, type Staff 
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Team operations
  getTeam(id: number): Promise<Team | undefined>;
  getTeamsByUser(userId: number): Promise<Team[]>;
  createTeam(team: Omit<Team, 'id' | 'createdAt'>): Promise<Team>;
  updateTeam(id: number, updates: Partial<Team>): Promise<Team>;
  
  // Player operations
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayersByTeam(teamId: number): Promise<Player[]>;
  getAvailablePlayers(limit?: number): Promise<Player[]>;
  createPlayer(player: Omit<Player, 'id' | 'createdAt'>): Promise<Player>;
  updatePlayer(id: number, updates: Partial<Player>): Promise<Player>;
  signPlayer(playerId: number, teamId: number, salary: number): Promise<Player>;
  releasePlayer(playerId: number): Promise<Player>;
  
  // Agent operations
  getAllAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  
  // Match operations
  getMatch(id: number): Promise<Match | undefined>;
  getMatchesByTeam(teamId: number): Promise<Match[]>;
  getUpcomingMatches(teamId: number): Promise<Match[]>;
  createMatch(match: Omit<Match, 'id' | 'createdAt'>): Promise<Match>;
  updateMatch(id: number, updates: Partial<Match>): Promise<Match>;
  
  // Tournament operations
  getTournament(id: number): Promise<Tournament | undefined>;
  getActiveTournaments(): Promise<Tournament[]>;
  createTournament(tournament: Omit<Tournament, 'id' | 'createdAt'>): Promise<Tournament>;
  
  // Scouting operations
  getScoutingReports(teamId: number): Promise<Scouting[]>;
  createScoutingReport(report: Omit<Scouting, 'id' | 'scoutedAt'>): Promise<Scouting>;
  
  // Game state operations
  getGameState(userId: number): Promise<GameState | undefined>;
  createGameState(userId: number): Promise<GameState>;
  updateGameState(userId: number, updates: Partial<GameState>): Promise<GameState>;
  
  // Staff operations
  getStaffByTeam(teamId: number): Promise<Staff[]>;
  getAvailableStaff(): Promise<Staff[]>;
  createStaff(staff: Omit<Staff, 'id' | 'createdAt'>): Promise<Staff>;
  hireStaff(staffId: number, teamId: number): Promise<Staff>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private teams: Map<number, Team> = new Map();
  private players: Map<number, Player> = new Map();
  private agents: Map<number, Agent> = new Map();
  private matches: Map<number, Match> = new Map();
  private tournaments: Map<number, Tournament> = new Map();
  private scoutingReports: Map<number, Scouting> = new Map();
  private gameStates: Map<number, GameState> = new Map();
  private staffMembers: Map<number, Staff> = new Map();
  
  private currentUserId = 1;
  private currentTeamId = 1;
  private currentPlayerId = 1;
  private currentAgentId = 1;
  private currentMatchId = 1;
  private currentTournamentId = 1;
  private currentScoutingId = 1;
  private currentGameStateId = 1;
  private currentStaffId = 1;

  constructor() {
    this.initializeAgents();
    this.initializePlayers();
    this.initializeStaff();
    this.initializeTournaments();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Team operations
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getTeamsByUser(userId: number): Promise<Team[]> {
    return Array.from(this.teams.values()).filter(team => team.userId === userId);
  }

  async createTeam(teamData: Omit<Team, 'id' | 'createdAt'>): Promise<Team> {
    const id = this.currentTeamId++;
    const team: Team = {
      ...teamData,
      id,
      budget: teamData.budget || '1000000', // Give starting budget of $1,000,000
      createdAt: new Date()
    };
    this.teams.set(id, team);
    return team;
  }

  async updateTeam(id: number, updates: Partial<Team>): Promise<Team> {
    const team = this.teams.get(id);
    if (!team) throw new Error('Team not found');
    
    const updatedTeam = { ...team, ...updates };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  // Player operations
  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayersByTeam(teamId: number): Promise<Player[]> {
    return Array.from(this.players.values()).filter(player => player.teamId === teamId);
  }

  async getAvailablePlayers(limit = 100): Promise<Player[]> {
    return Array.from(this.players.values())
      .filter(player => player.isAvailable)
      .slice(0, limit);
  }

  async createPlayer(playerData: Omit<Player, 'id' | 'createdAt'>): Promise<Player> {
    const id = this.currentPlayerId++;
    const player: Player = {
      ...playerData,
      id,
      createdAt: new Date()
    };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: number, updates: Partial<Player>): Promise<Player> {
    const player = this.players.get(id);
    if (!player) throw new Error('Player not found');
    
    const updatedPlayer = { ...player, ...updates };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }

  async signPlayer(playerId: number, teamId: number, salary: number): Promise<Player> {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Player not found');
    
    const updatedPlayer = {
      ...player,
      teamId,
      salary: salary.toString(),
      isAvailable: false,
      contractEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year contract
    };
    
    this.players.set(playerId, updatedPlayer);
    return updatedPlayer;
  }

  async releasePlayer(playerId: number): Promise<Player> {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Player not found');
    
    const updatedPlayer = {
      ...player,
      teamId: null,
      salary: null,
      isAvailable: true,
      isStarter: false,
      isSubstitute: false,
      contractEnd: null
    };
    
    this.players.set(playerId, updatedPlayer);
    return updatedPlayer;
  }

  // Agent operations
  async getAllAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  // Match operations
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getMatchesByTeam(teamId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => match.homeTeamId === teamId || match.awayTeamId === teamId
    );
  }

  async getUpcomingMatches(teamId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => (match.homeTeamId === teamId || match.awayTeamId === teamId) && 
               match.status === 'scheduled'
    );
  }

  async createMatch(matchData: Omit<Match, 'id' | 'createdAt'>): Promise<Match> {
    const id = this.currentMatchId++;
    const match: Match = {
      ...matchData,
      id,
      createdAt: new Date()
    };
    this.matches.set(id, match);
    return match;
  }

  async updateMatch(id: number, updates: Partial<Match>): Promise<Match> {
    const match = this.matches.get(id);
    if (!match) throw new Error('Match not found');
    
    const updatedMatch = { ...match, ...updates };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }

  // Tournament operations
  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async getActiveTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values()).filter(t => t.status === 'active');
  }

  async createTournament(tournamentData: Omit<Tournament, 'id' | 'createdAt'>): Promise<Tournament> {
    const id = this.currentTournamentId++;
    const tournament: Tournament = {
      ...tournamentData,
      id,
      createdAt: new Date()
    };
    this.tournaments.set(id, tournament);
    return tournament;
  }

  // Scouting operations
  async getScoutingReports(teamId: number): Promise<Scouting[]> {
    return Array.from(this.scoutingReports.values()).filter(report => report.teamId === teamId);
  }

  async createScoutingReport(reportData: Omit<Scouting, 'id' | 'scoutedAt'>): Promise<Scouting> {
    const id = this.currentScoutingId++;
    const report: Scouting = {
      ...reportData,
      id,
      scoutedAt: new Date()
    };
    this.scoutingReports.set(id, report);
    return report;
  }

  // Game state operations
  async getGameState(userId: number): Promise<GameState | undefined> {
    return Array.from(this.gameStates.values()).find(gs => gs.userId === userId);
  }

  async createGameState(userId: number): Promise<GameState> {
    const id = this.currentGameStateId++;
    const gameState: GameState = {
      id,
      userId,
      currentDate: new Date(),
      currentSeason: 1,
      phase: 'pre_season',
      tutorialCompleted: false,
      settings: {},
      updatedAt: new Date()
    };
    this.gameStates.set(id, gameState);
    return gameState;
  }

  async updateGameState(userId: number, updates: Partial<GameState>): Promise<GameState> {
    const gameState = Array.from(this.gameStates.values()).find(gs => gs.userId === userId);
    if (!gameState) throw new Error('Game state not found');
    
    const updatedGameState = { 
      ...gameState, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.gameStates.set(gameState.id, updatedGameState);
    return updatedGameState;
  }

  // Staff operations
  async getStaffByTeam(teamId: number): Promise<Staff[]> {
    return Array.from(this.staffMembers.values()).filter(staff => staff.teamId === teamId);
  }

  async getAvailableStaff(): Promise<Staff[]> {
    return Array.from(this.staffMembers.values()).filter(staff => staff.isAvailable);
  }

  async createStaff(staffData: Omit<Staff, 'id' | 'createdAt'>): Promise<Staff> {
    const id = this.currentStaffId++;
    const staff: Staff = {
      ...staffData,
      id,
      createdAt: new Date()
    };
    this.staffMembers.set(id, staff);
    return staff;
  }

  async hireStaff(staffId: number, teamId: number): Promise<Staff> {
    const staff = this.staffMembers.get(staffId);
    if (!staff) throw new Error('Staff not found');
    
    const updatedStaff = {
      ...staff,
      teamId,
      isAvailable: false,
      contractEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year contract
    };
    
    this.staffMembers.set(staffId, updatedStaff);
    return updatedStaff;
  }

  // Initialize game data
  private initializeAgents() {
    const agentData = [
      // Duelist agents (adapted from tactical FPS genre)
      { name: "Phoenix", role: "duelist", description: "Aggressive entry fragger with fire abilities", abilities: [{"name": "Blaze", "type": "signature"}, {"name": "Curveball", "type": "basic"}, {"name": "Hot Hands", "type": "basic"}, {"name": "Run It Back", "type": "ultimate"}], difficulty: 2, isOriginal: false },
      { name: "Jett", role: "duelist", description: "Mobile duelist with wind abilities", abilities: [{"name": "Updraft", "type": "basic"}, {"name": "Tailwind", "type": "signature"}, {"name": "Cloudburst", "type": "basic"}, {"name": "Blade Storm", "type": "ultimate"}], difficulty: 3, isOriginal: false },
      { name: "Reyna", role: "duelist", description: "Soul-harvesting duelist", abilities: [{"name": "Devour", "type": "basic"}, {"name": "Dismiss", "type": "basic"}, {"name": "Leer", "type": "signature"}, {"name": "Empress", "type": "ultimate"}], difficulty: 4, isOriginal: false },
      { name: "Raze", role: "duelist", description: "Explosive damage dealer", abilities: [{"name": "Blast Pack", "type": "basic"}, {"name": "Paint Shells", "type": "signature"}, {"name": "Boom Bot", "type": "basic"}, {"name": "Showstopper", "type": "ultimate"}], difficulty: 2, isOriginal: false },
      { name: "Yoru", role: "duelist", description: "Dimensional rift walker", abilities: [{"name": "Fakeout", "type": "basic"}, {"name": "Blindside", "type": "basic"}, {"name": "Gatecrash", "type": "signature"}, {"name": "Dimensional Drift", "type": "ultimate"}], difficulty: 5, isOriginal: false },
      { name: "Neon", role: "duelist", description: "Electric speedster", abilities: [{"name": "Fast Lane", "type": "basic"}, {"name": "Relay Bolt", "type": "basic"}, {"name": "High Gear", "type": "signature"}, {"name": "Overdrive", "type": "ultimate"}], difficulty: 3, isOriginal: false },
      { name: "Iso", role: "duelist", description: "Shield-manipulating assassin", abilities: [{"name": "Contingency", "type": "basic"}, {"name": "Undercut", "type": "basic"}, {"name": "Double Tap", "type": "signature"}, {"name": "Kill Contract", "type": "ultimate"}], difficulty: 4, isOriginal: false },
      
      // Controller agents
      { name: "Brimstone", role: "controller", description: "Tactical commander with smoke orbital strikes", abilities: [{"name": "Stim Beacon", "type": "basic"}, {"name": "Incendiary", "type": "basic"}, {"name": "Sky Smoke", "type": "signature"}, {"name": "Orbital Strike", "type": "ultimate"}], difficulty: 2, isOriginal: false },
      { name: "Viper", role: "controller", description: "Toxic area denial specialist", abilities: [{"name": "Snake Bite", "type": "basic"}, {"name": "Poison Cloud", "type": "basic"}, {"name": "Toxic Screen", "type": "signature"}, {"name": "Viper's Pit", "type": "ultimate"}], difficulty: 4, isOriginal: false },
      { name: "Omen", role: "controller", description: "Shadow manipulator", abilities: [{"name": "Shrouded Step", "type": "basic"}, {"name": "Paranoia", "type": "basic"}, {"name": "Dark Cover", "type": "signature"}, {"name": "From the Shadows", "type": "ultimate"}], difficulty: 3, isOriginal: false },
      { name: "Astra", role: "controller", description: "Cosmic controller", abilities: [{"name": "Nova Pulse", "type": "basic"}, {"name": "Nebula", "type": "basic"}, {"name": "Gravity Well", "type": "basic"}, {"name": "Astral Form", "type": "signature"}, {"name": "Cosmic Divide", "type": "ultimate"}], difficulty: 5, isOriginal: false },
      { name: "Harbor", role: "controller", description: "Water-bending controller", abilities: [{"name": "Cascade", "type": "basic"}, {"name": "Cove", "type": "basic"}, {"name": "High Tide", "type": "signature"}, {"name": "Reckoning", "type": "ultimate"}], difficulty: 3, isOriginal: false },
      { name: "Clove", role: "controller", description: "Immortal smoke specialist", abilities: [{"name": "Pick-me-up", "type": "basic"}, {"name": "Meddle", "type": "basic"}, {"name": "Ruse", "type": "signature"}, {"name": "Not Dead Yet", "type": "ultimate"}], difficulty: 4, isOriginal: false },
      
      // Initiator agents
      { name: "Sova", role: "initiator", description: "Information gathering hunter", abilities: [{"name": "Owl Drone", "type": "basic"}, {"name": "Shock Bolt", "type": "basic"}, {"name": "Recon Bolt", "type": "signature"}, {"name": "Hunter's Fury", "type": "ultimate"}], difficulty: 3, isOriginal: false },
      { name: "Breach", role: "initiator", description: "Area disruption specialist", abilities: [{"name": "Aftershock", "type": "basic"}, {"name": "Flashpoint", "type": "basic"}, {"name": "Fault Line", "type": "signature"}, {"name": "Rolling Thunder", "type": "ultimate"}], difficulty: 2, isOriginal: false },
      { name: "Skye", role: "initiator", description: "Australian healer and scout", abilities: [{"name": "Regrowth", "type": "basic"}, {"name": "Trailblazer", "type": "basic"}, {"name": "Guiding Light", "type": "signature"}, {"name": "Seekers", "type": "ultimate"}], difficulty: 3, isOriginal: false },
      { name: "KAY/O", role: "initiator", description: "Radiant-suppressing robot", abilities: [{"name": "FRAG/ment", "type": "basic"}, {"name": "FLASH/drive", "type": "basic"}, {"name": "ZERO/point", "type": "signature"}, {"name": "NULL/cmd", "type": "ultimate"}], difficulty: 2, isOriginal: false },
      { name: "Fade", role: "initiator", description: "Nightmare entity hunter", abilities: [{"name": "Prowler", "type": "basic"}, {"name": "Seize", "type": "basic"}, {"name": "Haunt", "type": "signature"}, {"name": "Nightfall", "type": "ultimate"}], difficulty: 4, isOriginal: false },
      { name: "Gekko", role: "initiator", description: "Creature companion controller", abilities: [{"name": "Dizzy", "type": "basic"}, {"name": "Wingman", "type": "basic"}, {"name": "Mosh Pit", "type": "signature"}, {"name": "Thrash", "type": "ultimate"}], difficulty: 3, isOriginal: false },
      
      // Sentinel agents
      { name: "Sage", role: "sentinel", description: "Healing and defensive support", abilities: [{"name": "Slow Orb", "type": "basic"}, {"name": "Healing Orb", "type": "basic"}, {"name": "Barrier Orb", "type": "signature"}, {"name": "Resurrection", "type": "ultimate"}], difficulty: 2, isOriginal: false },
      { name: "Cypher", role: "sentinel", description: "Information broker and trap specialist", abilities: [{"name": "Cyber Cage", "type": "basic"}, {"name": "Spycam", "type": "basic"}, {"name": "Trapwire", "type": "signature"}, {"name": "Neural Theft", "type": "ultimate"}], difficulty: 3, isOriginal: false },
      { name: "Killjoy", role: "sentinel", description: "German tech genius", abilities: [{"name": "Alarmbot", "type": "basic"}, {"name": "Turret", "type": "basic"}, {"name": "Nanoswarm", "type": "signature"}, {"name": "Lockdown", "type": "ultimate"}], difficulty: 3, isOriginal: false },
      { name: "Chamber", role: "sentinel", description: "French weapons designer", abilities: [{"name": "Trademark", "type": "basic"}, {"name": "Headhunter", "type": "basic"}, {"name": "Rendezvous", "type": "signature"}, {"name": "Tour de Force", "type": "ultimate"}], difficulty: 4, isOriginal: false },
      { name: "Deadlock", role: "sentinel", description: "Norwegian defensive specialist", abilities: [{"name": "GravNet", "type": "basic"}, {"name": "Sonic Sensor", "type": "basic"}, {"name": "Barrier Mesh", "type": "signature"}, {"name": "Annihilation", "type": "ultimate"}], difficulty: 3, isOriginal: false },
      { name: "Vyse", role: "sentinel", description: "Liquid metal manipulator", abilities: [{"name": "Shear", "type": "basic"}, {"name": "Arc Rose", "type": "basic"}, {"name": "Razorvine", "type": "signature"}, {"name": "Steel Garden", "type": "ultimate"}], difficulty: 4, isOriginal: false },
      
      // 2 Original agents
      { name: "Nexus", role: "initiator", description: "Digital realm hacker who manipulates electronic systems", abilities: [{"name": "System Breach", "type": "basic"}, {"name": "Data Pulse", "type": "basic"}, {"name": "Network Override", "type": "signature"}, {"name": "Total Shutdown", "type": "ultimate"}], difficulty: 4, isOriginal: true },
      { name: "Tempest", role: "controller", description: "Weather manipulation specialist controlling atmospheric conditions", abilities: [{"name": "Wind Gust", "type": "basic"}, {"name": "Lightning Strike", "type": "basic"}, {"name": "Storm Cloud", "type": "signature"}, {"name": "Hurricane", "type": "ultimate"}], difficulty: 5, isOriginal: true }
    ];

    agentData.forEach(agent => {
      const id = this.currentAgentId++;
      this.agents.set(id, { ...agent, id });
    });
  }

  private initializePlayers() {
    const roles = ['duelist', 'initiator', 'controller', 'sentinel', 'flex'];
    const nationalities = ['USA', 'UK', 'Germany', 'France', 'Brazil', 'Korea', 'Japan', 'Sweden', 'Denmark', 'Finland', 'Canada', 'Australia', 'Spain', 'Poland', 'Turkey', 'Russia'];
    const firstNames = ['Alex', 'Jordan', 'Sam', 'Casey', 'Riley', 'Avery', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Gray', 'Hunter', 'Jaden', 'Kai', 'Logan', 'Mason', 'Noah', 'Parker', 'Quinn', 'Reese', 'Sage', 'Taylor', 'Tyler', 'Vale', 'Wren', 'Zion'];
    const lastNames = ['Anderson', 'Baker', 'Clark', 'Davis', 'Evans', 'Foster', 'Green', 'Hall', 'Jackson', 'King', 'Lee', 'Miller', 'Nelson', 'Parker', 'Roberts', 'Smith', 'Taylor', 'Turner', 'Walker', 'White', 'Wilson', 'Young'];

    for (let i = 0; i < 120; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
      const age = Math.floor(Math.random() * 10) + 18; // 18-27 years old

      // Generate stats based on role
      const baseStats = this.generatePlayerStats(role);
      const marketValue = this.calculateMarketValue(baseStats, age);

      const player: Player = {
        id: this.currentPlayerId++,
        name: `${firstName} ${lastName}`,
        teamId: null,
        role,
        nationality,
        age,
        aim: baseStats.aim,
        gameIq: baseStats.gameIq,
        clutch: baseStats.clutch,
        teamwork: baseStats.teamwork,
        positioning: baseStats.positioning,
        salary: null,
        contractEnd: null,
        morale: Math.floor(Math.random() * 30) + 70, // 70-100
        energy: 100,
        isStarter: false,
        isSubstitute: false,
        isAvailable: true,
        marketValue: marketValue.toString(),
        createdAt: new Date()
      };

      this.players.set(player.id, player);
    }
  }

  private generatePlayerStats(role: string) {
    // Role-based stat generation with some randomness
    const baseStats = {
      duelist: { aim: 85, gameIq: 70, clutch: 80, teamwork: 65, positioning: 70 },
      initiator: { aim: 75, gameIq: 85, clutch: 75, teamwork: 80, positioning: 80 },
      controller: { aim: 70, gameIq: 90, clutch: 70, teamwork: 85, positioning: 85 },
      sentinel: { aim: 75, gameIq: 80, clutch: 85, teamwork: 75, positioning: 90 },
      flex: { aim: 80, gameIq: 80, clutch: 80, teamwork: 80, positioning: 80 }
    };

    const base = baseStats[role as keyof typeof baseStats] || baseStats.flex;
    
    return {
      aim: Math.max(50, Math.min(99, base.aim + Math.floor(Math.random() * 21) - 10)),
      gameIq: Math.max(50, Math.min(99, base.gameIq + Math.floor(Math.random() * 21) - 10)),
      clutch: Math.max(50, Math.min(99, base.clutch + Math.floor(Math.random() * 21) - 10)),
      teamwork: Math.max(50, Math.min(99, base.teamwork + Math.floor(Math.random() * 21) - 10)),
      positioning: Math.max(50, Math.min(99, base.positioning + Math.floor(Math.random() * 21) - 10))
    };
  }

  private calculateMarketValue(stats: any, age: number): number {
    const averageSkill = (stats.aim + stats.gameIq + stats.clutch + stats.teamwork + stats.positioning) / 5;
    const ageMultiplier = age < 25 ? 1.2 : age > 26 ? 0.8 : 1.0;
    return Math.floor(averageSkill * 1000 * ageMultiplier);
  }

  private initializeStaff() {
    const staffRoles = ['analyst', 'coach', 'mental_trainer', 'statistician'];
    const names = ['Dr. Martinez', 'Coach Thompson', 'Sarah Chen', 'Mike Johnson', 'Prof. Anderson', 'Lisa Park', 'David Kim', 'Emma Wilson'];
    
    names.forEach((name, index) => {
      const role = staffRoles[index % staffRoles.length];
      const experience = Math.floor(Math.random() * 50) + 50;
      const reputation = Math.floor(Math.random() * 40) + 60;
      
      const staff: Staff = {
        id: this.currentStaffId++,
        teamId: null,
        name,
        role,
        specialty: this.getSpecialty(role),
        salary: (experience * 100).toString(),
        contractEnd: null,
        experience,
        reputation,
        isAvailable: true,
        createdAt: new Date()
      };
      
      this.staffMembers.set(staff.id, staff);
    });
  }

  private getSpecialty(role: string): string {
    const specialties = {
      analyst: 'Match Analysis',
      coach: 'Strategy Development',
      mental_trainer: 'Performance Psychology',
      statistician: 'Data Analytics'
    };
    return specialties[role as keyof typeof specialties] || 'General';
  }

  private initializeTournaments() {
    const tournaments = [
      {
        name: 'National Championship',
        type: 'national',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        prizePool: '500000',
        maxTeams: 16,
        currentRound: 'group_stage',
        bracketData: {}
      },
      {
        name: 'Continental Masters',
        type: 'continental',
        status: 'upcoming',
        startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        prizePool: '1000000',
        maxTeams: 12,
        currentRound: 'group_stage',
        bracketData: {}
      }
    ];

    tournaments.forEach(tournament => {
      const id = this.currentTournamentId++;
      this.tournaments.set(id, { ...tournament, id, createdAt: new Date() });
    });
  }
}

export const storage = new MemStorage();
