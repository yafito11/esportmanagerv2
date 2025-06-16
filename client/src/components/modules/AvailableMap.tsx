
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  MapPin, Users, Target, Shield, Crown, Zap, 
  Globe, DollarSign, UserPlus, Star
} from "lucide-react";
import { useTeamState } from "../../lib/stores/useTeamState";
import { apiRequest } from "../../lib/queryClient";

interface AvailableMapProps {
  onPlayerSelect?: (player: any) => void;
  showSignButton?: boolean;
}

function AvailableMap({ onPlayerSelect, showSignButton = true }: AvailableMapProps) {
  const { 
    availablePlayers, 
    currentTeam, 
    addPlayerToTeam, 
    setAvailablePlayers,
    teamPlayers 
  } = useTeamState();
  
  const [loading, setLoading] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

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

  const canAffordPlayer = (player: any) => {
    if (!currentTeam) return false;
    const playerCost = parseFloat(player.marketValue);
    const teamBudget = parseFloat(currentTeam.budget);
    return teamBudget >= playerCost;
  };

  const hasRosterSpace = () => {
    return teamPlayers.length < 6;
  };

  const signPlayer = async (player: any) => {
    if (!currentTeam || !canAffordPlayer(player) || !hasRosterSpace()) return;
    
    setLoading(true);
    setSelectedPlayerId(player.id);
    
    try {
      const salary = parseFloat(player.marketValue) * 0.2;
      const response = await apiRequest("POST", "/api/players/sign", {
        playerId: player.id,
        teamId: currentTeam.id,
        salary
      });
      
      if (response.ok) {
        const signedPlayer = await response.json();
        addPlayerToTeam(signedPlayer);
        setAvailablePlayers(prev => prev.filter(p => p.id !== player.id));
      } else {
        console.error("Failed to sign player");
      }
    } catch (error) {
      console.error("Failed to sign player:", error);
    } finally {
      setLoading(false);
      setSelectedPlayerId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {availablePlayers.map((player) => (
        <Card 
          key={player.id} 
          className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
          onClick={() => onPlayerSelect?.(player)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className={`${getRoleColor(player.role)}`}>
                {getRoleIcon(player.role)}
                <span className="ml-1">{player.role.toUpperCase()}</span>
              </Badge>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{getOverallRating(player)}</div>
                <div className="text-xs text-slate-400">Rating</div>
              </div>
            </div>
            
            <h4 className="font-semibold text-white text-lg mb-1">{player.name}</h4>
            <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
              <span className="flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                {player.nationality}
              </span>
              <span>Age {player.age}</span>
            </div>
            
            <div className="text-green-400 font-semibold mb-3">
              <DollarSign className="h-4 w-4 inline mr-1" />
              ${parseInt(player.marketValue).toLocaleString()}
            </div>
            
            {/* Player stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
              <div className="text-center">
                <div className="text-slate-400">AIM</div>
                <div className="text-white font-mono">{player.aim}</div>
                <Progress value={player.aim} className="h-1 mt-1" />
              </div>
              <div className="text-center">
                <div className="text-slate-400">IQ</div>
                <div className="text-white font-mono">{player.gameIq}</div>
                <Progress value={player.gameIq} className="h-1 mt-1" />
              </div>
              <div className="text-center">
                <div className="text-slate-400">CLUTCH</div>
                <div className="text-white font-mono">{player.clutch}</div>
                <Progress value={player.clutch} className="h-1 mt-1" />
              </div>
            </div>
            
            {showSignButton && (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  signPlayer(player);
                }}
                disabled={loading || !canAffordPlayer(player) || !hasRosterSpace() || selectedPlayerId === player.id}
                className="w-full bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {selectedPlayerId === player.id ? (
                  "Signing..."
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Player
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default AvailableMap;
