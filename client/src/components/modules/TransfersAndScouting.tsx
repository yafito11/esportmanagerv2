import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { 
  Search, Filter, Users, Target, Shield, Crown, Zap, 
  Eye, UserPlus, DollarSign, TrendingUp, Star, Globe
} from "lucide-react";
import { useTeamState } from "../../lib/stores/useTeamState";
import { apiRequest } from "../../lib/queryClient";

function TransfersAndScouting() {
  const { 
    currentTeam, 
    availablePlayers, 
    setAvailablePlayers, 
    addPlayerToTeam,
    teamPlayers
  } = useTeamState();
  
  const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [nationalityFilter, setNationalityFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [scoutingReports, setScoutingReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentTeam) {
      loadAvailablePlayers();
      loadScoutingReports();
    }
  }, [currentTeam]);

  useEffect(() => {
    filterAndSortPlayers();
  }, [availablePlayers, searchTerm, roleFilter, nationalityFilter, ageFilter, sortBy]);

  const loadAvailablePlayers = async () => {
    try {
      const response = await apiRequest("GET", "/api/players/available?limit=150");
      const players = await response.json();
      setAvailablePlayers(players);
    } catch (error) {
      console.error("Failed to load available players:", error);
    }
  };

  const loadScoutingReports = async () => {
    if (!currentTeam) return;
    
    try {
      const response = await apiRequest("GET", `/api/scouting/${currentTeam.id}`);
      const reports = await response.json();
      setScoutingReports(reports);
    } catch (error) {
      console.error("Failed to load scouting reports:", error);
    }
  };

  const filterAndSortPlayers = () => {
    let filtered = [...availablePlayers];

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.nationality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(player => player.role === roleFilter);
    }

    if (nationalityFilter !== "all") {
      filtered = filtered.filter(player => player.nationality === nationalityFilter);
    }

    if (ageFilter !== "all") {
      const [min, max] = ageFilter.split("-").map(Number);
      filtered = filtered.filter(player => player.age >= min && player.age <= max);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return getOverallRating(b) - getOverallRating(a);
        case "age":
          return a.age - b.age;
        case "value":
          return parseFloat(b.marketValue) - parseFloat(a.marketValue);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredPlayers(filtered);
  };

  const getOverallRating = (player: any) => {
    return Math.round((player.aim + player.gameIq + player.clutch + player.teamwork + player.positioning) / 5);
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

  const signPlayer = async (player: any) => {
    if (!currentTeam) return;
    
    setLoading(true);
    try {
      const salary = parseFloat(player.marketValue) * 0.2; // 20% of market value as salary
      const response = await apiRequest("POST", "/api/players/sign", {
        playerId: player.id,
        teamId: currentTeam.id,
        salary
      });
      
      const signedPlayer = await response.json();
      addPlayerToTeam(signedPlayer);
      
      // Remove from available players
      setAvailablePlayers(prev => prev.filter(p => p.id !== player.id));
    } catch (error) {
      console.error("Failed to sign player:", error);
    } finally {
      setLoading(false);
    }
  };

  const scoutPlayer = async (player: any) => {
    if (!currentTeam) return;
    
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/players/scout", {
        playerId: player.id,
        teamId: currentTeam.id
      });
      
      const result = await response.json();
      console.log("Scouting completed:", result);
      
      await loadScoutingReports();
    } catch (error) {
      console.error("Failed to scout player:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueNationalities = () => {
    const nationalities = [...new Set(availablePlayers.map(p => p.nationality))];
    return nationalities.sort();
  };

  const canAffordPlayer = (player: any) => {
    if (!currentTeam) return false;
    const playerCost = parseFloat(player.marketValue);
    const teamBudget = parseFloat(currentTeam.budget);
    return teamBudget >= playerCost;
  };

  const hasRosterSpace = () => {
    return teamPlayers.length < 6;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Transfers & Scouting</h2>
          <p className="text-slate-400 mt-1">Discover and recruit talented players for your team</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            ${currentTeam?.budget || '0'} Budget
          </Badge>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            {teamPlayers.length}/6 Roster
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="marketplace" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="marketplace">Player Marketplace</TabsTrigger>
          <TabsTrigger value="scouting">Scouting Reports</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Filters */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Filter className="h-5 w-5 mr-2 text-purple-400" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2">
                  <Input
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-slate-900 border-slate-600">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="duelist">Duelist</SelectItem>
                    <SelectItem value="initiator">Initiator</SelectItem>
                    <SelectItem value="controller">Controller</SelectItem>
                    <SelectItem value="sentinel">Sentinel</SelectItem>
                    <SelectItem value="flex">Flex</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
                  <SelectTrigger className="bg-slate-900 border-slate-600">
                    <SelectValue placeholder="Nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {getUniqueNationalities().map(nationality => (
                      <SelectItem key={nationality} value={nationality}>{nationality}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={ageFilter} onValueChange={setAgeFilter}>
                  <SelectTrigger className="bg-slate-900 border-slate-600">
                    <SelectValue placeholder="Age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="18-21">18-21</SelectItem>
                    <SelectItem value="22-25">22-25</SelectItem>
                    <SelectItem value="26-30">26-30</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-slate-900 border-slate-600">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="value">Market Value</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Player List */}
          <div className="space-y-4">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <Card key={player.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getRoleColor(player.role)}`}>
                            {getRoleIcon(player.role)}
                            <span className="ml-1">{player.role.toUpperCase()}</span>
                          </Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white text-lg">{player.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-slate-400">
                            <span className="flex items-center">
                              <Globe className="h-3 w-3 mr-1" />
                              {player.nationality}
                            </span>
                            <span>Age {player.age}</span>
                            <span className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              ${parseInt(player.marketValue).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm text-slate-400">Overall</div>
                          <div className="text-2xl font-bold text-white">{getOverallRating(player)}</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-slate-400">Morale</div>
                          <div className="text-lg font-semibold text-green-400">{player.morale}%</div>
                        </div>
                        
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => scoutPlayer(player)}
                            disabled={loading}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Scout
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPlayer(player)}
                          >
                            Details
                          </Button>
                          <Button 
                            onClick={() => signPlayer(player)}
                            disabled={loading || !canAffordPlayer(player) || !hasRosterSpace()}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Sign
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Player stats */}
                    <div className="mt-4 grid grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">AIM</div>
                        <div className="text-white font-mono text-sm">{player.aim}</div>
                        <Progress value={player.aim} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">IQ</div>
                        <div className="text-white font-mono text-sm">{player.gameIq}</div>
                        <Progress value={player.gameIq} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">CLUTCH</div>
                        <div className="text-white font-mono text-sm">{player.clutch}</div>
                        <Progress value={player.clutch} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">TEAM</div>
                        <div className="text-white font-mono text-sm">{player.teamwork}</div>
                        <Progress value={player.teamwork} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">POS</div>
                        <div className="text-white font-mono text-sm">{player.positioning}</div>
                        <Progress value={player.positioning} className="h-1 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <Search className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Players Found</h3>
                  <p className="text-slate-400">Try adjusting your search filters</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="scouting" className="space-y-4">
          {scoutingReports.length > 0 ? (
            <div className="space-y-4">
              {scoutingReports.map((report) => (
                <Card key={report.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">Player #{report.playerId}</h4>
                        <p className="text-sm text-slate-400 mt-1">{report.report}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-slate-400">Scout Rating</div>
                          <div className="text-lg font-semibold text-white">{report.rating}/10</div>
                        </div>
                        <Badge 
                          variant={report.recommendation === 'sign' ? 'default' : 
                                  report.recommendation === 'monitor' ? 'secondary' : 'outline'}
                        >
                          {report.recommendation.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="text-center py-12">
                <Eye className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Scouting Reports</h3>
                <p className="text-slate-400">Start scouting players to build your reports</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="watchlist">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="text-center py-12">
              <Star className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Watchlist</h3>
              <p className="text-slate-400">Watchlist feature coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TransfersAndScouting;
