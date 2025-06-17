import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Play, Info, Settings, Users, Trophy, Target, Zap, LogOut } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
                Esport Manager: The Codebreaker
              </h1>
              <p className="text-slate-400 mt-1 text-sm md:text-base truncate">Welcome, {user?.username}</p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="text-slate-300 hover:text-white ml-4 text-sm md:text-base"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-h-[calc(100vh-80px)] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Menu */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Main Menu</h2>
              <p className="text-slate-400 text-sm md:text-base">Choose an option to continue</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={item.id}
                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all cursor-pointer group touch-manipulation"
                    onClick={item.action}
                  >
                    <CardContent className="p-4 md:p-6 text-center">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${item.color} flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                      </div>
                      <h3 className="text-base md:text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Game Features */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-4">Game Features</h3>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
              {gameFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="bg-slate-800/30 border-slate-700">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm md:text-base">{feature.title}</h4>
                          <p className="text-xs md:text-sm text-slate-400 mt-1 leading-relaxed">{feature.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;