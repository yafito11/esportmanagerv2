import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { 
  Target, Shield, Crown, Zap, Users, Search, Filter,
  TrendingUp, BarChart3, Activity, Star, Brain
} from "lucide-react";
import { AGENTS, getAgentsByRole, Agent } from "../../data/agents";

function AgentStats() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(AGENTS);

  useEffect(() => {
    filterAgents();
  }, [searchTerm, roleFilter, difficultyFilter]);

  const filterAgents = () => {
    let filtered = [...AGENTS];

    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(agent => agent.role === roleFilter);
    }

    if (difficultyFilter !== "all") {
      const difficulty = parseInt(difficultyFilter);
      filtered = filtered.filter(agent => agent.difficulty === difficulty);
    }

    setFilteredAgents(filtered);
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

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-400';
    if (difficulty <= 3) return 'text-yellow-400';
    if (difficulty <= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAgentStats = () => {
    const roleStats = {
      duelist: AGENTS.filter(a => a.role === 'duelist').length,
      initiator: AGENTS.filter(a => a.role === 'initiator').length,
      controller: AGENTS.filter(a => a.role === 'controller').length,
      sentinel: AGENTS.filter(a => a.role === 'sentinel').length,
    };

    const difficultyStats = {
      easy: AGENTS.filter(a => a.difficulty <= 2).length,
      medium: AGENTS.filter(a => a.difficulty === 3).length,
      hard: AGENTS.filter(a => a.difficulty >= 4).length,
    };

    const originalAgents = AGENTS.filter(a => a.isOriginal).length;
    const adaptedAgents = AGENTS.filter(a => !a.isOriginal).length;

    return { roleStats, difficultyStats, originalAgents, adaptedAgents };
  };

  const stats = getAgentStats();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <ScrollArea className="h-[calc(100vh-300px)] w-full">
      <div className="space-y-6 p-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-white">Agent Statistics</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
           
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Duelists</p>
                <p className="text-2xl font-bold text-red-400">{stats.roleStats.duelist}</p>
              </div>
              <Target className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Initiators</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.roleStats.initiator}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Controllers</p>
                <p className="text-2xl font-bold text-blue-400">{stats.roleStats.controller}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Sentinels</p>
                <p className="text-2xl font-bold text-green-400">{stats.roleStats.sentinel}</p>
              </div>
              <Crown className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="agents">All Agents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          {/* Filters */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Filter className="h-5 w-5 mr-2 text-purple-400" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Input
                    placeholder="Search agents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="duelist">Duelist</option>
                  <option value="initiator">Initiator</option>
                  <option value="controller">Controller</option>
                  <option value="sentinel">Sentinel</option>
                </select>

                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-white"
                >
                  <option value="all">All Difficulties</option>
                  <option value="1">Easy (1-2)</option>
                  <option value="3">Medium (3)</option>
                  <option value="4">Hard (4-5)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Agent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent) => (
              <Card 
                key={agent.id} 
                className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                onClick={() => setSelectedAgent(agent)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`${getRoleColor(agent.role)}`}>
                      {getRoleIcon(agent.role)}
                      <span className="ml-1">{agent.role.toUpperCase()}</span>
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: agent.difficulty }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${getDifficultyColor(agent.difficulty)}`} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-semibold text-white text-lg mb-1">{agent.name}</h4>
                  {agent.realName && (
                    <p className="text-sm text-slate-400 mb-2">{agent.realName}</p>
                  )}
                  <p className="text-sm text-slate-300 mb-3">{agent.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Abilities</span>
                      <span className="text-white">{agent.abilities.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Difficulty</span>
                      <span className={getDifficultyColor(agent.difficulty)}>
                        {agent.difficulty}/5
                      </span>
                    </div>
                    {agent.nationality && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Origin</span>
                        <span className="text-white">{agent.nationality}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {agent.abilities.slice(0, 2).map((ability, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {ability.name}
                      </Badge>
                    ))}
                    {agent.abilities.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{agent.abilities.length - 2} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                  Role Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.roleStats).map(([role, count]) => (
                    <div key={role} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300 capitalize">{role}</span>
                        <span className="text-white font-mono">{count}</span>
                      </div>
                      <Progress value={(count / AGENTS.length) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-400" />
                  Difficulty Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-400">Easy (1-2)</span>
                      <span className="text-white font-mono">{stats.difficultyStats.easy}</span>
                    </div>
                    <Progress value={(stats.difficultyStats.easy / AGENTS.length) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-yellow-400">Medium (3)</span>
                      <span className="text-white font-mono">{stats.difficultyStats.medium}</span>
                    </div>
                    <Progress value={(stats.difficultyStats.medium / AGENTS.length) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-red-400">Hard (4-5)</span>
                      <span className="text-white font-mono">{stats.difficultyStats.hard}</span>
                    </div>
                    <Progress value={(stats.difficultyStats.hard / AGENTS.length) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compare">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="text-center py-12">
              <Brain className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Agent Comparison</h3>
              <p className="text-slate-400">Agent comparison tool coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </ScrollArea>
  );
}

export default AgentStats;