import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { 
  ShoppingCart, User, Users, Zap, Brain, 
  Star, DollarSign, TrendingUp, Award, Gift
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
      
      // Update local state
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
      default: return <User className="h-4 w-4" />;
    }
  };

  const getStaffColor = (role: string) => {
    switch (role) {
      case 'analyst': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'coach': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'mental_trainer': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'statistician': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const canAffordStaff = (staff: any) => {
    if (!currentTeam || !staff.salary) return false;
    const staffCost = parseFloat(staff.salary);
    const teamBudget = parseFloat(currentTeam.budget);
    return teamBudget >= staffCost;
  };

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
    <div className="space-y-6">
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
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="premium">Premium Items</TabsTrigger>
          <TabsTrigger value="cosmetics">Cosmetics</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-400" />
                Available Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Current Staff */}
          {teamStaff.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-400" />
                  Your Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamStaff.map((staff) => (
                    <div key={staff.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getStaffColor(staff.role)}>
                          {getStaffIcon(staff.role)}
                          <span className="ml-1">{staff.role.toUpperCase()}</span>
                        </Badge>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          Active
                        </Badge>
                      </div>
                      
                      <h4 className="font-semibold text-white text-lg">{staff.name}</h4>
                      <p className="text-sm text-slate-400">{staff.specialty}</p>
                      
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-slate-400">Experience</div>
                          <div className="text-white font-mono">{staff.experience}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Reputation</div>
                          <div className="text-white font-mono">{staff.reputation}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cosmetics">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="text-center py-12">
              <Gift className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Cosmetics</h3>
              <p className="text-slate-400">Team logos, jerseys, and customization options coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Marketplace;
