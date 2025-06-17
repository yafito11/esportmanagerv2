import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { 
  MessageCircle, Send, Bot, User, Lightbulb, 
  BarChart3, Target, Users, TrendingUp
} from "lucide-react";
import { useTeamState } from "../../lib/stores/useTeamState";
import { useTournamentState } from "../../lib/stores/useTournamentState";

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  author?: string;
}

function AIChat() {
  const { currentTeam, teamPlayers, lineup } = useTeamState();
  const { currentMatch, agents } = useTournamentState();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<'general' | 'draft' | 'timeout'>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'ai',
      content: `Halo! Saya AI Analyst Anda. Saya di sini untuk membantu Anda dengan saran strategis, analisis pemain, dan wawasan pertandingan. Bagaimana saya bisa membantu Anda hari ini?`,
      timestamp: new Date(),
      author: 'AI Analyst'
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Prepare context for AI
      const context = {
        teamData: currentTeam,
        currentLineup: lineup,
        playerData: teamPlayers,
        gameState: {
          agents: agents
        }
      };

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: context,
          language: 'indonesian'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.fallback) {
          return errorData.fallback;
        }
        throw new Error('AI service error');
      }

      const aiResponse = await response.json();
      
      // Format response with actionable items if available
      let formattedResponse = aiResponse.response;
      
      if (aiResponse.actionable_items && aiResponse.actionable_items.length > 0) {
        formattedResponse += '\n\n**Key Actions:**\n';
        aiResponse.actionable_items.forEach((item: string, index: number) => {
          formattedResponse += `• ${item}\n`;
        });
      }

      return formattedResponse;
    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // Fallback to context-aware responses if AI fails
      const messageLower = userMessage.toLowerCase();
      
      if (messageLower.includes('lineup') || messageLower.includes('roster')) {
        if (lineup.starters.length < 5) {
          return "Saya melihat lineup awal Anda belum lengkap. Anda membutuhkan 5 pemain starter untuk performa tim yang optimal. Pertimbangkan untuk mempromosikan pemain dari bangku cadangan atau mencari bakat baru.";
        }
        return `Lineup saat ini terlihat solid! ${lineup.starters.map(p => p.name).join(', ')} membentuk starting five yang bagus.`;
      }

      if (messageLower.includes('strategy') || messageLower.includes('tactics')) {
        return "Berdasarkan komposisi tim Anda, saya merekomendasikan fokus pada kontrol map, entry fragging, pengumpulan informasi, dan anchoring site berdasarkan peran pemain Anda.";
      }

      return "Saya mengalami kesulitan mengakses kemampuan analisis penuh saat ini. Bisakah Anda mencoba merumuskan ulang pertanyaan atau bertanya tentang hal spesifik seperti lineup, strategi, atau fokus latihan?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      author: 'You'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        author: 'AI Analyst'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to generate AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: "Maaf, saya mengalami kesulitan memproses permintaan Anda saat ini. Silakan coba lagi.",
        timestamp: new Date(),
        author: 'System'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const quickActions = [
    { label: "Analisis Lineup", query: "Bisakah Anda menganalisis lineup saat ini dan memberikan saran perbaikan?" },
    { label: "Strategi Draft", query: "Agent apa yang harus saya prioritaskan di fase draft berikutnya?" },
    { label: "Fokus Latihan", query: "Apa yang harus difokuskan tim saya dalam latihan minggu ini?" },
    { label: "Moral Tim", query: "Bagaimana cara meningkatkan moral dan chemistry tim saya?" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Analyst Chat</h2>
          <p className="text-slate-400 mt-1">Get strategic advice and insights from your AI coach</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Bot className="h-3 w-3 mr-1" />
            Online
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {chatMode.charAt(0).toUpperCase() + chatMode.slice(1)} Mode
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="col-span-3">
          <Card className="bg-slate-800/50 border-slate-700 h-[400px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-400" />
                AI Analyst Chat
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-purple-600 text-white'
                            : message.type === 'ai'
                            ? 'bg-slate-700 text-white'
                            : 'bg-slate-600 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {message.type === 'user' ? (
                            <User className="h-3 w-3" />
                          ) : message.type === 'ai' ? (
                            <Bot className="h-3 w-3" />
                          ) : null}
                          <span className="text-xs font-medium">{message.author}</span>
                          <span className="text-xs opacity-60">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm">{formatMessage(message.content)}</div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 text-white rounded-lg px-4 py-2 max-w-[80%]">
                        <div className="flex items-center space-x-2 mb-1">
                          <Bot className="h-3 w-3" />
                          <span className="text-xs font-medium">AI Analyst</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input */}
              <div className="border-t border-slate-700 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your AI analyst anything..."
                    className="flex-1 bg-slate-900 border-slate-600"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
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
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-start"
                  onClick={() => setInputValue(action.query)}
                >
                  <Lightbulb className="h-3 w-3 mr-2" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Team Rating</span>
                </div>
                <div className="text-lg font-bold text-white">85.2</div>
                <div className="text-xs text-green-400">↑ +2.1 this week</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-slate-300">Win Rate</span>
                </div>
                <div className="text-lg font-bold text-white">78%</div>
                <div className="text-xs text-green-400">↑ +5% last 10 games</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-300">Team Synergy</span>
                </div>
                <div className="text-lg font-bold text-white">Good</div>
                <div className="text-xs text-yellow-400">Room for improvement</div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Recommendations */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Recent Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-slate-400 space-y-1">
                <p>• Focus on aim training for Player A</p>
                <p>• Consider Phoenix for Attack side</p>
                <p>• Work on post-plant positioning</p>
                <p>• Improve communication timing</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AIChat;
