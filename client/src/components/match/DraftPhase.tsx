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

  // Safe check for selectedAgents to avoid "not iterable" error
  const safeSelectedAgents = {
    home: selectedAgents?.home || [],
    away: selectedAgents?.away || [],
  };

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
      !safeSelectedAgents.home.some(selected => selected.id === agent.id) && 
      !safeSelectedAgents.away.some(selected => selected.id === agent.id) &&
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
      !safeSelectedAgents.home.some(selected => selected.id === agent.id) && 
      !safeSelectedAgents.away.some(selected => selected.id === agent.id) &&
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
      !safeSelectedAgents.home.some(selected => selected.id === agent.id) && 
      !safeSelectedAgents.away.some(selected => selected.id === agent.id) &&
      !bannedAgents.includes(agent.id)
    );
  };

  const getBannedAgentsList = () => {
    if (!agents) return [];
    return agents.filter(agent => bannedAgents.includes(agent.id));
  };

  const isDraftComplete = () => {
    return safeSelectedAgents.home.length === 5 && safeSelectedAgents.away.length === 5;
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
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      <div className="relative z-10 p-2 lg:p-3 h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-lg lg:text-2xl font-bold text-white mb-1">
            2025 ESPORTS MANAGER Round 1
          </h1>
          <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm">
            NEXT PLAY
          </Button>
        </div>

        {/* Team Headers */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* Home Team */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-2 text-center">
            <div className="flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-bold text-white">T.M.</h2>
              <div className="text-xs text-white/80">2-6</div>
              <div className="text-2xl lg:text-3xl font-bold text-white">0</div>
            </div>
          </div>

          {/* Center Phase Indicator */}
          <div className="bg-slate-800/80 rounded-lg p-2 text-center flex items-center justify-center">
            <div>
              <div className="text-sm font-bold text-purple-400 mb-1">
                {draftPhase === 'ban' ? 'BAN PICK' : 'PICK PHASE'}
              </div>
              <div className="text-xl font-bold text-white mb-1">{draftTimer}s</div>
              <Progress value={(20 - draftTimer) / 20 * 100} className="w-16 h-1 mx-auto" />
              <div className="text-xs text-slate-400 mt-1">
                {isCurrentTeamTurn() ? 'Your Turn' : 'Opponent Turn'}
              </div>
            </div>
          </div>

          {/* Away Team */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-2 text-center">
            <div className="flex items-center justify-between">
              <div className="text-2xl lg:text-3xl font-bold text-white">0</div>
              <div className="text-xs text-white/80">7-1</div>
              <h2 className="text-lg lg:text-xl font-bold text-white">Dev1</h2>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
          {/* Left Team Panel */}
          <div className="col-span-3">
            <div className="bg-slate-800/50 rounded-lg p-2 border-l-4 border-cyan-500 h-full">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center">
                <div className="w-3 h-3 bg-cyan-500 rounded mr-1"></div>
                Your Picks
              </h3>
              <div className="space-y-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const agent = safeSelectedAgents.home[index];
                  return (
                    <div key={index} className="bg-slate-900/50 rounded p-2 border border-slate-600 min-h-[40px] flex items-center">
                      {agent ? (
                        <div className="flex items-center space-x-2 w-full">
                          <div className={`w-8 h-8 rounded ${getRoleColor(agent.role)} flex items-center justify-center`}>
                            {getRoleIcon(agent.role)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-xs truncate">{agent.name}</h4>
                            <p className="text-xs text-slate-400">{agent.role}</p>
                          </div>
                          <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                        </div>
                      ) : (
                        <div className="text-center text-slate-500 w-full">
                          <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center mx-auto">
                            <Users className="h-4 w-4" />
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
          <div className="col-span-6">
            <div className="bg-slate-800/50 rounded-lg p-2 h-full overflow-y-auto">
              <div className="text-center mb-2">
                <h3 className="text-sm font-bold text-purple-400 mb-1">
                  {draftPhase === 'ban' ? 'CHOOSE A CHAMPION TO BAN' : 'CHOOSE YOUR CHAMPION'}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                  <span>ALL CHAMPION</span>
                  <input 
                    type="text" 
                    placeholder="SEARCH..."
                    className="bg-slate-700 text-white px-2 py-1 rounded border border-slate-600 w-32 text-xs"
                  />
                </div>
              </div>

              {/* Agent Categories */}
              <div className="space-y-2">
                {/* Outstanding Agents */}
                <div>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-1 rounded-t">
                    <h4 className="font-bold text-xs">VERY OUTSTANDING</h4>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded-b">
                    <div className="grid grid-cols-6 lg:grid-cols-8 gap-1">
                      {getAvailableAgents().filter(agent => agent.difficulty >= 4).slice(0, 8).map((agent) => (
                        <div
                          key={agent.id}
                          className={`relative bg-slate-800 rounded p-1 cursor-pointer transition-all hover:scale-105 border ${
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
                          <div className={`w-full h-8 ${getRoleColor(agent.role)} rounded mb-1 flex items-center justify-center`}>
                            {getRoleIcon(agent.role)}
                          </div>
                          <div className="text-xs text-white text-center font-semibold truncate">
                            {agent.name}
                          </div>
                          <div className={`absolute top-0 right-0 w-2 h-2 ${getRoleColor(agent.role)} rounded-full`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Outstanding Agents */}
                <div>
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-center py-1 rounded-t">
                    <h4 className="font-bold text-xs">OUTSTANDING</h4>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded-b">
                    <div className="grid grid-cols-6 lg:grid-cols-8 gap-1">
                      {getAvailableAgents().filter(agent => agent.difficulty === 3).slice(0, 16).map((agent) => (
                        <div
                          key={agent.id}
                          className={`relative bg-slate-800 rounded p-1 cursor-pointer transition-all hover:scale-105 border ${
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
                          <div className={`w-full h-8 ${getRoleColor(agent.role)} rounded mb-1 flex items-center justify-center`}>
                            {getRoleIcon(agent.role)}
                          </div>
                          <div className="text-xs text-white text-center font-semibold truncate">
                            {agent.name}
                          </div>
                          <div className={`absolute top-0 right-0 w-2 h-2 ${getRoleColor(agent.role)} rounded-full`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Normal Agents */}
                <div>
                  <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-center py-1 rounded-t">
                    <h4 className="font-bold text-xs">NORMAL</h4>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded-b">
                    <div className="grid grid-cols-6 lg:grid-cols-8 gap-1">
                      {getAvailableAgents().filter(agent => agent.difficulty <= 2).map((agent) => (
                        <div
                          key={agent.id}
                          className={`relative bg-slate-800 rounded p-1 cursor-pointer transition-all hover:scale-105 border ${
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
                          <div className={`w-full h-8 ${getRoleColor(agent.role)} rounded mb-1 flex items-center justify-center`}>
                            {getRoleIcon(agent.role)}
                          </div>
                          <div className="text-xs text-white text-center font-semibold truncate">
                            {agent.name}
                          </div>
                          <div className={`absolute top-0 right-0 w-2 h-2 ${getRoleColor(agent.role)} rounded-full`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="text-center mt-2">
                <Button 
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-1 rounded text-sm border border-slate-500"
                  disabled={true}
                >
                  CONFIRM
                </Button>
              </div>
            </div>
          </div>

          {/* Right Team Panel */}
          <div className="col-span-3">
            <div className="bg-slate-800/50 rounded-lg p-2 border-r-4 border-red-500 h-full">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center justify-end">
                Opponent Picks
                <div className="w-3 h-3 bg-red-500 rounded ml-1"></div>
              </h3>
              <div className="space-y-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const agent = safeSelectedAgents.away[index];
                  return (
                    <div key={index} className="bg-slate-900/50 rounded p-2 border border-slate-600 min-h-[40px] flex items-center">
                      {agent ? (
                        <div className="flex items-center space-x-2 w-full">
                          <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-xs truncate">{agent.name}</h4>
                            <p className="text-xs text-slate-400">{agent.role}</p>
                          </div>
                          <div className={`w-8 h-8 rounded ${getRoleColor(agent.role)} flex items-center justify-center`}>
                            {getRoleIcon(agent.role)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-slate-500 w-full">
                          <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center mx-auto">
                            <Users className="h-4 w-4" />
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
        <div className="grid grid-cols-4 gap-2 mt-2">
          {/* Home Team Bans */}
          <div>
            <h4 className="text-cyan-400 font-bold text-center mb-1 text-xs">BAN PHASE #1</h4>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, index) => {
                const bannedAgent = getBannedAgentsList().filter((_, i) => i % 2 === 0)[index];
                return (
                  <div key={index} className="relative bg-slate-800 rounded h-8 flex items-center justify-center">
                    {bannedAgent ? (
                      <>
                        <div className={`w-full h-full ${getRoleColor(bannedAgent.role)} rounded flex items-center justify-center opacity-50`}>
                          {getRoleIcon(bannedAgent.role)}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-500" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-700 rounded border border-slate-600 border-dashed flex items-center justify-center">
                        <X className="h-3 w-3 text-slate-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-red-400 font-bold text-center mb-1 text-xs">BAN PHASE #2</h4>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, index) => {
                const bannedAgent = getBannedAgentsList().filter((_, i) => i % 2 === 1)[index];
                return (
                  <div key={index} className="relative bg-slate-800 rounded h-8 flex items-center justify-center">
                    {bannedAgent ? (
                      <>
                        <div className={`w-full h-full ${getRoleColor(bannedAgent.role)} rounded flex items-center justify-center opacity-50`}>
                          {getRoleIcon(bannedAgent.role)}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-500" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-700 rounded border border-slate-600 border-dashed flex items-center justify-center">
                        <X className="h-3 w-3 text-slate-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-red-400 font-bold text-center mb-1 text-xs">BAN PHASE #3</h4>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-slate-700 rounded h-8 border border-slate-600 border-dashed flex items-center justify-center">
                  <X className="h-3 w-3 text-slate-500" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-cyan-400 font-bold text-center mb-1 text-xs">BAN PHASE #4</h4>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-slate-700 rounded h-8 border border-slate-600 border-dashed flex items-center justify-center">
                  <X className="h-3 w-3 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {isDraftComplete() && (
          <div className="text-center mt-2">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
              onClick={() => setMatchPhase('map_ban')}
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              Continue to Map Ban
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DraftPhase;