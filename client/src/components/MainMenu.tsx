import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Play, Trophy, Users, Settings, Info, 
  Gamepad2, Target, Crown, Zap 
} from "lucide-react";
import { useGameState } from "../lib/stores/useGameState";

interface MainMenuProps {
  onStartGame: () => void;
}

function MainMenu({ onStartGame }: MainMenuProps) {
  const { user, logout } = useGameState();

  const menuItems = [
    {
      id: "start",
      title: "Start Game",
      description: "Begin your esports management journey",
      icon: Play,
      color: "bg-gradient-to-r from-green-600 to-emerald-600",
      action: onStartGame
    },
    {
      id: "tutorial",
      title: "Tutorial",
      description: "Learn the basics of team management",
      icon: Info,
      color: "bg-gradient-to-r from-blue-600 to-cyan-600",
      action: () => console.log("Tutorial coming soon")
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure game preferences",
      icon: Settings,
      color: "bg-gradient-to-r from-purple-600 to-violet-600",
      action: () => console.log("Settings coming soon")
    }
  ];

  const gameFeatures = [
    { icon: Users, title: "Team Management", desc: "Build and manage your esports team" },
    { icon: Trophy, title: "Tournaments", desc: "Compete in various competitions" },
    { icon: Target, title: "Strategic Gameplay", desc: "Draft agents and plan tactics" },
    { icon: Zap, title: "AI Coach", desc: "Get intelligent advice and analysis" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Esport Manager: The Codebreaker
              </h1>
              <p className="text-slate-400 mt-1">Welcome, {user?.username}</p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="text-slate-300 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Menu */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Main Menu</h2>
              <p className="text-slate-400">Choose an option to continue</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={item.id}
                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all cursor-pointer group"
                    onClick={item.action}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Featured Section */}
            <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Crown className="h-6 w-6 mr-2 text-yellow-400" />
                  Ready to Dominate?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Build the ultimate esports team, master tactical gameplay, and lead your squad to victory 
                  in the most competitive tournaments around the world.
                </p>
                <Button 
                  onClick={onStartGame}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Your Journey
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Game Features */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Game Features</h3>
            </div>

            <div className="space-y-4">
              {gameFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="bg-slate-800/30 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{feature.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Version Info */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardContent className="p-4 text-center">
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  Version 1.0.0
                </Badge>
                <p className="text-xs text-slate-500 mt-2">
                  The Codebreaker Edition
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;