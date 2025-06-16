import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { 
  Trophy, Calendar, Users, Target, Award, 
  Clock, DollarSign, Play, Eye, MapPin
} from "lucide-react";
import { useTeamState } from "../../lib/stores/useTeamState";
import { useTournamentState } from "../../lib/stores/useTournamentState";
import { apiRequest } from "../../lib/queryClient";

function Tournaments() {
  const { currentTeam } = useTeamState();
  const { 
    tournaments, 
    setTournaments, 
    currentTournament, 
    setCurrentTournament,
    matches,
    setMatches,
    setCurrentMatch
  } = useTournamentState();
  
  const [loading, setLoading] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const response = await apiRequest("GET", "/api/tournaments/active");
      const tournamentsData = await response.json();
      setTournaments(tournamentsData);
    } catch (error) {
      console.error("Failed to load tournaments:", error);
    }
  };

  const loadTournamentMatches = async (tournamentId: number) => {
    try {
      // In a real implementation, this would fetch matches for the specific tournament
      // For now, we'll simulate tournament brackets
      const mockMatches = generateMockBracket(tournamentId);
      setMatches(mockMatches);
    } catch (error) {
      console.error("Failed to load tournament matches:", error);
    }
  };

  const generateMockBracket = (tournamentId: number) => {
    const teamIds = Array.from({ length: 16 }, (_, i) => i + 1);
    const matches = [];
    let matchId = 1;

    // Generate Round of 16 matches
    for (let i = 0; i < teamIds.length; i += 2) {
      matches.push({
        id: matchId++,
        tournamentId,
        homeTeamId: teamIds[i],
        awayTeamId: teamIds[i + 1],
        scheduledDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        homeScore: 0,
        awayScore: 0,
        status: 'scheduled',
        round: 'Round of 16',
        map: ['Dust2', 'Mirage', 'Inferno', 'Cache', 'Overpass'][Math.floor(Math.random() * 5)],
        createdAt: new Date()
      });
    }

    return matches;
  };

  const joinTournament = async (tournament: any) => {
    if (!currentTeam) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would register the team for the tournament
      console.log(`Joining tournament: ${tournament.name}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setCurrentTournament(tournament);
      await loadTournamentMatches(tournament.id);
    } catch (error) {
      console.error("Failed to join tournament:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewTournamentBracket = (tournament: any) => {
    setSelectedTournament(tournament);
    loadTournamentMatches(tournament.id);
  };

  const enterMatch = (match: any) => {
    setCurrentMatch(match);
  };

  const getTournamentTypeColor = (type: string) => {
    switch (type) {
      case 'national': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'continental': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'world': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'upcoming': return 'text-yellow-400';
      case 'completed': return 'text-slate-400';
      default: return 'text-gray-400';
    }
  };

  const formatPrizePool = (prizePool: string) => {
    return `$${parseInt(prizePool).toLocaleString()}`;
  };

  const getDaysUntilStart = (startDate: string | Date) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBracketProgress = (currentRound: string) => {
    const rounds = ['group_stage', 'round_of_16', 'quarter_finals', 'semi_finals', 'finals'];
    const currentIndex = rounds.indexOf(currentRound);
    return ((currentIndex + 1) / rounds.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Tournaments</h2>
          <p className="text-slate-400 mt-1">Compete in leagues and international competitions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            {tournaments.length} Active Tournaments
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="active">Active Tournaments</TabsTrigger>
          <TabsTrigger value="bracket">Tournament Bracket</TabsTrigger>
          <TabsTrigger value="schedule">Match Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {tournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{tournament.name}</CardTitle>
                      <Badge className={getTournamentTypeColor(tournament.type)}>
                        {tournament.type.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <div className={`font-semibold ${getStatusColor(tournament.status)}`}>
                          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Prize Pool:</span>
                        <div className="font-semibold text-green-400">
                          {tournament.prizePool ? formatPrizePool(tournament.prizePool) : 'TBD'}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Teams:</span>
                        <div className="font-semibold text-white">
                          {tournament.maxTeams} teams
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Starts:</span>
                        <div className="font-semibold text-white">
                          {getDaysUntilStart(tournament.startDate) > 0 
                            ? `${getDaysUntilStart(tournament.startDate)} days`
                            : 'Started'
                          }
                        </div>
                      </div>
                    </div>

                    {tournament.status === 'active' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Current Round:</span>
                          <span className="text-white font-semibold">
                            {tournament.currentRound.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <Progress value={getBracketProgress(tournament.currentRound)} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewTournamentBracket(tournament)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Bracket
                      </Button>
                      {tournament.status === 'upcoming' && (
                        <Button 
                          onClick={() => joinTournament(tournament)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Trophy className="h-4 w-4 mr-2" />
                          Join Tournament
                        </Button>
                      )}
                      {tournament.status === 'active' && currentTournament?.id === tournament.id && (
                        <Button 
                          variant="secondary"
                          size="sm"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Participating
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="text-center py-12">
                <Trophy className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Active Tournaments</h3>
                <p className="text-slate-400">Check back later for new competitions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bracket" className="space-y-4">
          {selectedTournament ? (
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                    {selectedTournament.name} - Tournament Bracket
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Tournament Info */}
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Prize Pool:</span>
                        <div className="font-semibold text-green-400">
                          {selectedTournament.prizePool ? formatPrizePool(selectedTournament.prizePool) : 'TBD'}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Current Round:</span>
                        <div className="font-semibold text-white">
                          {selectedTournament.currentRound.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Teams:</span>
                        <div className="font-semibold text-white">{selectedTournament.maxTeams}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <div className={`font-semibold ${getStatusColor(selectedTournament.status)}`}>
                          {selectedTournament.status.charAt(0).toUpperCase() + selectedTournament.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    {/* Bracket Visualization */}
                    <div className="bg-slate-900/50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Round of 16</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {matches.slice(0, 8).map((match, index) => (
                          <div key={match.id} className="bg-slate-800 rounded-lg p-3 border border-slate-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-400">Match {index + 1}</span>
                              <Badge variant="outline" className="text-xs">
                                {match.status.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-white">Team {match.homeTeamId}</span>
                                <span className="text-white font-mono">{match.homeScore}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-white">Team {match.awayTeamId}</span>
                                <span className="text-white font-mono">{match.awayScore}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {match.map}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(match.scheduledDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="text-center py-12">
                <Target className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Select a Tournament</h3>
                <p className="text-slate-400">Choose a tournament from the Active tab to view its bracket</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          {currentTeam && matches.length > 0 ? (
            <div className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                    Upcoming Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {matches.filter(match => match.status === 'scheduled').slice(0, 5).map((match) => (
                      <div key={match.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h4 className="font-semibold text-white">
                                Team {match.homeTeamId} vs Team {match.awayTeamId}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(match.scheduledDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(match.scheduledDate).toLocaleTimeString()}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {match.map}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{match.round}</Badge>
                            <Button 
                              onClick={() => enterMatch(match)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Enter Match
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Scheduled Matches</h3>
                <p className="text-slate-400">Join tournaments to schedule competitive matches</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Tournaments;
