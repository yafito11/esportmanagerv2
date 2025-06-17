import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Calendar, Users, Search, MessageCircle, Trophy, ShoppingCart,
  Settings, LogOut, Play, Target, BarChart3, Clock, Zap, Menu
} from "lucide-react";

import Schedule from "./modules/Schedule";
import TeamManagement from "./modules/TeamManagement";
import TransfersAndScouting from "./modules/TransfersAndScouting";
import AIChat from "./modules/AIChat";
import Tournaments from "./modules/Tournaments";
import Marketplace from "./modules/Marketplace";
import MatchSimulation from "./match/MatchSimulation";
import AgentStats from "./modules/AgentStats";

import { useGameState } from "../lib/stores/useGameState";
import { useTeamState } from "../lib/stores/useTeamState";
import { useTournamentState } from "../lib/stores/useTournamentState";
import { apiRequest } from "../lib/queryClient";

function Dashboard() {
  const { user, gameState, currentView, setCurrentView, logout } = useGameState();
  const { currentTeam, setCurrentTeam, setTeamPlayers, setAvailablePlayers } = useTeamState();
  const { setAgents, currentMatch, setCurrentMatch, setMatchPhase } = useTournamentState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load user's teams
      const teamsResponse = await apiRequest("GET", `/api/teams/${user.id}`);
      const teams = await teamsResponse.json();

      if (teams.length > 0) {
        setCurrentTeam(teams[0]);

        // Load team players
        const playersResponse = await apiRequest("GET", `/api/players/team/${teams[0].id}`);
        const teamPlayers = await playersResponse.json();
        setTeamPlayers(teamPlayers);
      }

      // Load available players
      const availablePlayersResponse = await apiRequest("GET", "/api/players/available");
      const availablePlayers = await availablePlayersResponse.json();
      setAvailablePlayers(availablePlayers);

      // Load agents
      const agentsResponse = await apiRequest("GET", "/api/agents");
      const agents = await agentsResponse.json();
      setAgents(agents);

    } catch (err) {
      setError("Failed to load game data");
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-lg">Loading game data...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center text-red-500">
            <p className="text-lg">{error}</p>
            <Button onClick={loadInitialData} className="mt-4">
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show match simulation if there's a current match
  if (currentMatch) {
    return <MatchSimulation />;
  }

  const navigationItems = [
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "team", label: "Team", icon: Users },
    { id: "transfers", label: "Transfers", icon: Search },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "tournaments", label: "Tournaments", icon: Trophy },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
    { id: "agents", label: "Agents", icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Esport Manager: The Codebreaker
              </h1>
              {currentTeam && (
                <Badge variant="outline" className="text-xs sm:text-sm w-fit">
                  {currentTeam.name}
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Season {gameState?.currentSeason || 1}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>${Number(currentTeam?.budget || '0').toLocaleString()}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-slate-300 hover:text-white w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Mobile Navigation */}
          <div className="lg:hidden mb-4">
            <div className="overflow-x-auto">
              <div className="flex space-x-2 pb-2 min-w-max">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? "secondary" : "ghost"}
                      size="sm"
                      className={`flex-shrink-0 ${
                        currentView === item.id
                          ? "bg-purple-600/20 text-purple-300"
                          : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      }`}
                      onClick={() => setCurrentView(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? "secondary" : "ghost"}
                        className={`w-full justify-start ${
                          currentView === item.id
                            ? "bg-purple-600/20 text-purple-300 border-l-4 border-purple-500"
                            : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        }`}
                        onClick={() => setCurrentView(item.id)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Team Rating</span>
                  <span className="text-white font-mono">85</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">W/L Ratio</span>
                  <span className="text-green-400 font-mono">12/3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Next Match</span>
                  <span className="text-yellow-400 font-mono">2 days</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <Card className="bg-slate-800/50 border-slate-700 min-h-[600px]">
              <CardContent className="p-3 sm:p-6">
                  {currentView === "schedule" && <Schedule />}
                  {currentView === "team" && <TeamManagement />}
                  {currentView === "transfers" && <TransfersAndScouting />}
                  {currentView === "chat" && <AIChat />}
                  {currentView === "tournaments" && <Tournaments />}
                  {currentView === "marketplace" && <Marketplace />}
                  {currentView === "agents" && <AgentStats />}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
```

```python
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Calendar, Users, Search, MessageCircle, Trophy, ShoppingCart,
  Settings, LogOut, Play, Target, BarChart3, Clock, Zap, Menu
} from "lucide-react";

import Schedule from "./modules/Schedule";
import TeamManagement from "./modules/TeamManagement";
import TransfersAndScouting from "./modules/TransfersAndScouting";
import AIChat from "./modules/AIChat";
import Tournaments from "./modules/Tournaments";
import Marketplace from "./modules/Marketplace";
import MatchSimulation from "./match/MatchSimulation";
import AgentStats from "./modules/AgentStats";

import { useGameState } from "../lib/stores/useGameState";
import { useTeamState } from "../lib/stores/useTeamState";
import { useTournamentState } from "../lib/stores/useTournamentState";
import { apiRequest } from "../lib/queryClient";

function Dashboard() {
  const { user, gameState, currentView, setCurrentView, logout } = useGameState();
  const { currentTeam, setCurrentTeam, setTeamPlayers, setAvailablePlayers } = useTeamState();
  const { setAgents, currentMatch, setCurrentMatch, setMatchPhase } = useTournamentState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load user's teams
      const teamsResponse = await apiRequest("GET", `/api/teams/${user.id}`);
      const teams = await teamsResponse.json();

      if (teams.length > 0) {
        setCurrentTeam(teams[0]);

        // Load team players
        const playersResponse = await apiRequest("GET", `/api/players/team/${teams[0].id}`);
        const teamPlayers = await playersResponse.json();
        setTeamPlayers(teamPlayers);
      }

      // Load available players
      const availablePlayersResponse = await apiRequest("GET", "/api/players/available");
      const availablePlayers = await availablePlayersResponse.json();
      setAvailablePlayers(availablePlayers);

      // Load agents
      const agentsResponse = await apiRequest("GET", "/api/agents");
      const agents = await agentsResponse.json();
      setAgents(agents);

    } catch (err) {
      setError("Failed to load game data");
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-lg">Loading game data...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center text-red-500">
            <p className="text-lg">{error}</p>
            <Button onClick={loadInitialData} className="mt-4">
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show match simulation if there's a current match
  if (currentMatch) {
    return <MatchSimulation />;
  }

  const navigationItems = [
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "team", label: "Team", icon: Users },
    { id: "transfers", label: "Transfers", icon: Search },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "tournaments", label: "Tournaments", icon: Trophy },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
    { id: "agents", label: "Agents", icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Esport Manager: The Codebreaker
              </h1>
              {currentTeam && (
                <Badge variant="outline" className="text-xs sm:text-sm w-fit">
                  {currentTeam.name}
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Season {gameState?.currentSeason || 1}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>${Number(currentTeam?.budget || '0').toLocaleString()}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-slate-300 hover:text-white w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Mobile Navigation */}
          <div className="lg:hidden mb-4">
            <div className="overflow-x-auto">
              <div className="flex space-x-2 pb-2 min-w-max">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? "secondary" : "ghost"}
                      size="sm"
                      className={`flex-shrink-0 ${
                        currentView === item.id
                          ? "bg-purple-600/20 text-purple-300"
                          : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      }`}
                      onClick={() => setCurrentView(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? "secondary" : "ghost"}
                        className={`w-full justify-start ${
                          currentView === item.id
                            ? "bg-purple-600/20 text-purple-300 border-l-4 border-purple-500"
                            : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        }`}
                        onClick={() => setCurrentView(item.id)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Team Rating</span>
                  <span className="text-white font-mono">85</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">W/L Ratio</span>
                  <span className="text-green-400 font-mono">12/3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Next Match</span>
                  <span className="text-yellow-400 font-mono">2 days</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <Card className="bg-slate-800/50 border-slate-700 min-h-[600px]">
              <CardContent className="p-3 sm:p-6">
                  {currentView === "schedule" && <Schedule />}
                  {currentView === "team" && <TeamManagement />}
                  {currentView === "transfers" && <TransfersAndScouting />}
                  {currentView === "chat" && <AIChat />}
                  {currentView === "tournaments" && <Tournaments />}
                  {currentView === "marketplace" && <Marketplace />}
                  {currentView === "agents" && <AgentStats />}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
```

```python
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Calendar, Users, Search, MessageCircle, Trophy, ShoppingCart,
  Settings, LogOut, Play, Target, BarChart3, Clock, Zap, Menu
} from "lucide-react";

import Schedule from "./modules/Schedule";
import TeamManagement from "./modules/TeamManagement";
import TransfersAndScouting from "./modules/TransfersAndScouting";
import AIChat from "./modules/AIChat";
import Tournaments from "./modules/Tournaments";
import Marketplace from "./modules/Marketplace";
import MatchSimulation from "./match/MatchSimulation";
import AgentStats from "./modules/AgentStats";

import { useGameState } from "../lib/stores/useGameState";
import { useTeamState } from "../lib/stores/useTeamState";
import { useTournamentState } from "../lib/stores/useTournamentState";
import { apiRequest } from "../lib/queryClient";

function Dashboard() {
  const { user, gameState, currentView, setCurrentView, logout } = useGameState();
  const { currentTeam, setCurrentTeam, setTeamPlayers, setAvailablePlayers } = useTeamState();
  const { setAgents, currentMatch, setCurrentMatch, setMatchPhase } = useTournamentState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load user's teams
      const teamsResponse = await apiRequest("GET", `/api/teams/${user.id}`);
      const teams = await teamsResponse.json();

      if (teams.length > 0) {
        setCurrentTeam(teams[0]);

        // Load team players
        const playersResponse = await apiRequest("GET", `/api/players/team/${teams[0].id}`);
        const teamPlayers = await playersResponse.json();
        setTeamPlayers(teamPlayers);
      }

      // Load available players
      const availablePlayersResponse = await apiRequest("GET", "/api/players/available");
      const availablePlayers = await availablePlayersResponse.json();
      setAvailablePlayers(availablePlayers);

      // Load agents
      const agentsResponse = await apiRequest("GET", "/api/agents");
      const agents = await agentsResponse.json();
      setAgents(agents);

    } catch (err) {
      setError("Failed to load game data");
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-lg">Loading game data...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center text-red-500">
            <p className="text-lg">{error}</p>
            <Button onClick={loadInitialData} className="mt-4">
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show match simulation if there's a current match
  if (currentMatch) {
    return <MatchSimulation />;
  }

  const navigationItems = [
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "team", label: "Team", icon: Users },
    { id: "transfers", label: "Transfers", icon: Search },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "tournaments", label: "Tournaments", icon: Trophy },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
    { id: "agents", label: "Agents", icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Esport Manager: The Codebreaker
              </h1>
              {currentTeam && (
                <Badge variant="outline" className="text-xs sm:text-sm w-fit">
                  {currentTeam.name}
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Season {gameState?.currentSeason || 1}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>${Number(currentTeam?.budget || '0').toLocaleString()}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-slate-300 hover:text-white w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Mobile Navigation */}
          <div className="lg:hidden mb-4">
            <div className="overflow-x-auto">
              <div className="flex space-x-2 pb-2 min-w-max">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? "secondary" : "ghost"}
                      size="sm"
                      className={`flex-shrink-0 ${
                        currentView === item.id
                          ? "bg-purple-600/20 text-purple-300"
                          : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      }`}
                      onClick={() => setCurrentView(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? "secondary" : "ghost"}
                        className={`w-full justify-start ${
                          currentView === item.id
                            ? "bg-purple-600/20 text-purple-300 border-l-4 border-purple-500"
                            : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        }`}
                        onClick={() => setCurrentView(item.id)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Team Rating</span>
                  <span className="text-white font-mono">85</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">W/L Ratio</span>
                  <span className="text-green-400 font-mono">12/3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Next Match</span>
                  <span className="text-yellow-400 font-mono">2 days</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <Card className="bg-slate-800/50 border-slate-700 min-h-[600px]">
              <CardContent className="p-3 sm:p-6">
                  {currentView === "schedule" && <Schedule />}
                  {currentView === "team" && <TeamManagement />}
                  {currentView === "transfers" && <TransfersAndScouting />}
                  {currentView === "chat" && <AIChat />}
                  {currentView === "tournaments" && <Tournaments />}
                  {currentView === "marketplace" && <Marketplace />}
                  {currentView === "agents" && <AgentStats />}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
```

```python
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Calendar, Users, Search, MessageCircle, Trophy, ShoppingCart,
  Settings, LogOut, Play, Target, BarChart3, Clock, Zap, Menu
} from "lucide-react";

import Schedule from "./modules/Schedule";
import TeamManagement from "./modules/TeamManagement";
import TransfersAndScouting from "./modules/TransfersAndScouting";
import AIChat from "./modules/AIChat";
import Tournaments from "./modules/Tournaments";
import Marketplace from "./modules/Marketplace";
import MatchSimulation from "./match/MatchSimulation";
import AgentStats from "./modules/AgentStats";

import { useGameState } from "../lib/stores/useGameState";
import { useTeamState } from "../lib/stores/useTeamState";
import { useTournamentState } from "../lib/stores/useTournamentState";
import { apiRequest } from "../lib/queryClient";

function Dashboard() {
  const { user, gameState, currentView, setCurrentView, logout } = useGameState();
  const { currentTeam, setCurrentTeam, setTeamPlayers, setAvailablePlayers } = useTeamState();
  const { setAgents, currentMatch, setCurrentMatch, setMatchPhase } = useTournamentState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load user's teams
      const teamsResponse = await apiRequest("GET", `/api/teams/${user.id}`);
      const teams = await teamsResponse.json();

      if (teams.length > 0) {
        setCurrentTeam(teams[0]);

        // Load team players
        const playersResponse = await apiRequest("GET", `/api/players/team/${teams[0].id}`);
        const teamPlayers = await playersResponse.json();
        setTeamPlayers(teamPlayers);
      }

      // Load available players
      const availablePlayersResponse = await apiRequest("GET", "/api/players/available");
      const availablePlayers = await availablePlayersResponse.json();
      setAvailablePlayers(availablePlayers);

      // Load agents
      const agentsResponse = await apiRequest("GET", "/api/agents");
      const agents = await agentsResponse.json();
      setAgents(agents);

    } catch (err) {
      setError("Failed to load game data");
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-lg">Loading game data...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center text-red-500">
            <p className="text-lg">{error}</p>
            <Button onClick={loadInitialData} className="mt-4">
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show match simulation if there's a current match
  if (currentMatch) {
    return <MatchSimulation />;
  }

  const navigationItems = [
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "team", label: "Team", icon: Users },
    { id: "transfers", label: "Transfers", icon: Search },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "tournaments", label: "Tournaments", icon: Trophy },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
    { id: "agents", label: "Agents", icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Esport Manager: The Codebreaker
              </h1>
              {currentTeam && (
                <Badge variant="outline" className="text-xs sm:text-sm w-fit">
                  {currentTeam.name}
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Season {gameState?.currentSeason || 1}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>${Number(currentTeam?.budget || '0').toLocaleString()}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-slate-300 hover:text-white w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Mobile Navigation */}
          <div className="lg:hidden mb-4">
            <div className="overflow-x-auto">
              <div className="flex space-x-2 pb-2 min-w-max">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? "secondary" : "ghost"}
                      size="sm"
                      className={`flex-shrink-0 ${
                        currentView === item.id
                          ? "bg-purple-600/20 text-purple-300"
                          : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      }`}
                      onClick={() => setCurrentView(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? "secondary" : "ghost"}
                        className={`w-full justify-start ${
                          currentView === item.id
                            ? "bg-purple-600/20 text-purple-300 border-l-4 border-purple-500"
                            : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        }`}
                        onClick={() => setCurrentView(item.id)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Team Rating</span>
                  <span className="text-white font-mono">85</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">W/L Ratio</span>
                  <span className="text-green-400 font-mono">12/3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Next Match</span>
                  <span className="text-yellow-400 font-mono">2 days</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <Card className="bg-slate-800/50 border-slate-700 min-h-[600px]">
              <CardContent className="p-3 sm:p-6">
                  {currentView === "schedule" && <Schedule />}
                  {currentView === "team" && <TeamManagement />}
                  {currentView === "transfers" && <TransfersAndScouting />}
                  {currentView === "chat" && <AIChat />}
                  {currentView === "tournaments" && <Tournaments />}
                  {currentView === "marketplace" && <Marketplace />}
                  {currentView === "agents" && <AgentStats />}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
```

Applying the requested changes to the Tournaments component to update the match flow and team names display.

```python
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useTournamentState } from "../../lib/stores/useTournamentState";
import { useGameState } from "../../lib/stores/useGameState";

function Tournaments() {
  const { matches, fetchMatches, setCurrentMatch, setMatchPhase } = useTournamentState();
  const { currentTeam } = useGameState();
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMatches = async () => {
      try {
        await fetchMatches();
      } catch (err) {
        setError("Failed to load matches");
        console.error("Load error:", err);
      }
    };

    loadMatches();
  }, [fetchMatches]);

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center text-red-500">
          <p className="text-lg">{error}</p>
        </div>
      </Card>
    );
  }

  const handlePlayMatch = (match) => {
    // Placeholder for now, will implement match simulation later
    alert(`Playing match: ${match.homeTeamId} vs ${match.awayTeamId}`);
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>Upcoming Matches</CardTitle>
      </CardHeader>
      <CardContent>
        {matches && matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="bg-slate-800/50 border-slate-700">
                <CardContent>
                  
                  
                  <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-white">
                              {match.homeTeamId === currentTeam?.id ? currentTeam?.name : `Team ${match.homeTeamId}`} vs {match.awayTeamId === currentTeam?.id ? currentTeam?.name : `Team ${match.awayTeamId}`}
                            </h3>
                            <p className="text-sm text-slate-400">
                              {match.round} • {match.map}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(match.scheduledDate).toLocaleDateString()}
                            </p>
                          </div>
                          
                          
                          <Button 
                onClick={() => {
                  setCurrentMatch(match);
                  setMatchPhase('simulation');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Play Match
              </Button>
                        </div>
                        
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>No upcoming matches found.</p>
        )}
      </CardContent>
    </div>
  );
}

export default Tournaments;
```

```json
{
  "tournaments_component": {
    "description": "Updates the Tournaments component to navigate directly to the simulation when a match is clicked and displays team names correctly.",
    "changes": [
      {
        "type": "replace",
        "target": "<Button \n                onClick={() => handlePlayMatch(match)}\n                className=\"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded\"\n              >\n                Play Match\n              </Button>",
        "replacement": "<Button \n                onClick={() => {\n                  setCurrentMatch(match);\n                  setMatchPhase('simulation');\n                }}\n                className=\"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded\"\n              >\n                Play Match\n              </Button>"
      },
      {
        "type": "replace",
        "target": "<div className=\"flex justify-between items-center\">\n                          <div>\n                            <h3 className=\"font-semibold text-white\">\n                              Team {match.homeTeamId} vs Team {match.awayTeamId}\n                            </h3>\n                            <p className=\"text-sm text-slate-400\">\n                              {match.round} • {match.map}\n                            </p>\n                            <p className=\"text-xs text-slate-500\">\n                              {new Date(match.scheduledDate).toLocaleDateString()}\n                            </p>\n                          </div>",
        "replacement": "<div className=\"flex justify-between items-center\">\n                          <div>\n                            <h3 className=\"font-semibold text-white\">\n                              {match.homeTeamId === currentTeam?.id ? currentTeam?.name : `Team ${match.homeTeamId}`} vs {match.awayTeamId === currentTeam?.id ? currentTeam?.name : `Team ${match.awayTeamId}`}\n                            </h3>\n                            <p className=\"text-sm text-slate-400\">\n                              {match.round} • {match.map}\n                            </p>\n                            <p className=\"text-xs text-slate-500\">\n                              {new Date(match.scheduledDate).toLocaleDateString()}\n                            </p>\n                          </div>"
      }
    ]
  }
}
```

```
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useTournamentState } from "../../lib/stores/useTournamentState";
import { useGameState } from "../../lib/stores/useGameState";

function Tournaments() {
  const { matches, fetchMatches, setCurrentMatch, setMatchPhase } = useTournamentState();
  const { currentTeam } = useGameState();
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMatches = async () => {
      try {
        await fetchMatches();
      } catch (err) {
        setError("Failed to load matches");
        console.error("Load error:", err);
      }
    };

    loadMatches();
  }, [fetchMatches]);

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center text-red-500">
          <p className="text-lg">{error}</p>
        </div>
      </Card>
    );
  }

  const handlePlayMatch = (match) => {
    // Placeholder for now, will implement match simulation later
    alert(`Playing match: ${match.homeTeamId} vs ${match.awayTeamId}`);
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>Upcoming Matches</CardTitle>
      </CardHeader>
      <CardContent>
        {matches && matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="bg-slate-800/50 border-slate-700">
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-white">
                        {match.homeTeamId === currentTeam?.id ? currentTeam?.name : `Team ${match.homeTeamId}`} vs {match.awayTeamId === currentTeam?.id ? currentTeam?.name : `Team ${match.awayTeamId}`}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {match.round} • {match.map}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(match.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setCurrentMatch(match);
                        setMatchPhase('simulation');
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Play Match
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>No upcoming matches found.</p>
        )}
      </CardContent>
    </div>
  );
}

export default Tournaments;