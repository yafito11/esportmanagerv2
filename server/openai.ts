import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface AIAnalysisRequest {
  type: 'strategic_advice' | 'player_analysis' | 'draft_advice' | 'team_composition' | 'match_prediction' | 'general_chat';
  context: {
    userMessage: string;
    teamData?: any;
    playerData?: any;
    matchData?: any;
    currentLineup?: any;
    opponents?: any;
    mapName?: string;
    gameState?: any;
  };
}

export interface AIAnalysisResponse {
  response: string;
  confidence: number;
  actionable_items?: string[];
}

export async function generateAIResponse(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const systemPrompt = getSystemPrompt(request.type);
    const userPrompt = buildUserPrompt(request);
    
    const fullPrompt = `${systemPrompt}\n\nUser Request: ${userPrompt}\n\nPlease respond in JSON format with the following structure:
{
  "response": "Your detailed analysis and advice",
  "confidence": 0.8,
  "actionable_items": ["specific action 1", "specific action 2"]
}`;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();
    
    // Try to parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      // If not valid JSON, wrap in proper format
      parsedResponse = {
        response: responseText,
        confidence: 0.8,
        actionable_items: []
      };
    }
    
    return {
      response: parsedResponse.response || "Saya mengalami kesulitan menganalisis pertanyaan Anda. Bisakah Anda mengulang dengan lebih spesifik?",
      confidence: Math.max(0.1, Math.min(1.0, parsedResponse.confidence || 0.8)),
      actionable_items: parsedResponse.actionable_items || []
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

function getSystemPrompt(type: string): string {
  const basePrompt = `You are an expert esports analyst and coach specializing in tactical FPS games (similar to Valorant). You provide strategic advice, player analysis, and team management insights. Always respond in JSON format with the following structure:

{
  "response": "Your detailed analysis and advice",
  "confidence": 0.8,
  "actionable_items": ["specific action 1", "specific action 2"]
}

Keep responses practical, actionable, and focused on competitive improvement. Use esports terminology naturally but explain complex concepts clearly.`;

  const typeSpecificPrompts = {
    strategic_advice: `${basePrompt} Focus on tactical strategies, map control, economic management, and team coordination. Provide specific tactical recommendations.`,
    
    player_analysis: `${basePrompt} Analyze individual player performance, strengths, weaknesses, and development areas. Consider role-specific skills and team synergy.`,
    
    draft_advice: `${basePrompt} Provide agent selection advice based on map characteristics, team composition, and opponent tendencies. Consider role balance and utility synergy.`,
    
    team_composition: `${basePrompt} Analyze team composition effectiveness, role distribution, and player chemistry. Suggest lineup optimizations and substitutions.`,
    
    match_prediction: `${basePrompt} Analyze match scenarios, predict outcomes, and identify key factors that could influence results. Consider team form and historical performance.`,
    
    general_chat: `${basePrompt} Respond to general questions about esports, team management, training, and competitive gaming. Provide educational and motivational insights.`
  };

  return typeSpecificPrompts[type as keyof typeof typeSpecificPrompts] || typeSpecificPrompts.general_chat;
}

function buildUserPrompt(request: AIAnalysisRequest): string {
  let prompt = `User Question: "${request.context.userMessage}"\n\n`;
  
  // Add relevant context based on available data
  if (request.context.teamData) {
    prompt += `Team Information:\n`;
    prompt += `- Team Name: ${request.context.teamData.name || 'Unknown'}\n`;
    prompt += `- Budget: $${request.context.teamData.budget || 0}\n`;
    prompt += `- Team Rating: ${request.context.teamData.rating || 'N/A'}\n\n`;
  }

  if (request.context.currentLineup && request.context.currentLineup.starters) {
    prompt += `Current Lineup:\n`;
    request.context.currentLineup.starters.forEach((player: any, index: number) => {
      prompt += `- Player ${index + 1}: ${player.name} (Role: ${player.role}, Rating: ${player.overallRating || 'N/A'})\n`;
    });
    prompt += `\n`;
  }

  if (request.context.playerData && Array.isArray(request.context.playerData)) {
    prompt += `Available Players (${request.context.playerData.length} total):\n`;
    request.context.playerData.slice(0, 5).forEach((player: any) => {
      prompt += `- ${player.name}: ${player.role} (Rating: ${player.overallRating || 'N/A'})\n`;
    });
    if (request.context.playerData.length > 5) {
      prompt += `... and ${request.context.playerData.length - 5} more players\n`;
    }
    prompt += `\n`;
  }

  if (request.context.matchData) {
    prompt += `Match Context:\n`;
    prompt += `- Map: ${request.context.matchData.map || request.context.mapName || 'Unknown'}\n`;
    prompt += `- Score: ${request.context.matchData.homeScore || 0} - ${request.context.matchData.awayScore || 0}\n`;
    prompt += `- Round: ${request.context.matchData.currentRound || 'N/A'}\n\n`;
  }

  if (request.context.opponents) {
    prompt += `Opponent Information:\n`;
    prompt += `- Team: ${request.context.opponents.name || 'Unknown'}\n`;
    prompt += `- Rating: ${request.context.opponents.rating || 'N/A'}\n\n`;
  }

  prompt += `Please provide detailed analysis and actionable advice based on this context.`;
  
  return prompt;
}

export async function generatePlayerAnalysis(playerData: any): Promise<AIAnalysisResponse> {
  return generateAIResponse({
    type: 'player_analysis',
    context: {
      userMessage: `Analyze this player's performance and potential`,
      playerData: [playerData]
    }
  });
}

export async function generateStrategicAdvice(gameContext: any): Promise<AIAnalysisResponse> {
  return generateAIResponse({
    type: 'strategic_advice',
    context: {
      userMessage: `Provide strategic advice for the current situation`,
      matchData: gameContext.match,
      teamData: gameContext.team,
      currentLineup: gameContext.lineup
    }
  });
}

export async function generateDraftAdvice(draftContext: any): Promise<AIAnalysisResponse> {
  return generateAIResponse({
    type: 'draft_advice',
    context: {
      userMessage: `Help me with agent selection for this draft`,
      mapName: draftContext.map,
      teamData: draftContext.team,
      opponents: draftContext.opponents
    }
  });
}