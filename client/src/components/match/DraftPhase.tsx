
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Timer, Users, Target, Shield, Crown, 
  Zap, CheckCircle, Clock, ArrowRight, X
} from "lucide-react";
import { useTournamentState } from "../../lib/stores/useTournamentState";
import { useTeamState } from "../../lib/stores/useTeamState";

function DraftPhase() {
  const { 
    currentMatch, 
    agents, 
    selectedAgents = { home: [], away: [] }, 
    selectAgent, 
    setMatchPhase 
  } = useTournamentState();
  
  const { currentTeam } = useTeamState();
  
  const [draftTimer, setDraftTimer] = useState(20);
  const [currentPick, setCurrentPick] = useState(0);
  const [pickOrder, setPickOrder] = useState<string[]>([]);
  const [bannedAgents, setBannedAgents] = useState<number[]>([]);
  const [aiSuggestion, setAISuggestion] = useState<any>(null);
  const [draftPhase, setDraftPhase] = useState<'ban' | 'pick'>('ban');

  useEffect(() => {
    // Initialize draft order (bans first, then picks)
    const order = [];
    // Ban phase: 6 bans total (3 each team)
    for (let i = 0; i < 6; i++) {
      order.push(i % 2 === 0 ? 'home' : 'away');
    }
    // Pick phase: 10 picks total (5 each team)
    for (let i = 0; i < 10; i++) {
      order.push(i % 2 === 0 ? 'home' : 'away');
    }
    setPickOrder(order);
    generateAISuggestion();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDraftTimer(prev => {
        if (prev <= 1) {
          handleTimeExpired();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPick]);

  const generateAISuggestion = () => {
    if (!agents || agents.length === 0) return;
    
    const availableAgents = agents.filter(agent => 
      !selectedAgents.home.some(selected => selected.id === agent.id) && 
      !selectedAgents.away.some(selected => selected.id === agent.id) &&
      !bannedAgents.includes(agent.id)
    );
    
    if (availableAgents.length > 0) {
      const suggestion = availableAgents[Math.floor(Math.random() * availableAgents.length)];
      setAISuggestion(suggestion);
    }
  };

  const handleTimeExpired = () => {
    if (!agents) return;
    
    const availableAgents = agents.filter(agent => 
      !selectedAgents.home.some(selected => selected.id === agent.id) && 
      !selectedAgents.away.some(selected => selected.id === agent.id) &&
      !bannedAgents.includes(agent.id)
    );
    
    if (availableAgents.length > 0) {
      const randomAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
      if (currentPick < 6) {
        banAgent(randomAgent);
      } else {
        handleAgentSelect(randomAgent);
      }
    }
  };

  const handleAgentSelect = (agent: any) => {
    const currentTeam = pickOrder[currentPick];
    selectAgent(currentTeam, agent);
    
    setCurrentPick(prev => prev + 1);
    setDraftTimer(20);
    generateAISuggestion();
    
    // Switch from ban to pick phase
    if (currentPick === 5) {
      setDraftPhase('pick');
    }
    
    // Check if draft is complete
    if (currentPick >= 15) {
      setTimeout(() => {
        setMatchPhase('map_ban');
      }, 1000);
    }
  };

  const banAgent = (agent: any) => {
    setBannedAgents(prev => [...prev, agent.id]);
    setCurrentPick(prev => prev + 1);
    setDraftTimer(20);
    generateAISuggestion();
    
    // Switch to pick phase after bans
    if (currentPick === 5) {
      setDraftPhase('pick');
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
      case 'duelist': return 'bg-red-500';
      case 'initiator': return 'bg-yellow-500';
      case 'controller': return 'bg-blue-500';
      case 'sentinel': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const isCurrentTeamTurn = () => {
    return pickOrder[currentPick] === 'home';
  };

  const getAvailableAgents = () => {
    if (!agents) return [];
    return agents.filter(agent => 
      !selectedAgents.home.some(selected => selected.id === agent.id) && 
      !selectedAgents.away.some(selected => selected.id === agent.id) &&
      !bannedAgents.includes(agent.id)
    );
  };

  const getBannedAgentsList = () => {
    if (!agents) return [];
    return agents.filter(agent => bannedAgents.includes(agent.id));
  };

  const isDraftComplete = () => {
    return selectedAgents.home.length === 5 && selectedAgents.away.length === 5;
  };

  if (!agents || agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23374151" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10 p-4 lg:p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
            2025 ESPORTS MANAGER Round 1
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md">
              NEXT PLAY
            </Button>
          </div>
        </div>

        {/* Team Headers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Home Team */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-4 text-center">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl lg:text-3xl font-bold text-white">T.M.</h2>
              <div className="text-sm text-white/80">2-6</div>
              <div className="text-4xl lg:text-6xl font-bold text-white">0</div>
            </div>
          </div>

          {/* Center Phase Indicator */}
          <div className="bg-slate-800/80 rounded-lg p-4 text-center flex items-center justify-center">
            <div>
              <div className="text-lg font-bold text-purple-400 mb-2">
                {draftPhase === 'ban' ? 'BAN PICK' : 'PICK PHASE'}
              </div>
              <div className="text-3xl font-bold text-white mb-2">{draftTimer}s</div>
              <Progress value={(20 - draftTimer) / 20 * 100} className="w-24 h-2 mx-auto" />
              <div className="text-sm text-slate-400 mt-2">
                {isCurrentTeamTurn() ? 'Your Turn' : 'Opponent Turn'}
              </div>
            </div>
          </div>

          {/* Away Team */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-4 text-center">
            <div className="flex items-center justify-between">
              <div className="text-4xl lg:text-6xl font-bold text-white">0</div>
              <div className="text-sm text-white/80">7-1</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Dev1</h2>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Team Panel */}
          <div className="xl:col-span-3 space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-cyan-500">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <div className="w-4 h-4 bg-cyan-500 rounded mr-2"></div>
                Your Picks
              </h3>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => {
                  const agent = selectedAgents.home[index];
                  return (
                    <div key={index} className="bg-slate-900/50 rounded-lg p-3 border border-slate-600 min-h-[60px] flex items-center">
                      {agent ? (
                        <div className="flex items-center space-x-3 w-full">
                          <div className={`w-12 h-12 rounded ${getRoleColor(agent.role)} flex items-center justify-center`}>
                            {getRoleIcon(agent.role)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm">{agent.name}</h4>
                            <p className="text-xs text-slate-400">{agent.role}</p>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                      ) : (
                        <div className="text-center text-slate-500 w-full">
                          <div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center mx-auto mb-1">
                            <Users className="h-6 w-6" />
                          </div>
                          <span className="text-xs">Pick {index + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center Agent Selection */}
          <div className="xl:col-span-6">
            <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-purple-400 mb-2">
                  {draftPhase === 'ban' ? 'CHOOSE A CHAMPION THAT YOU WISH TO BAN' : 'CHOOSE YOUR CHAMPION'}
                </h3>
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
                  <span>ALL CHAMPION</span>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="SEARCH..."
                      className="bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Agent Categories */}
              <div className="space-y-4">
                {/* Outstanding Agents */}
                <div>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 rounded-t-lg">
                    <h4 className="font-bold">VERY OUTSTANDING</h4>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-b-lg">
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                      {getAvailableAgents().filter(agent => agent.difficulty >= 4).slice(0, 8).map((agent) => (
                        <div
                          key={agent.id}
                          className={`relative bg-slate-800 rounded-lg p-2 cursor-pointer transition-all hover:scale-105 border-2 ${
                            isCurrentTeamTurn() ? 'hover:border-purple-500' : 'border-slate-600 opacity-50'
                          }`}
                          onClick={() => {
                            if (isCurrentTeamTurn()) {
                              if (draftPhase === 'ban') {
                                banAgent(agent);
                              } else {
                                handleAgentSelect(agent);
                              }
                            }
                          }}
                        >
                          <div className={`w-full h-16 ${getRoleColor(agent.role)} rounded mb-2 flex items-center justify-center`}>
                            {getRoleIcon(agent.role)}
                          </div>
                          <div className="text-xs text-white text-center font-semibold">
                            {agent.name}
                          </div>
                          <div className={`absolute top-1 right-1 w-3 h-3 ${getRoleColor(agent.role)} rounded-full`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Outstanding Agents */}
                <div>
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-center py-2 rounded-t-lg">
                    <h4 className="font-bold">OUTSTANDING</h4>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-b-lg">
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                      {getAvailableAgents().filter(agent => agent.difficulty === 3).slice(0, 16).map((agent) => (
                        <div
                          key={agent.id}
                          className={`relative bg-slate-800 rounded-lg p-2 cursor-pointer transition-all hover:scale-105 border-2 ${
                            isCurrentTeamTurn() ? 'hover:border-purple-500' : 'border-slate-600 opacity-50'
                          }`}
                          onClick={() => {
                            if (isCurrentTeamTurn()) {
                              if (draftPhase === 'ban') {
                                banAgent(agent);
                              } else {
                                handleAgentSelect(agent);
                              }
                            }
                          }}
                        >
                          <div className={`w-full h-16 ${getRoleColor(agent.role)} rounded mb-2 flex items-center justify-center`}>
                            {getRoleIcon(agent.role)}
                          </div>
                          <div className="text-xs text-white text-center font-semibold">
                            {agent.name}
                          </div>
                          <div className={`absolute top-1 right-1 w-3 h-3 ${getRoleColor(agent.role)} rounded-full`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Normal Agents */}
                <div>
                  <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-center py-2 rounded-t-lg">
                    <h4 className="font-bold">NORMAL</h4>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-b-lg">
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                      {getAvailableAgents().filter(agent => agent.difficulty <= 2).map((agent) => (
                        <div
                          key={agent.id}
                          className={`relative bg-slate-800 rounded-lg p-2 cursor-pointer transition-all hover:scale-105 border-2 ${
                            isCurrentTeamTurn() ? 'hover:border-purple-500' : 'border-slate-600 opacity-50'
                          }`}
                          onClick={() => {
                            if (isCurrentTeamTurn()) {
                              if (draftPhase === 'ban') {
                                banAgent(agent);
                              } else {
                                handleAgentSelect(agent);
                              }
                            }
                          }}
                        >
                          <div className={`w-full h-16 ${getRoleColor(agent.role)} rounded mb-2 flex items-center justify-center`}>
                            {getRoleIcon(agent.role)}
                          </div>
                          <div className="text-xs text-white text-center font-semibold">
                            {agent.name}
                          </div>
                          <div className={`absolute top-1 right-1 w-3 h-3 ${getRoleColor(agent.role)} rounded-full`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="text-center mt-6">
                <Button 
                  className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-md border border-slate-500"
                  disabled={true}
                >
                  CONFIRM
                </Button>
              </div>
            </div>
          </div>

          {/* Right Team Panel */}
          <div className="xl:col-span-3 space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border-r-4 border-red-500">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-end">
                Opponent Picks
                <div className="w-4 h-4 bg-red-500 rounded ml-2"></div>
              </h3>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => {
                  const agent = selectedAgents.away[index];
                  return (
                    <div key={index} className="bg-slate-900/50 rounded-lg p-3 border border-slate-600 min-h-[60px] flex items-center">
                      {agent ? (
                        <div className="flex items-center space-x-3 w-full">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm">{agent.name}</h4>
                            <p className="text-xs text-slate-400">{agent.role}</p>
                          </div>
                          <div className={`w-12 h-12 rounded ${getRoleColor(agent.role)} flex items-center justify-center`}>
                            {getRoleIcon(agent.role)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-slate-500 w-full">
                          <div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center mx-auto mb-1">
                            <Users className="h-6 w-6" />
                          </div>
                          <span className="text-xs">Pick {index + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Ban Phases */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Home Team Bans */}
          <div>
            <h4 className="text-cyan-400 font-bold text-center mb-2">BAN PHASE #1</h4>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, index) => {
                const bannedAgent = getBannedAgentsList().filter((_, i) => i % 2 === 0)[index];
                return (
                  <div key={index} className="relative bg-slate-800 rounded-lg h-16 flex items-center justify-center">
                    {bannedAgent ? (
                      <>
                        <div className={`w-full h-full ${getRoleColor(bannedAgent.role)} rounded flex items-center justify-center opacity-50`}>
                          {getRoleIcon(bannedAgent.role)}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <X className="h-8 w-8 text-red-500" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-700 rounded border-2 border-slate-600 border-dashed flex items-center justify-center">
                        <X className="h-6 w-6 text-slate-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-red-400 font-bold text-center mb-2">BAN PHASE #2</h4>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, index) => {
                const bannedAgent = getBannedAgentsList().filter((_, i) => i % 2 === 1)[index];
                return (
                  <div key={index} className="relative bg-slate-800 rounded-lg h-16 flex items-center justify-center">
                    {bannedAgent ? (
                      <>
                        <div className={`w-full h-full ${getRoleColor(bannedAgent.role)} rounded flex items-center justify-center opacity-50`}>
                          {getRoleIcon(bannedAgent.role)}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <X className="h-8 w-8 text-red-500" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-700 rounded border-2 border-slate-600 border-dashed flex items-center justify-center">
                        <X className="h-6 w-6 text-slate-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-red-400 font-bold text-center mb-2">BAN PHASE #3</h4>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-slate-700 rounded-lg h-16 border-2 border-slate-600 border-dashed flex items-center justify-center">
                  <X className="h-6 w-6 text-slate-500" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-cyan-400 font-bold text-center mb-2">BAN PHASE #4</h4>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-slate-700 rounded-lg h-16 border-2 border-slate-600 border-dashed flex items-center justify-center">
                  <X className="h-6 w-6 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {isDraftComplete() && (
          <div className="text-center mt-6">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md"
              onClick={() => setMatchPhase('map_ban')}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Continue to Map Ban
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DraftPhase;
