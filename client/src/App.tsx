import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./components/Dashboard";
import MainMenu from "./components/MainMenu";
import TeamCreation from "./components/TeamCreation";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useGameState } from "./lib/stores/useGameState";
import { useTeamState } from "./lib/stores/useTeamState";
import { apiRequest } from "./lib/queryClient";
import "@fontsource/inter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser, setGameState } = useGameState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const response = await apiRequest("POST", endpoint, { username, password });
      const data = await response.json();
      
      setUser(data.user);
      setGameState(data.gameState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Esport Manager: The Codebreaker
          </CardTitle>
          <p className="text-muted-foreground">Manage your tactical FPS esports team</p>
        </CardHeader>
        <CardContent>
          <Tabs value={isRegistering ? "register" : "login"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" onClick={() => setIsRegistering(false)}>
                Login
              </TabsTrigger>
              <TabsTrigger value="register" onClick={() => setIsRegistering(true)}>
                Register
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input
                    id="reg-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function App() {
  const { user, gameState } = useGameState();
  const { currentTeam } = useTeamState();
  const [appState, setAppState] = useState<'login' | 'menu' | 'teamCreation' | 'game'>('login');

  useEffect(() => {
    if (!user || !gameState) {
      setAppState('login');
    } else {
      checkUserTeam();
    }
  }, [user, gameState]);

  const checkUserTeam = async () => {
    if (!user) return;
    
    try {
      const response = await apiRequest("GET", `/api/teams/${user.id}`);
      const teams = await response.json();
      
      if (teams.length > 0) {
        setAppState('game');
      } else {
        setAppState('menu');
      }
    } catch (error) {
      console.error("Failed to check user teams:", error);
      setAppState('menu');
    }
  };

  const handleStartGame = () => {
    setAppState('teamCreation');
  };

  const handleTeamCreated = () => {
    setAppState('game');
  };

  const handleBackToMenu = () => {
    setAppState('menu');
  };

  const renderCurrentView = () => {
    switch (appState) {
      case 'login':
        return <LoginForm />;
      case 'menu':
        return <MainMenu onStartGame={handleStartGame} />;
      case 'teamCreation':
        return (
          <TeamCreation 
            onTeamCreated={handleTeamCreated}
            onBack={handleBackToMenu}
          />
        );
      case 'game':
        return <Dashboard />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        {renderCurrentView()}
      </div>
    </QueryClientProvider>
  );
}

export default App;
