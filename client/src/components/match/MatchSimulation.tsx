import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Play, Pause, Volume2, VolumeX, Timer, 
  Target, Shield, Users, ArrowLeft, MessageSquare
} from "lucide-react";
import { useTournamentState } from "../../lib/stores/useTournamentState";
import { useTeamState } from "../../lib/stores/useTeamState";
import DraftPhase from "./DraftPhase";
import TacticalMinimap from "./TacticalMinimap";
import TimeoutChat from "./TimeoutChat";

const MAPS = [
  'Ascent', 'Bind', 'Breeze', 'Fracture', 'Haven', 
  'Icebox', 'Lotus', 'Pearl', 'Split', 'Sunset'
];

function MatchSimulation() {
  const { 
    currentMatch, 
    matchPhase, 
    setMatchPhase, 
    currentRound, 
    updateCurrentRound,
    homeTeamScore,
    awayTeamScore,
    updateMatchScore,
    timeouts,
    useTimeout,
    resetMatchState
  } = useTournamentState();

  const { currentTeam } = useTeamState();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [roundTimer, setRoundTimer] = useState(120); // 2 minutes per round
  const [showTimeoutChat, setShowTimeoutChat] = useState(false);
  const [roundEvents, setRoundEvents] = useState<string[]>([]);
  const [selectedMap, setSelectedMap] = useState<string>('');
  const [mapSelectionComplete, setMapSelectionComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && matchPhase === 'simulation' && roundTimer > 0) {
      interval = setInterval(() => {
        setRoundTimer(prev => {
          if (prev <= 1) {
            endRound();
            return 120;
          }

          // Generate random events during the round
          if (prev % 30 === 0) {
            generateRoundEvent();
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, matchPhase, roundTimer]);

  useEffect(() => {
    if (matchPhase === 'map_selection' && !selectedMap) {
      // Random map selection
      setTimeout(() => {
        const randomMap = MAPS[Math.floor(Math.random() * MAPS.length)];
        setSelectedMap(randomMap);
        setTimeout(() => {
          setMapSelectionComplete(true);
          setMatchPhase('draft');
        }, 2000);
      }, 1000);
    }
  }, [matchPhase, selectedMap, setMatchPhase]);

  const generateRoundEvent = () => {
    const events = [
      "Home team takes map control",
      "Away team secures pick",
      "Tactical timeout called",
      "Clutch situation developing",
      "Economy reset incoming",
      "Strategic repositioning",
      "Information gathering phase"
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    setRoundEvents(prev => [...prev.slice(-4), randomEvent]);
  };

  const endRound = () => {
    const homeWin = Math.random() > 0.5;
    const newHomeScore = homeWin ? homeTeamScore + 1 : homeTeamScore;
    const newAwayScore = homeWin ? awayTeamScore : awayTeamScore + 1;

    updateMatchScore(newHomeScore, newAwayScore);
    updateCurrentRound(currentRound + 1);

    // Check for match end (first to 13 or overtime)
    if (newHomeScore === 13 || newAwayScore === 13) {
      if (Math.abs(newHomeScore - newAwayScore) >= 2) {
        setMatchPhase('completed');
        setIsPlaying(false);
        return;
      }
    }

    // Check for overtime (12-12)
    if (newHomeScore === 12 && newAwayScore === 12) {
      // Continue playing until someone wins by 2
    }

    setRoundEvents([]);
  };

  const handleTimeout = (team: 'home' | 'away') => {
    if (timeouts[team] > 0) {
      useTimeout(team);
      setIsPlaying(false);
      setShowTimeoutChat(true);
    }
  };

  const resumeFromTimeout = () => {
    setShowTimeoutChat(false);
    setIsPlaying(true);
  };

  const exitMatch = () => {
    resetMatchState();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, isHome: boolean) => {
    const isWinning = isHome ? score > awayTeamScore : score > homeTeamScore;
    return isWinning ? 'text-green-400' : 'text-white';
  };

  const renderCurrentPhase = () => {
    switch (matchPhase) {
      case 'map_selection':
        return (
          <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Pemilihan Map</h1>
              {!selectedMap ? (
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
              ) : (
                <div className="bg-slate-800 rounded-lg p-8 border border-slate-600">
                  <h2 className="text-2xl font-bold text-purple-400 mb-2">Map Terpilih:</h2>
                  <h3 className="text-3xl font-bold text-white">{selectedMap}</h3>
                  {mapSelectionComplete && (
                    <p className="text-slate-400 mt-4">Melanjutkan ke Draft Phase...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 'draft':
        return <DraftPhase />;
      case 'simulation':
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* Main Game View */}
            <div className="col-span-8 space-y-6">
              {/* Score Board */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-6 items-center">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Team {currentMatch.homeTeamId}
                      </h3>
                      <div className={`text-6xl font-bold ${getScoreColor(homeTeamScore, true)}`}>
                        {homeTeamScore}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-2">Round {currentRound + 1}</div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {formatTime(roundTimer)}
                      </div>
                      <Progress value={(120 - roundTimer) / 120 * 100} className="h-2" />

                      <div className="flex justify-center space-x-2 mt-4">
                        <Button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleTimeout('home')}
                          disabled={timeouts.home === 0}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Timeout ({timeouts.home})
                        </Button>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Team {currentMatch.awayTeamId}
                      </h3>
                      <div className={`text-6xl font-bold ${getScoreColor(awayTeamScore, false)}`}>
                        {awayTeamScore}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tactical Minimap */}
              <TacticalMinimap />
            </div>

            {/* Sidebar */}
            <div className="col-span-4 space-y-4">
              {/* Round Events */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm">Round Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {roundEvents.length > 0 ? (
                      roundEvents.map((event, index) => (
                        <div key={index} className="text-sm text-slate-300 p-2 bg-slate-900/50 rounded">
                          {event}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No events yet...</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Team Stats */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm">Team Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Round Win Rate</span>
                      <span className="text-white">
                        {currentRound > 0 ? Math.round((homeTeamScore / currentRound) * 100) : 0}%
                      </span>
                    </div>
                    <Progress value={currentRound > 0 ? (homeTeamScore / currentRound) * 100 : 0} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Economy</span>
                      <span className="text-green-400">Strong</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Map Control</span>
                      <span className="text-blue-400">Contested</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Match Info */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm">Match Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Map:</span>
                    <span className="text-white">{currentMatch.map}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Round:</span>
                    <span className="text-white">{currentRound + 1}/30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Format:</span>
                    <span className="text-white">Best of 30</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'timeout':
        return <TimeoutChat />;
      case 'completed':
          return (
            <Card className="bg-slate-800/50 border-slate-700 max-w-2xl mx-auto">
              <CardContent className="text-center py-12">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Match Complete!</h2>
                  <p className="text-slate-400">Final Score</p>
                </div>
  
                <div className="grid grid-cols-3 gap-6 items-center mb-8">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Team {currentMatch.homeTeamId}
                    </h3>
                    <div className={`text-6xl font-bold ${getScoreColor(homeTeamScore, true)}`}>
                      {homeTeamScore}
                    </div>
                  </div>
  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-400">VS</div>
                  </div>
  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Team {currentMatch.awayTeamId}
                    </h3>
                    <div className={`text-6xl font-bold ${getScoreColor(awayTeamScore, false)}`}>
                      {awayTeamScore}
                    </div>
                  </div>
                </div>
  
                <div className="space-y-4">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {homeTeamScore > awayTeamScore ? 'Victory!' : 'Defeat'}
                  </Badge>
  
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline">
                      View Match Analysis
                    </Button>
                    <Button onClick={exitMatch} className="bg-purple-600 hover:bg-purple-700">
                      Return to Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
      default:
        return (
          <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <Button 
              onClick={() => setMatchPhase('map_selection')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
            >
              Mulai Pertandingan
            </Button>
          </div>
        );
    }
  };

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center text-slate-400">
            <p>No match selected</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={exitMatch}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Match
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Team {currentMatch.homeTeamId} vs Team {currentMatch.awayTeamId}
                </h1>
                <p className="text-sm text-slate-400">{currentMatch.map || 'Map TBD'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {matchPhase.replace('_', ' ').toUpperCase()}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Match Phase Content */}
        {renderCurrentPhase()}
      </div>

      {/* Timeout Chat Modal */}
      {showTimeoutChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-auto">
            <TimeoutChat onResume={resumeFromTimeout} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchSimulation;