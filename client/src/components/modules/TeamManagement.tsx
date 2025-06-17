import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { 
  Users, Star, TrendingUp, Heart, Zap, Brain, 
  Target, Shield, Crown, UserPlus, Settings
} from "lucide-react";
import { useTeamState } from "../../lib/stores/useTeamState";
import { apiRequest } from "../../lib/queryClient";

function TeamManagement() {
  const { 
    currentTeam, 
    teamPlayers, 
    lineup, 
    setTeamPlayers, 
    updateLineup 
  } = useTeamState();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentTeam) {
      loadTeamPlayers();
    }
  }, [currentTeam]);

  const loadTeamPlayers = async () => {
    if (!currentTeam) return;
    
    try {
      const response = await apiRequest("GET", `/api/players/team/${currentTeam.id}`);
      const players = await response.json();
      setTeamPlayers(players);
    } catch (error) {
      console.error("Failed to load team players:", error);
    }
  };

  const updatePlayerPosition = async (playerId: number, position: 'starter' | 'substitute' | 'bench') => {
    setLoading(true);
    try {
      // Update local state
      updateLineup(playerId, position);
      
      // Update on server
      await apiRequest("PUT", `/api/players/${playerId}`, {
        isStarter: position === 'starter',
        isSubstitute: position === 'substitute'
      });
    } catch (error) {
      console.error("Failed to update player position:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'duelist': return <Target className="h-4 w-4" />;
      case 'initiator': return <Zap className="h-4 w-4" />;
      case 'controller': return <Shield className="h-4 w-4" />;
      case 'sentinel': return <Crown className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'duelist': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'initiator': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'controller': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'sentinel': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getOverallRating = (player: any) => {
    return Math.round((player.aim + player.gameIq + player.clutch + player.teamwork + player.positioning) / 5);
  };

  const getMoraleColor = (morale: number) => {
    if (morale >= 80) return 'text-green-400';
    if (morale >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <ScrollArea className="h-[calc(100vh-2rem)] w-full">
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Team Management</h2>
            <p className="text-slate-400 mt-1">Manage your roster, lineup, and player development</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              {teamPlayers.length}/6 Players
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Team Settings
            </Button>
          </div>
        </div>

      <Tabs defaultValue="lineup" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="lineup">Starting Lineup</TabsTrigger>
          <TabsTrigger value="roster">Full Roster</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="chemistry">Team Chemistry</TabsTrigger>
        </TabsList>

        <TabsContent value="lineup" className="space-y-6">
          {/* Starting Five */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                Starting Five
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lineup.starters.length > 0 ? (
                <div className="grid grid-cols-5 gap-4">
                  {lineup.starters.map((player, index) => (
                    <div key={player.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Badge className={`${getRoleColor(player.role)} text-xs`}>
                            {getRoleIcon(player.role)}
                            <span className="ml-1">{player.role.toUpperCase()}</span>
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-white text-sm">{player.name}</h4>
                        <div className="text-xs text-slate-400 mt-1">{player.nationality}</div>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Rating</span>
                            <span className="text-white font-mono">{getOverallRating(player)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Morale</span>
                            <span className={`${getMoraleColor(player.morale)} font-mono`}>
                              {player.morale}%
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-3 text-xs"
                          onClick={() => updatePlayerPosition(player.id, 'bench')}
                          disabled={loading}
                        >
                          Bench
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty starter slots */}
                  {Array.from({ length: 5 - lineup.starters.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="bg-slate-900/20 rounded-lg p-4 border-2 border-dashed border-slate-600 flex items-center justify-center">
                      <div className="text-center text-slate-500">
                        <UserPlus className="h-8 w-8 mx-auto mb-2" />
                        <span className="text-sm">Empty Slot</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Users className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                  <p>No starting lineup set</p>
                  <p className="text-sm mt-2">Select 5 players from your roster</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Substitute */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Substitute
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lineup.substitute ? (
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600 max-w-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`${getRoleColor(lineup.substitute.role)} text-xs`}>
                          {getRoleIcon(lineup.substitute.role)}
                          <span className="ml-1">{lineup.substitute.role.toUpperCase()}</span>
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-white">{lineup.substitute.name}</h4>
                      <div className="text-sm text-slate-400">{lineup.substitute.nationality}</div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Rating:</span>
                          <span className="text-white font-mono ml-2">{getOverallRating(lineup.substitute)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Morale:</span>
                          <span className={`${getMoraleColor(lineup.substitute.morale)} font-mono ml-2`}>
                            {lineup.substitute.morale}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updatePlayerPosition(lineup.substitute.id, 'starter')}
                        disabled={loading || lineup.starters.length >= 5}
                      >
                        Promote
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updatePlayerPosition(lineup.substitute.id, 'bench')}
                        disabled={loading}
                      >
                        Bench
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/20 rounded-lg p-6 border-2 border-dashed border-slate-600 text-center text-slate-500 max-w-sm">
                  <UserPlus className="h-8 w-8 mx-auto mb-2" />
                  <span>No substitute selected</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roster" className="space-y-4">
          {teamPlayers.length > 0 ? (
            <div className="space-y-4">
              {teamPlayers.map((player) => (
                <Card key={player.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getRoleColor(player.role)}`}>
                            {getRoleIcon(player.role)}
                            <span className="ml-1">{player.role.toUpperCase()}</span>
                          </Badge>
                          {player.isStarter && <Star className="h-4 w-4 text-yellow-400" />}
                          {player.isSubstitute && <Shield className="h-4 w-4 text-blue-400" />}
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white">{player.name}</h4>
                          <div className="text-sm text-slate-400">{player.nationality} • Age {player.age}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm text-slate-400">Overall</div>
                          <div className="text-2xl font-bold text-white">{getOverallRating(player)}</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-slate-400">Morale</div>
                          <div className={`text-lg font-semibold ${getMoraleColor(player.morale)}`}>
                            {player.morale}%
                          </div>
                        </div>
                        
                        <div className="space-x-2">
                          {!player.isStarter && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updatePlayerPosition(player.id, 'starter')}
                              disabled={loading || lineup.starters.length >= 5}
                            >
                              Start
                            </Button>
                          )}
                          {!player.isSubstitute && !player.isStarter && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updatePlayerPosition(player.id, 'substitute')}
                              disabled={loading || lineup.substitute !== null}
                            >
                              Sub
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPlayer(player)}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Player stats */}
                    <div className="mt-4 grid grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">AIM</div>
                        <div className="text-white font-mono">{player.aim}</div>
                        <Progress value={player.aim} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">IQ</div>
                        <div className="text-white font-mono">{player.gameIq}</div>
                        <Progress value={player.gameIq} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">CLUTCH</div>
                        <div className="text-white font-mono">{player.clutch}</div>
                        <Progress value={player.clutch} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">TEAM</div>
                        <div className="text-white font-mono">{player.teamwork}</div>
                        <Progress value={player.teamwork} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">POS</div>
                        <div className="text-white font-mono">{player.positioning}</div>
                        <Progress value={player.positioning} className="h-1 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Players</h3>
                <p className="text-slate-400 mb-4">Your team roster is empty</p>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Scout Players
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="training">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Training Module</h3>
              <p className="text-slate-400">Training system coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chemistry">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="text-center py-12">
              <Heart className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Team Chemistry</h3>
              <p className="text-slate-400">Chemistry analysis coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </ScrollArea>
  );
}

export default TeamManagement;
