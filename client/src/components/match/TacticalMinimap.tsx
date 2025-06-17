import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  MapPin, Target, Shield, Users, Eye, 
  AlertTriangle, CheckCircle, Clock
} from "lucide-react";
import { useTournamentState } from "../../lib/stores/useTournamentState";

interface PlayerPosition {
  id: string;
  team: 'home' | 'away';
  role: string;
  x: number;
  y: number;
  alive: boolean;
  hasWeapon: boolean;
}

interface MapEvent {
  id: string;
  type: 'kill' | 'bomb_plant' | 'bomb_defuse' | 'smoke' | 'flash' | 'util';
  x: number;
  y: number;
  timestamp: number;
  team?: 'home' | 'away';
}

function TacticalMinimap() {
  const { currentMatch, currentRound, homeTeamScore, awayTeamScore, matchPhase } = useTournamentState();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]);
  const [mapEvents, setMapEvents] = useState<MapEvent[]>([]);
  const [bombSite, setBombSite] = useState<{ planted: boolean; site: 'A' | 'B' | null; timer: number }>({
    planted: false,
    site: null,
    timer: 0
  });

  // Pre-calculate initial positions to avoid Math.random in render
  const initialPositions = useMemo(() => {
    const positions: PlayerPosition[] = [];
    
    // Home team positions (left side spawn)
    for (let i = 0; i < 5; i++) {
      positions.push({
        id: `home-${i}`,
        team: 'home',
        role: ['duelist', 'controller', 'initiator', 'sentinel', 'flex'][i],
        x: 50 + (i * 15),
        y: 400 + (i * 20),
        alive: true,
        hasWeapon: true
      });
    }
    
    // Away team positions (right side spawn)
    for (let i = 0; i < 5; i++) {
      positions.push({
        id: `away-${i}`,
        team: 'away',
        role: ['duelist', 'controller', 'initiator', 'sentinel', 'flex'][i],
        x: 750 - (i * 15),
        y: 100 + (i * 20),
        alive: true,
        hasWeapon: true
      });
    }
    
    return positions;
  }, [currentRound]);

  useEffect(() => {
    setPlayerPositions(initialPositions);
  }, [initialPositions]);

  useEffect(() => {
    // Simulate player movement and events during the round - freeze during timeout
    const interval = setInterval(() => {
      if (matchPhase !== 'timeout') {
        updatePlayerPositions();
        generateRandomEvents();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [matchPhase]);

  useEffect(() => {
    drawMinimap();
  }, [playerPositions, mapEvents, bombSite]);

  const updatePlayerPositions = () => {
    setPlayerPositions(prev => prev.map(player => {
      if (!player.alive) return player;
      
      // Simulate tactical movement based on role
      let newX = player.x;
      let newY = player.y;
      
      if (player.role === 'duelist') {
        // Duelists move more aggressively forward
        if (player.team === 'home') {
          newX = Math.min(700, player.x + 10);
        } else {
          newX = Math.max(100, player.x - 10);
        }
      } else if (player.role === 'controller') {
        // Controllers take map control positions
        newY = Math.max(50, Math.min(450, player.y + (Math.random() - 0.5) * 20));
      } else if (player.role === 'sentinel') {
        // Sentinels hold back and anchor sites
        if (player.team === 'home') {
          newX = Math.max(50, player.x - 5);
        } else {
          newX = Math.min(750, player.x + 5);
        }
      }
      
      // Add some random movement within bounds
      newX = Math.max(20, Math.min(780, newX + (Math.random() - 0.5) * 15));
      newY = Math.max(20, Math.min(480, newY + (Math.random() - 0.5) * 15));
      
      return { ...player, x: newX, y: newY };
    }));
  };

  const generateRandomEvents = () => {
    const eventTypes: MapEvent['type'][] = ['smoke', 'flash', 'util'];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const newEvent: MapEvent = {
      id: `event-${Date.now()}`,
      type: randomType,
      x: 100 + Math.random() * 600,
      y: 100 + Math.random() * 300,
      timestamp: Date.now(),
      team: Math.random() > 0.5 ? 'home' : 'away'
    };
    
    setMapEvents(prev => [...prev.slice(-10), newEvent]);
    
    // Simulate kills occasionally
    if (Math.random() < 0.1) {
      setPlayerPositions(prev => {
        const alivePlayers = prev.filter(p => p.alive);
        if (alivePlayers.length > 6) {
          const randomPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
          return prev.map(p => 
            p.id === randomPlayer.id ? { ...p, alive: false } : p
          );
        }
        return prev;
      });
    }
  };

  const drawMinimap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 800, 500);
    
    // Draw map layout
    drawMapLayout(ctx);
    
    // Draw bomb sites
    drawBombSites(ctx);
    
    // Draw events
    mapEvents.forEach(event => drawEvent(ctx, event));
    
    // Draw players
    playerPositions.forEach(player => drawPlayer(ctx, player));
    
    // Draw bomb if planted
    if (bombSite.planted && bombSite.site) {
      drawBomb(ctx);
    }
  };

  const drawMapLayout = (ctx: CanvasRenderingContext2D) => {
    // Draw basic map structure
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    
    // Mid area
    ctx.strokeRect(300, 150, 200, 200);
    
    // Site A
    ctx.strokeRect(100, 50, 150, 100);
    ctx.fillStyle = '#3b82f6';
    ctx.font = '14px sans-serif';
    ctx.fillText('Site A', 160, 105);
    
    // Site B
    ctx.strokeRect(550, 350, 150, 100);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Site B', 610, 405);
    
    // Spawn areas
    ctx.strokeStyle = '#22d3ee';
    ctx.strokeRect(50, 350, 100, 100);
    ctx.fillStyle = '#22d3ee';
    ctx.fillText('T Spawn', 75, 405);
    
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(650, 50, 100, 100);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('CT Spawn', 670, 105);
    
    // Corridors and pathways
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 400);
    ctx.lineTo(300, 250);
    ctx.moveTo(550, 400);
    ctx.lineTo(500, 250);
    ctx.moveTo(250, 100);
    ctx.lineTo(400, 150);
    ctx.moveTo(650, 100);
    ctx.lineTo(500, 200);
    ctx.stroke();
  };

  const drawBombSites = (ctx: CanvasRenderingContext2D) => {
    // Site A
    ctx.fillStyle = bombSite.planted && bombSite.site === 'A' ? '#ef4444' : '#3b82f620';
    ctx.fillRect(100, 50, 150, 100);
    
    // Site B
    ctx.fillStyle = bombSite.planted && bombSite.site === 'B' ? '#ef4444' : '#ef444420';
    ctx.fillRect(550, 350, 150, 100);
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, player: PlayerPosition) => {
    const radius = 8;
    const x = player.x;
    const y = player.y;
    
    // Player circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    
    if (!player.alive) {
      ctx.fillStyle = '#6b7280';
      ctx.strokeStyle = '#374151';
    } else if (player.team === 'home') {
      ctx.fillStyle = '#3b82f6';
      ctx.strokeStyle = '#1d4ed8';
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#dc2626';
    }
    
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Role indicator
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    const roleSymbol = getRoleSymbol(player.role);
    ctx.fillText(roleSymbol, x, y + 3);
    
    // Weapon indicator
    if (player.hasWeapon && player.alive) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(x + 6, y - 6, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawEvent = (ctx: CanvasRenderingContext2D, event: MapEvent) => {
    const opacity = Math.max(0, 1 - (Date.now() - event.timestamp) / 5000);
    
    ctx.globalAlpha = opacity;
    
    switch (event.type) {
      case 'smoke':
        ctx.fillStyle = '#9ca3af';
        ctx.beginPath();
        ctx.arc(event.x, event.y, 15, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'flash':
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.arc(event.x, event.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'util':
        ctx.strokeStyle = event.team === 'home' ? '#3b82f6' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(event.x - 5, event.y - 5, 10, 10);
        break;
    }
    
    ctx.globalAlpha = 1;
  };

  const drawBomb = (ctx: CanvasRenderingContext2D) => {
    const siteCoords = bombSite.site === 'A' ? { x: 175, y: 100 } : { x: 625, y: 400 };
    
    // Blinking red circle for bomb
    const intensity = Math.sin(Date.now() / 200) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(239, 68, 68, ${intensity})`;
    ctx.beginPath();
    ctx.arc(siteCoords.x, siteCoords.y, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💣', siteCoords.x, siteCoords.y + 4);
  };

  const getRoleSymbol = (role: string): string => {
    switch (role) {
      case 'duelist': return 'D';
      case 'controller': return 'C';
      case 'initiator': return 'I';
      case 'sentinel': return 'S';
      case 'flex': return 'F';
      default: return '?';
    }
  };

  const getAliveCount = (team: 'home' | 'away') => {
    return playerPositions.filter(p => p.team === team && p.alive).length;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <MapPin className="h-5 w-5 mr-2 text-green-400" />
            Tactical Overview
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-600">
                Home: {getAliveCount('home')}
              </Badge>
              <Badge className="bg-red-600">
                Away: {getAliveCount('away')}
              </Badge>
            </div>
            {bombSite.planted && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Bomb Planted - {bombSite.site}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full h-auto bg-slate-900 rounded-lg border border-slate-600"
          />
          
          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-2">Player Roles</h4>
              <div className="space-y-1 text-slate-300">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">D</div>
                  <span>Duelist</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">C</div>
                  <span>Controller</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">I</div>
                  <span>Initiator</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">S</div>
                  <span>Sentinel</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Map Elements</h4>
              <div className="space-y-1 text-slate-300">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-400/20 border border-blue-400 rounded"></div>
                  <span>Site A</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-400/20 border border-red-400 rounded"></div>
                  <span>Site B</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  <span>Utility/Smoke</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>Weapon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TacticalMinimap;
