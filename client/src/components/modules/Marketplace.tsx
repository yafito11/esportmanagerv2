import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { 
  ShoppingCart, User, Users, Zap, Brain, Star, DollarSign, 
  TrendingUp, Award, Gift, Bot, Wrench, Heart, Shield, 
  Target, Crown, Palette, Shirt, Camera
} from "lucide-react";
import { useTeamState } from "../../lib/stores/useTeamState";
import { apiRequest } from "../../lib/queryClient";

function Marketplace() {
  const { 
    currentTeam, 
    availableStaff, 
    setAvailableStaff, 
    teamStaff, 
    setTeamStaff 
  } = useTeamState();

  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    if (currentTeam) {
      loadAvailableStaff();
      loadTeamStaff();
    }
  }, [currentTeam]);

  const loadAvailableStaff = async () => {
    try {
      const response = await apiRequest("GET", "/api/staff/available");
      const staff = await response.json();
      setAvailableStaff(staff);
    } catch (error) {
      console.error("Failed to load available staff:", error);
    }
  };

  const loadTeamStaff = async () => {
    if (!currentTeam) return;

    try {
      const response = await apiRequest("GET", `/api/staff/team/${currentTeam.id}`);
      const staff = await response.json();
      setTeamStaff(staff);
    } catch (error) {
      console.error("Failed to load team staff:", error);
    }
  };

  const hireStaff = async (staff: any) => {
    if (!currentTeam) return;

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/staff/hire", {
        staffId: staff.id,
        teamId: currentTeam.id
      });

      const hiredStaff = await response.json();

      setTeamStaff(prev => [...prev, hiredStaff]);
      setAvailableStaff(prev => prev.filter(s => s.id !== staff.id));
    } catch (error) {
      console.error("Failed to hire staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStaffIcon = (role: string) => {
    switch (role) {
      case 'analyst': return <Brain className="h-4 w-4" />;
      case 'coach': return <Users className="h-4 w-4" />;
      case 'mental_trainer': return <Zap className="h-4 w-4" />;
      case 'statistician': return <TrendingUp className="h-4 w-4" />;
      case 'ai_assistant': return <Bot className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getStaffColor = (role: string) => {
    switch (role) {
      case 'analyst': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'coach': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'mental_trainer': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'statistician': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'ai_assistant': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const canAffordStaff = (staff: any) => {
    if (!currentTeam || !staff.salary) return false;
    const staffCost = parseFloat(staff.salary);
    const teamBudget = parseFloat(currentTeam.budget);
    return teamBudget >= staffCost;
  };

  // AI NPCs Data
  const aiNPCs = [
    {
      id: 1,
      name: "ARIA-7",
      type: "Strategic AI",
      description: "Advanced tactical analysis and real-time strategic recommendations",
      price: 150000,
      abilities: ["Match Analysis", "Draft Optimization", "Enemy Prediction"],
      rating: 95,
      icon: <Bot className="h-6 w-6" />
    },
    {
      id: 2,
      name: "Coach Neo",
      type: "Training AI",
      description: "Personalized training programs and skill development tracking",
      price: 100000,
      abilities: ["Custom Training", "Progress Tracking", "Skill Analysis"],
      rating: 88,
      icon: <Brain className="h-6 w-6" />
    },
    {
      id: 3,
      name: "Scout Prime",
      type: "Recruitment AI",
      description: "Advanced player scouting and market analysis",
      price: 75000,
      abilities: ["Player Scouting", "Market Analysis", "Talent Prediction"],
      rating: 82,
      icon: <Target className="h-6 w-6" />
    }
  ];

  // Support Items Data
  const supportItems = [
    {
      id: 1,
      name: "Elite Gaming Setup",
      type: "Equipment",
      description: "High-end gaming peripherals that boost player performance",
      price: 25000,
      effect: "+5 Aim for all players",
      icon: <Wrench className="h-6 w-6" />,
      rarity: "epic"
    },
    {
      id: 2,
      name: "Medical Kit Pro",
      type: "Medical",
      description: "Advanced medical equipment to maintain player health",
      price: 15000,
      effect: "+10 Morale, prevents injuries",
      icon: <Heart className="h-6 w-6" />,
      rarity: "rare"
    },
    {
      id: 3,
      name: "Training Facility Upgrade",
      type: "Facility",
      description: "State-of-the-art training equipment and environment",
      price: 100000,
      effect: "+3 to all stats during training",
      icon: <Shield className="h-6 w-6" />,
      rarity: "legendary"
    },
    {
      id: 4,
      name: "Nutritionist Package",
      type: "Support",
      description: "Personalized nutrition plans for optimal performance",
      price: 8000,
      effect: "+5 Energy for all players",
      icon: <Zap className="h-6 w-6" />,
      rarity: "common"
    }
  ];

  // Customization Items
  const customizationItems = [
    {
      id: 1,
      name: "Team Logo Designer",
      type: "Visual",
      description: "Professional logo design service for your team",
      price: 5000,
      icon: <Palette className="h-6 w-6" />,
      category: "branding"
    },
    {
      id: 2,
      name: "Custom Jersey Set",
      type: "Apparel",
      description: "High-quality custom team jerseys with your design",
      price: 12000,
      icon: <Shirt className="h-6 w-6" />,
      category: "apparel"
    },
    {
      id: 3,
      name: "Team Photo Session",
      type: "Media",
      description: "Professional photography for team branding",
      price: 3000,
      icon: <Camera className="h-6 w-6" />,
      category: "media"
    },
    {
      id: 4,
      name: "Victory Celebration Pack",
      type: "Animation",
      description: "Custom victory animations and celebrations",
      price: 8000,
      icon: <Crown className="h-6 w-6" />,
      category: "animation"
    }
  ];

  const premiumItems = [
    {
      id: 1,
      name: "Skill Point Booster",
      description: "Instantly gain 10 skill points for any player",
      price: 50000,
      type: "booster",
      icon: <Star className="h-6 w-6" />,
      rarity: "rare"
    },
    {
      id: 2,
      name: "Team Morale Boost",
      description: "Increase all players' morale by 20 points",
      price: 75000,
      type: "boost",
      icon: <Zap className="h-6 w-6" />,
      rarity: "epic"
    },
    {
      id: 3,
      name: "Premium Scout Report",
      description: "Detailed analysis of any player in the game",
      price: 25000,
      type: "service",
      icon: <Brain className="h-6 w-6" />,
      rarity: "common"
    },
    {
      id: 4,
      name: "Budget Increase",
      description: "Permanently increase your team budget by $500,000",
      price: 100000,
      type: "upgrade",
      icon: <DollarSign className="h-6 w-6" />,
      rarity: "legendary"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400/20';
      case 'rare': return 'text-blue-400 border-blue-400/20';
      case 'epic': return 'text-purple-400 border-purple-400/20';
      case 'legendary': return 'text-yellow-400 border-yellow-400/20';
      default: return 'text-gray-400 border-gray-400/20';
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-300px)] w-full">
      <div className="space-y-6 p-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Marketplace</h2>
            <p className="text-slate-400 mt-1">Purchase staff, upgrades, and premium items</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              <DollarSign className="h-3 w-3 mr-1" />
              ${currentTeam?.budget || '0'}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="staff" className="space-y-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="bg-slate-800 border-slate-700 inline-flex h-10 items-center justify-center rounded-md p-1">
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="ai-npcs">AI NPCs</TabsTrigger>
              <TabsTrigger value="support-items">Support Items</TabsTrigger>
              <TabsTrigger value="customization">Customization</TabsTrigger>
              <TabsTrigger value="premium">Premium Items</TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="staff" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-400" />
                  Available Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {availableStaff.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableStaff.map((staff) => (
                        <div key={staff.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Badge className={getStaffColor(staff.role)}>
                                {getStaffIcon(staff.role)}
                                <span className="ml-1">{staff.role.toUpperCase()}</span>
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-400">
                                ${parseInt(staff.salary || '0').toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-400">per season</div>
                            </div>
                          </div>

                          <h4 className="font-semibold text-white text-lg mb-1">{staff.name}</h4>
                          <p className="text-sm text-slate-400 mb-3">{staff.specialty}</p>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-slate-400 mb-1">Experience</div>
                              <div className="text-white font-mono">{staff.experience}</div>
                              <Progress value={staff.experience} className="h-1 mt-1" />
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 mb-1">Reputation</div>
                              <div className="text-white font-mono">{staff.reputation}</div>
                              <Progress value={staff.reputation} className="h-1 mt-1" />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedItem(staff)}
                            >
                              Details
                            </Button>
                            <Button 
                              onClick={() => hireStaff(staff)}
                              disabled={loading || !canAffordStaff(staff)}
                              className="bg-green-600 hover:bg-green-700 flex-1"
                            >
                              <User className="h-4 w-4 mr-2" />
                              Hire
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400">No staff available for hire</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-npcs" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-cyan-400" />
                  AI NPCs & Assistants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiNPCs.map((npc) => (
                      <div key={npc.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="text-cyan-400">{npc.icon}</div>
                            <Badge className="text-cyan-400 bg-cyan-400/10 border-cyan-400/20">
                              AI NPC
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-400">
                              ${npc.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400">one-time</div>
                          </div>
                        </div>

                        <h4 className="font-semibold text-white text-lg mb-1">{npc.name}</h4>
                        <p className="text-sm text-cyan-400 mb-2">{npc.type}</p>
                        <p className="text-sm text-slate-400 mb-3">{npc.description}</p>

                        <div className="mb-3">
                          <div className="text-xs text-slate-400 mb-1">Rating</div>
                          <div className="text-white font-mono text-lg">{npc.rating}/100</div>
                          <Progress value={npc.rating} className="h-2 mt-1" />
                        </div>

                        <div className="mb-4">
                          <div className="text-xs text-slate-400 mb-2">Abilities</div>
                          <div className="flex flex-wrap gap-1">
                            {npc.abilities.map((ability, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {ability}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-cyan-600 hover:bg-cyan-700"
                          disabled={!currentTeam || parseFloat(currentTeam.budget) < npc.price}
                        >
                          <Bot className="h-4 w-4 mr-2" />
                          Acquire AI
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support-items" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="h-5 w-5 mr-2 text-orange-400" />
                  Support Items & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supportItems.map((item) => (
                      <div key={item.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="text-orange-400">{item.icon}</div>
                            <Badge className={getRarityColor(item.rarity)}>
                              {item.rarity.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-400">
                              ${item.price.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <h4 className="font-semibold text-white text-lg mb-1">{item.name}</h4>
                        <p className="text-sm text-orange-400 mb-2">{item.type}</p>
                        <p className="text-sm text-slate-400 mb-3">{item.description}</p>

                        <div className="mb-4 p-2 bg-green-900/20 rounded border border-green-700">
                          <div className="text-xs text-green-400 mb-1">Effect</div>
                          <div className="text-sm text-green-300">{item.effect}</div>
                        </div>

                        <Button 
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          disabled={!currentTeam || parseFloat(currentTeam.budget) < item.price}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Purchase
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customization" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-pink-400" />
                  Team Customization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customizationItems.map((item) => (
                      <div key={item.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="text-pink-400">{item.icon}</div>
                            <Badge className="text-pink-400 bg-pink-400/10 border-pink-400/20">
                              {item.category.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-400">
                              ${item.price.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <h4 className="font-semibold text-white text-lg mb-1">{item.name}</h4>
                        <p className="text-sm text-pink-400 mb-2">{item.type}</p>
                        <p className="text-sm text-slate-400 mb-4">{item.description}</p>

                        <Button 
                          className="w-full bg-pink-600 hover:bg-pink-700"
                          disabled={!currentTeam || parseFloat(currentTeam.budget) < item.price}
                        >
                          <Palette className="h-4 w-4 mr-2" />
                          Customize
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="premium" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  Premium Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {premiumItems.map((item) => (
                      <div key={item.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="text-purple-400">{item.icon}</div>
                            <Badge className={getRarityColor(item.rarity)}>
                              {item.rarity.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-400">
                              ${item.price.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <h4 className="font-semibold text-white text-lg mb-2">{item.name}</h4>
                        <p className="text-sm text-slate-400 mb-4">{item.description}</p>

                        <Button 
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          disabled={!currentTeam || parseFloat(currentTeam.budget) < item.price}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Purchase
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}

export default Marketplace;