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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ScrollArea className="h-screen">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Esport Manager: The Codebreaker
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 mb-6">
                Master the art of tactical FPS team management
              </p>
              {user && (
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
                  <Badge variant="outline" className="text-sm">
                    Welcome, {user.username}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Panel - Game Features */}
              <div className="order-2 lg:order-1 space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl">Game Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] lg:h-[400px]">
                      <div className="grid grid-cols-1 gap-4 pr-4">
                        {gameFeatures.map((feature, index) => {
                          const Icon = feature.icon;
                          return (
                            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                              <Icon className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-white">{feature.title}</h3>
                                <p className="text-sm text-slate-400 break-words">{feature.desc}</p>
                              </div>
                            </div>
                          );
                        })}

                        {/* Additional features for demonstration */}
                        <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                          <Settings className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-white">Marketplace</h3>
                            <p className="text-sm text-slate-400 break-words">Buy agents, items, and customizations</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                          <Target className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-white">Agent Statistics</h3>
                            <p className="text-sm text-slate-400 break-words">Track and analyze agent performance</p>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Game Info */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-slate-400">
                        Build your dream team, master agent strategies, and compete in tournaments
                      </p>
                      <p className="text-xs text-slate-500">
                        Version 1.0 - The Codebreaker Edition
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Menu Items */}
              <div className="order-1 lg:order-2 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">
                  Main Menu
                </h2>

                <ScrollArea className="h-[400px] lg:h-[500px]">
                  <div className="space-y-4 pr-4">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Card
                          key={item.id}
                          className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                          onClick={item.action}
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                              <div className={`p-3 rounded-lg ${item.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                                <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                              </div>
                              <div className="flex-1 text-center sm:text-left min-w-0">
                                <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-sm sm:text-base text-slate-400 group-hover:text-slate-300 transition-colors break-words">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}

                    {/* Quick Stats Preview */}
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Stats Preview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center p-2 bg-slate-700/30 rounded">
                            <span className="block text-slate-400">Teams</span>
                            <span className="text-white font-mono">0</span>
                          </div>
                          <div className="text-center p-2 bg-slate-700/30 rounded">
                            <span className="block text-slate-400">Matches</span>
                            <span className="text-white font-mono">0</span>
                          </div>
                          <div className="text-center p-2 bg-slate-700/30 rounded">
                            <span className="block text-slate-400">Wins</span>
                            <span className="text-green-400 font-mono">0</span>
                          </div>
                          <div className="text-center p-2 bg-slate-700/30 rounded">
                            <span className="block text-slate-400">Ranking</span>
                            <span className="text-yellow-400 font-mono">-</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default MainMenu;