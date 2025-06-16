import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, Clock, Play, ChevronRight, Target, Users } from "lucide-react";
import { useGameState } from "../../lib/stores/useGameState";
import { useTeamState } from "../../lib/stores/useTeamState";
import { useTournamentState } from "../../lib/stores/useTournamentState";
import { apiRequest } from "../../lib/queryClient";

function Schedule() {
  const { gameState, setGameState } = useGameState();
  const { currentTeam } = useTeamState();
  const { upcomingMatches, setUpcomingMatches, setCurrentMatch } = useTournamentState();
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (currentTeam) {
      loadUpcomingMatches();
    }
  }, [currentTeam]);

  const loadUpcomingMatches = async () => {
    if (!currentTeam) return;
    
    try {
      const response = await apiRequest("GET", `/api/matches/upcoming/${currentTeam.id}`);
      const matches = await response.json();
      setUpcomingMatches(matches);
    } catch (error) {
      console.error("Failed to load upcoming matches:", error);
    }
  };

  const advanceDay = async () => {
    setLoading(true);
    try {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);
      
      // Update game state
      if (gameState) {
        await apiRequest("PUT", `/api/gamestate/${gameState.userId}`, {
          currentDate: newDate.toISOString()
        });
      }
      
      // Check for matches today
      await loadUpcomingMatches();
    } catch (error) {
      console.error("Failed to advance day:", error);
    } finally {
      setLoading(false);
    }
  };

  const startMatch = (match: any) => {
    setCurrentMatch(match);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isMatchToday = (matchDate: string | Date) => {
    const match = new Date(matchDate);
    const today = new Date(currentDate);
    return match.toDateString() === today.toDateString();
  };

  const getDaysUntilMatch = (matchDate: string | Date) => {
    const match = new Date(matchDate);
    const today = new Date(currentDate);
    const diffTime = match.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Schedule & Calendar</h2>
          <p className="text-slate-400 mt-1">Manage your team's daily activities and matches</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-slate-400">Current Date</div>
            <div className="text-lg font-semibold text-white">
              {formatDate(currentDate)}
            </div>
          </div>
          <Button 
            onClick={advanceDay} 
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <ChevronRight className="h-4 w-4 mr-2" />
            {loading ? "Processing..." : "Next Day"}
          </Button>
        </div>
      </div>

      {/* Today's Schedule */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="h-5 w-5 mr-2 text-purple-400" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingMatches.filter(match => isMatchToday(match.scheduledDate)).length > 0 ? (
            <div className="space-y-4">
              {upcomingMatches.filter(match => isMatchToday(match.scheduledDate)).map((match) => (
                <div key={match.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-green-400" />
                        <span className="font-semibold text-white">Match vs Team #{match.awayTeamId}</span>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Today
                      </Badge>
                    </div>
                    <Button 
                      onClick={() => startMatch(match)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play Match
                    </Button>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Tournament:</span>
                      <div className="text-white">Championship League</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Time:</span>
                      <div className="text-white">
                        {new Date(match.scheduledDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Map:</span>
                      <div className="text-white">{match.map || 'TBD'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No matches scheduled for today</p>
              <p className="text-sm text-slate-500 mt-2">Use this time for training and scouting</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Matches */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Target className="h-5 w-5 mr-2 text-blue-400" />
            Upcoming Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingMatches.filter(match => !isMatchToday(match.scheduledDate)).length > 0 ? (
            <div className="space-y-3">
              {upcomingMatches
                .filter(match => !isMatchToday(match.scheduledDate))
                .slice(0, 5)
                .map((match) => {
                  const daysUntil = getDaysUntilMatch(match.scheduledDate);
                  return (
                    <div key={match.id} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-slate-700">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span className="text-white">vs Team #{match.awayTeamId}</span>
                        </div>
                        <Badge variant={daysUntil <= 3 ? "destructive" : "secondary"}>
                          {daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                        </Badge>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-slate-400">
                          {formatDate(match.scheduledDate)}
                        </div>
                        <div className="text-white">
                          {new Date(match.scheduledDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No upcoming matches scheduled</p>
              <p className="text-sm text-slate-500 mt-2">Check tournaments to join competitions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Activities */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm">Training Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Aim Training</span>
                <span className="text-green-400">Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Team Practice</span>
                <span className="text-yellow-400">In Progress</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Strategy Review</span>
                <span className="text-slate-500">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm">Scouting Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">New Players</span>
                <Badge variant="outline" className="text-xs">3 reports</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Opponent Analysis</span>
                <Badge variant="outline" className="text-xs">1 report</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Meta Changes</span>
                <Badge variant="outline" className="text-xs">Updated</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Schedule;
