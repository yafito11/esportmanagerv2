import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { SupabaseStorage } from "./supabase";
import { generateAIResponse, AIAnalysisRequest } from "./openai";

const supabaseStorage = new SupabaseStorage();

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const user = await storage.createUser({ username, password });
      const gameState = await storage.createGameState(user.id);
      
      res.json({ user: { id: user.id, username: user.username }, gameState });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const gameState = await storage.getGameState(user.id);
      res.json({ user: { id: user.id, username: user.username }, gameState });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Team routes
  app.get("/api/teams/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const teams = await storage.getTeamsByUser(userId);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const team = await storage.createTeam(req.body);
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to create team" });
    }
  });

  app.put("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const team = await storage.updateTeam(id, req.body);
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to update team" });
    }
  });

  // Player routes
  app.get("/api/players/available", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const players = await storage.getAvailablePlayers(limit);
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch available players" });
    }
  });

  app.get("/api/players/team/:teamId", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const players = await storage.getPlayersByTeam(teamId);
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team players" });
    }
  });

  app.post("/api/players/scout", async (req, res) => {
    try {
      const { playerId, teamId } = req.body;
      const player = await storage.getPlayer(playerId);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      
      const overallRating = Math.floor((player.aim + player.gameIq + player.clutch + player.teamwork + player.positioning) / 5);
      const report = await storage.createScoutingReport({
        teamId,
        playerId,
        report: `Strong ${player.role} player with ${player.aim > 80 ? 'excellent aim' : 'good mechanics'}. Market value: $${player.marketValue}`,
        rating: overallRating,
        recommendation: overallRating > 80 ? 'sign' : overallRating > 65 ? 'monitor' : 'pass'
      });
      
      res.json({ player, scoutingReport: report });
    } catch (error) {
      res.status(500).json({ error: "Failed to scout player" });
    }
  });

  app.post("/api/players/sign", async (req, res) => {
    try {
      const { playerId, teamId, salary } = req.body;
      const player = await storage.signPlayer(playerId, teamId, salary);
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to sign player" });
    }
  });

  app.post("/api/players/release/:playerId", async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId);
      const player = await storage.releasePlayer(playerId);
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to release player" });
    }
  });

  app.put("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.updatePlayer(id, req.body);
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to update player" });
    }
  });

  // Agent routes
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  // Match routes
  app.get("/api/matches/team/:teamId", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const matches = await storage.getMatchesByTeam(teamId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.get("/api/matches/upcoming/:teamId", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const matches = await storage.getUpcomingMatches(teamId);
      
      // Always return data, don't use 304 for this endpoint
      res.setHeader('Cache-Control', 'no-cache');
      res.json(matches);
    } catch (error) {
      console.error("Error fetching upcoming matches:", error);
      res.status(500).json({ error: "Failed to fetch upcoming matches" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const match = await storage.createMatch(req.body);
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to create match" });
    }
  });

  app.put("/api/matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const match = await storage.updateMatch(id, req.body);
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to update match" });
    }
  });

  // Tournament routes
  app.get("/api/tournaments/active", async (req, res) => {
    try {
      const tournaments = await storage.getActiveTournaments();
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournaments" });
    }
  });

  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tournament = await storage.getTournament(id);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournament" });
    }
  });

  // Scouting routes
  app.get("/api/scouting/:teamId", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const reports = await storage.getScoutingReports(teamId);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scouting reports" });
    }
  });

  app.post("/api/scouting", async (req, res) => {
    try {
      const report = await storage.createScoutingReport(req.body);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to create scouting report" });
    }
  });

  // Staff routes
  app.get("/api/staff/available", async (req, res) => {
    try {
      const staff = await storage.getAvailableStaff();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch available staff" });
    }
  });

  app.get("/api/staff/team/:teamId", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const staff = await storage.getStaffByTeam(teamId);
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team staff" });
    }
  });

  app.post("/api/staff/hire", async (req, res) => {
    try {
      const { staffId, teamId } = req.body;
      const staff = await storage.hireStaff(staffId, teamId);
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to hire staff" });
    }
  });

  // Game state routes
  app.get("/api/gamestate/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const gameState = await storage.getGameState(userId);
      if (!gameState) {
        return res.status(404).json({ error: "Game state not found" });
      }
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game state" });
    }
  });

  app.put("/api/gamestate/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const gameState = await storage.updateGameState(userId, req.body);
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ error: "Failed to update game state" });
    }
  });

  // AI Chat routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context, language } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Determine AI request type based on message content
      const messageLower = message.toLowerCase();
      let requestType: AIAnalysisRequest['type'] = 'general_chat';
      
      if (messageLower.includes('lineup') || messageLower.includes('roster') || messageLower.includes('composition')) {
        requestType = 'team_composition';
      } else if (messageLower.includes('strategy') || messageLower.includes('tactics')) {
        requestType = 'strategic_advice';
      } else if (messageLower.includes('draft') || messageLower.includes('agent')) {
        requestType = 'draft_advice';
      } else if (messageLower.includes('player') && (messageLower.includes('analyze') || messageLower.includes('scout'))) {
        requestType = 'player_analysis';
      } else if (messageLower.includes('predict') || messageLower.includes('outcome')) {
        requestType = 'match_prediction';
      }

      const aiRequest: AIAnalysisRequest = {
        type: requestType,
        context: {
          userMessage: message,
          language: language || 'english',
          ...context
        }
      };

      const aiResponse = await generateAIResponse(aiRequest);
      res.json(aiResponse);
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({ 
        error: "AI service temporarily unavailable",
        fallback: "I'm having trouble processing your request right now. Please try again in a moment."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
