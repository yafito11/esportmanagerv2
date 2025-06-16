import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Timer, Users, Target, Shield, Crown, 
  Zap, CheckCircle, Clock, ArrowRight
} from "lucide-react";
import { useTournamentState } from "../../lib/stores/useTournamentState";
import { useTeamState } from "../../lib/stores/useTeamState";

function DraftPhase() {
  const { 
    currentMatch, 
    agents, 
    selectedAgents, 
    selectAgent, 
    setMatchPhase 
  } = useTournamentState();
  
  const { currentTeam } = useTeamState();
  
  const [draftTimer, setDraftTimer] = useState(20);
  const [currentPick, setCurrentPick] = useState(0);
  const [pickOrder, setPickOrder] = useState<string[]>([]);
  const [bannedAgents, setBannedAgents] = useState<number[]>([]);
  const [aiSuggestion, setAISuggestion] = useState<any>(null);

  useEffect(() => {
    // Initialize draft order (alternating picks)
    const order = [];
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
    const availableAgents = agents.filter(agent => 
      !selectedAgents.home.includes(agent) && 
      !selectedAgents.away.includes(agent) &&
      !bannedAgents.includes(agent.id)
    );
    
    if (availableAgents.length > 0) {
      const suggestion = availableAgents[Math.floor(Math.random() * availableAgents.length)];
      setAISuggestion(suggestion);
    }
  };

  const handleTimeExpired = () => {
    // Auto-pick random agent if time expires
    const availableAgents = agents.filter(agent => 
      !selectedAgents.home.includes(agent) && 
      !selectedAgents.away.includes(agent) &&
      !bannedAgents.includes(agent.id)
    );
    
    if (availableAgents.length > 0) {
      const randomAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
      handleAgentSelect(randomAgent);
    }
  };

  const handleAgentSelect = (agent: any) => {
    const currentTeam = pickOrder[currentPick];
    selectAgent(currentTeam, agent);
    
    setCurrentPick(prev => prev + 1);
    setDraftTimer(20);
    generateAISuggestion();
    
    // Check if draft is complete
    if (currentPick >= 9) {
      setTimeout(() => {
        setMatchPhase('map_ban');
      }, 1000);
    }
  };

  const banAgent = (agent: any) => {
    setBannedAgents(prev => [...prev, agent.id]);
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

  const isCurrentTeamTurn = () => {
    return pickOrder[currentPick] === 'home'; // Assuming we're always home team
  };

  const getAvailableAgents = () => {
    return agents.filter(agent => 
      !selectedAgents.home.includes(agent) && 
      !selectedAgents.away.includes(agent) &&
      !bannedAgents.includes(agent.id)
    );
  };

  const isDraftComplete = () => {
    return selectedAgents.home.length === 5 && selectedAgents.away.length === 5;
  };

  return (
    <div className="space-y-6">
      {/* Draft Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Agent Draft Phase</h2>
              <p className="text-slate-400">Select your team composition</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {draftTimer}s
              </div>
              <Progress value={(20 - draftTimer) / 20 * 100} className="w-24 h-2" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Pick {currentPick + 1} of 10 • {pickOrder[currentPick] === 'home' ? 'Your Turn' : 'Opponent Turn'}
            </div>
            <Badge variant={isCurrentTeamTurn() ? 'default' : 'secondary'}>
              {isCurrentTeamTurn() ? 'Your Pick' : 'Opponent Pick'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Team Compositions */}
        <div className="col-span-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Home Team */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  Your Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const agent = selectedAgents.home[index];
                    return (
                      <div key={index} className="bg-slate-900/50 rounded-lg p-3 border border-slate-600 min-h-[60px] flex items-center">
                        {agent ? (
                          <div className="flex items-center space-x-3 w-full">
                            <Badge className={getRoleColor(agent.role)}>
                              {getRoleIcon(agent.role)}
                            </Badge>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{agent.name}</h4>
                              <p className="text-xs text-slate-400">{agent.role}</p>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          </div>
                        ) : (
                          <div className="text-center text-slate-500 w-full">
                            <Users className="h-6 w-6 mx-auto mb-1" />
                            <span className="text-sm">Pick {index + 1}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Away Team */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-red-400" />
                  Opponent Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const agent = selectedAgents.away[index];
                    return (
                      <div key={index} className="bg-slate-900/50 rounded-lg p-3 border border-slate-600 min-h-[60px] flex items-center">
                        {agent ? (
                          <div className="flex items-center space-x-3 w-full">
                            <Badge className={getRoleColor(agent.role)}>
                              {getRoleIcon(agent.role)}
                            </Badge>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{agent.name}</h4>
                              <p className="text-xs text-slate-400">{agent.role}</p>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          </div>
                        ) : (
                          <div className="text-center text-slate-500 w-full">
                            <Users className="h-6 w-6 mx-auto mb-1" />
                            <span className="text-sm">Pick {index + 1}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Agents */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Target className="h-5 w-5 mr-2 text-purple-400" />
                Available Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {getAvailableAgents().map((agent) => (
                  <div
                    key={agent.id}
                    className={`bg-slate-900/50 rounded-lg p-3 border border-slate-600 cursor-pointer transition-colors ${
                      isCurrentTeamTurn() ? 'hover:border-purple-500 hover:bg-purple-900/20' : 'opacity-50'
                    }`}
                    onClick={() => isCurrentTeamTurn() && handleAgentSelect(agent)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getRoleColor(agent.role)}>
                        {getRoleIcon(agent.role)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {agent.difficulty}/5
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-white text-sm">{agent.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{agent.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-4">
          {/* AI Suggestion */}
          {aiSuggestion && isCurrentTeamTurn() && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm">AI Analyst Suggestion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getRoleColor(aiSuggestion.role)}>
                      {getRoleIcon(aiSuggestion.role)}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-white text-sm">{aiSuggestion.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{aiSuggestion.description}</p>
                  <Button 
                    size="sm" 
                    className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleAgentSelect(aiSuggestion)}
                    disabled={!isCurrentTeamTurn()}
                  >
                    <CheckCircle className="h-3 w-3 mr-2" />
                    Pick Suggested
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Draft Order */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Draft Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pickOrder.map((team, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-2 p-2 rounded ${
                      index === currentPick ? 'bg-purple-600/20 border border-purple-500' : 'bg-slate-900/30'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                      {index + 1}
                    </div>
                    <span className={`text-sm ${team === 'home' ? 'text-blue-400' : 'text-red-400'}`}>
                      {team === 'home' ? 'Your Team' : 'Opponent'}
                    </span>
                    {index === currentPick && (
                      <ArrowRight className="h-4 w-4 text-purple-400 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Composition Analysis */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Team Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Role Balance</div>
                <div className="text-sm text-white">
                  {selectedAgents.home.length > 0 ? 'Balanced' : 'Incomplete'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Synergy</div>
                <div className="text-sm text-yellow-400">Developing</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Strategy</div>
                <div className="text-sm text-blue-400">Adaptive</div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          {isDraftComplete() && (
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => setMatchPhase('map_ban')}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Continue to Map Ban
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DraftPhase;
