import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { 
  MessageCircle, Send, User, Bot, Clock, 
  Play, Target, Users, Lightbulb, CheckCircle
} from "lucide-react";
import { useTeamState } from "../../lib/stores/useTeamState";
import { useTournamentState } from "../../lib/stores/useTournamentState";

interface ChatMessage {
  id: string;
  author: string;
  role: 'manager' | 'player' | 'analyst' | 'coach';
  content: string;
  timestamp: Date;
  type: 'message' | 'suggestion' | 'question';
}

interface TimeoutChatProps {
  onResume: () => void;
}

function TimeoutChat({ onResume }: TimeoutChatProps) {
  const { lineup, teamStaff } = useTeamState();
  const { agents, selectedAgents, currentMatch } = useTournamentState();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [timeoutTimer, setTimeoutTimer] = useState(30); // 30 second timeout
  const [activeSpeaker, setActiveSpeaker] = useState<string>('manager');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeTimeout();
    
    const timer = setInterval(() => {
      setTimeoutTimer(prev => {
        if (prev <= 1) {
          onResume();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Generate AI responses periodically
    const aiInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        generateAIMessage();
      }
    }, 3000);

    return () => clearInterval(aiInterval);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeTimeout = () => {
    const initialMessages: ChatMessage[] = [
      {
        id: 'timeout-start',
        author: 'System',
        role: 'manager',
        content: 'Tactical timeout called. 30 seconds to discuss strategy.',
        timestamp: new Date(),
        type: 'message'
      },
      {
        id: 'analyst-1',
        author: 'AI Analyst',
        role: 'analyst',
        content: 'We need to adjust our positioning. They\'re reading our rotations.',
        timestamp: new Date(),
        type: 'suggestion'
      }
    ];
    
    setMessages(initialMessages);
  };

  const generateAIMessage = async () => {
    const participants = [
      ...lineup.starters.map(p => ({ name: p.name, role: 'player' as const })),
      ...teamStaff.filter(s => s.role === 'analyst' || s.role === 'coach').map(s => ({ name: s.name, role: s.role as 'analyst' | 'coach' }))
    ];

    if (participants.length === 0) return;

    const speaker = participants[Math.floor(Math.random() * participants.length)];
    
    try {
      const context = {
        matchData: currentMatch,
        teamData: { lineup, staff: teamStaff },
        gameState: { agents: selectedAgents, availableAgents: agents },
        speakerRole: speaker.role
      };

      const timeoutMessage = `As a ${speaker.role} during a tactical timeout, provide a quick strategic insight or suggestion for the team.`;
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: timeoutMessage,
          context: context
        })
      });

      let messageContent: string;
      
      if (response.ok) {
        const aiResponse = await response.json();
        messageContent = aiResponse.response;
      } else {
        // Fallback to context-based message
        messageContent = generateContextualMessage(speaker.role);
      }

      const newMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        author: speaker.name,
        role: speaker.role,
        content: messageContent,
        timestamp: new Date(),
        type: Math.random() < 0.6 ? 'message' : 'suggestion'
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error generating AI timeout message:', error);
      // Use fallback message
      const messageContent = generateContextualMessage(speaker.role);
      const newMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        author: speaker.name,
        role: speaker.role,
        content: messageContent,
        timestamp: new Date(),
        type: 'message'
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const generateContextualMessage = (role: string): string => {
    const messages = {
      player: [
        "I can pick a different agent next round if needed",
        "Their duelist is playing too aggressive, we can punish that",
        "I'll watch the flank this round",
        "Should I save my utility for the retake?",
        "I think we should stack site A",
        "They're forcing every round, let's play for picks",
        "I can entry frag if you smoke for me",
        "We need better communication on rotations"
      ],
      analyst: [
        "Based on their economy, they'll likely force this round",
        "They're favoring long-range duels, let's close the distance",
        "Their controller is low on utility, now's our chance",
        "I recommend a fast push to site B",
        "They're predictable on anti-ecos",
        "Focus on map control in mid",
        "Their sentinel is out of position"
      ],
      coach: [
        "Stay calm, we're still in this",
        "Remember our practice on this map",
        "Trust your aim and positioning",
        "They're tilted, keep the pressure up",
        "Focus on fundamentals",
        "Good teamwork so far, keep it up",
        "Reset mentally for this round"
      ]
    };

    const roleMessages = messages[role as keyof typeof messages] || messages.player;
    return roleMessages[Math.floor(Math.random() * roleMessages.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: `manager-${Date.now()}`,
      author: 'You (Manager)',
      role: 'manager',
      content: inputValue,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Generate a response from team
    setTimeout(() => {
      const responses = [
        "Got it, coach!",
        "Roger that",
        "I can do that",
        "Good call",
        "Let's try it",
        "I agree with that strategy",
        "That makes sense",
        "I'm ready"
      ];
      
      const randomPlayer = lineup.starters[Math.floor(Math.random() * lineup.starters.length)];
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: ChatMessage = {
        id: `response-${Date.now()}`,
        author: randomPlayer?.name || 'Player',
        role: 'player',
        content: response,
        timestamp: new Date(),
        type: 'message'
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'manager': return <Users className="h-3 w-3" />;
      case 'player': return <User className="h-3 w-3" />;
      case 'analyst': return <Bot className="h-3 w-3" />;
      case 'coach': return <Target className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'text-purple-400';
      case 'player': return 'text-blue-400';
      case 'analyst': return 'text-green-400';
      case 'coach': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getMessageBgColor = (role: string, type: string) => {
    if (type === 'suggestion') {
      return 'bg-yellow-900/20 border-l-4 border-yellow-400';
    }
    
    switch (role) {
      case 'manager': return 'bg-purple-900/20';
      case 'player': return 'bg-blue-900/20';
      case 'analyst': return 'bg-green-900/20';
      case 'coach': return 'bg-yellow-900/20';
      default: return 'bg-slate-900/20';
    }
  };

  const quickActions = [
    { label: "Rotate to B", message: "Everyone rotate to site B, they're stacking A" },
    { label: "Save Utility", message: "Save your utility for the next round" },
    { label: "Play for picks", message: "Let's play for early picks this round" },
    { label: "Stack A", message: "Stack site A, I think they're going there" },
    { label: "Force buy", message: "Force buy this round, we need to reset their economy" },
    { label: "Save round", message: "This is a save round, don't force anything" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Team Timeout</h2>
          <p className="text-sm text-slate-400">Discuss strategy with your team</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{timeoutTimer}s</div>
          <div className="text-sm text-slate-400">Remaining</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="col-span-3">
          <Card className="bg-slate-800/50 border-slate-700 h-[500px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-400" />
                Team Chat
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${getMessageBgColor(message.role, message.type)}`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={getRoleColor(message.role)}>
                          {getRoleIcon(message.role)}
                        </div>
                        <span className="text-sm font-medium text-white">{message.author}</span>
                        <Badge variant="outline" className="text-xs">
                          {message.role.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-slate-400 ml-auto">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-slate-100">{message.content}</div>
                      {message.type === 'suggestion' && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            Suggestion
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="border-t border-slate-700 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your tactical instruction..."
                    className="flex-1 bg-slate-900 border-slate-600"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Quick Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-start"
                  onClick={() => setInputValue(action.message)}
                >
                  <Target className="h-3 w-3 mr-2" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Team Status */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Team Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Morale:</span>
                  <span className="text-green-400">High</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Communication:</span>
                  <span className="text-blue-400">Active</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Strategy:</span>
                  <span className="text-purple-400">Adaptive</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Round Info */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Round Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Side:</span>
                <span className="text-white">Attack</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Economy:</span>
                <span className="text-green-400">Strong</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Map:</span>
                <span className="text-white">{currentMatch?.map || 'TBD'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Resume Button */}
          <Button 
            onClick={onResume}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Resume Match
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TimeoutChat;
