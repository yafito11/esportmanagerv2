import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { 
  Upload, Check, ArrowLeft, Users, Shield, 
  Trophy, Target, Crown, Zap, Gamepad2
} from "lucide-react";
import { useGameState } from "../lib/stores/useGameState";
import { useTeamState } from "../lib/stores/useTeamState";
import { apiRequest } from "../lib/queryClient";

interface TeamCreationProps {
  onTeamCreated: () => void;
  onBack: () => void;
}

function TeamCreation({ onTeamCreated, onBack }: TeamCreationProps) {
  const { user } = useGameState();
  const { setCurrentTeam } = useTeamState();
  
  const [teamName, setTeamName] = useState("");
  const [teamAbbreviation, setTeamAbbreviation] = useState("");
  const [selectedLogo, setSelectedLogo] = useState("");
  const [customLogo, setCustomLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Predefined logos
  const predefinedLogos = [
    { id: "dragon", name: "Dragon", emoji: "🐉", color: "from-red-600 to-orange-600" },
    { id: "phoenix", name: "Phoenix", emoji: "🔥", color: "from-orange-600 to-yellow-600" },
    { id: "wolf", name: "Wolf", emoji: "🐺", color: "from-gray-600 to-slate-600" },
    { id: "eagle", name: "Eagle", emoji: "🦅", color: "from-blue-600 to-cyan-600" },
    { id: "lion", name: "Lion", emoji: "🦁", color: "from-yellow-600 to-orange-600" },
    { id: "shark", name: "Shark", emoji: "🦈", color: "from-blue-600 to-indigo-600" },
    { id: "tiger", name: "Tiger", emoji: "🐅", color: "from-orange-600 to-red-600" },
    { id: "lightning", name: "Lightning", emoji: "⚡", color: "from-purple-600 to-pink-600" },
    { id: "sword", name: "Sword", emoji: "⚔️", color: "from-slate-600 to-gray-600" },
    { id: "crown", name: "Crown", emoji: "👑", color: "from-yellow-600 to-amber-600" },
    { id: "diamond", name: "Diamond", emoji: "💎", color: "from-cyan-600 to-blue-600" },
    { id: "skull", name: "Skull", emoji: "💀", color: "from-gray-600 to-black" }
  ];

  const handleAbbreviationChange = (value: string) => {
    // Only allow 3 characters, uppercase
    const formatted = value.toUpperCase().slice(0, 3);
    setTeamAbbreviation(formatted);
  };

  const handleCustomLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('png')) {
        setError("Please upload a PNG file only");
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB");
        return;
      }
      
      setCustomLogo(file);
      setSelectedLogo("custom");
      setError("");
    }
  };

  const createTeam = async () => {
    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }
    
    if (!teamAbbreviation.trim() || teamAbbreviation.length !== 3) {
      setError("Team abbreviation must be exactly 3 characters");
      return;
    }
    
    if (!selectedLogo) {
      setError("Please select a logo");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let logoData = "";
      
      if (selectedLogo === "custom" && customLogo) {
        // Convert file to base64 for storage
        const reader = new FileReader();
        logoData = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(customLogo);
        });
      } else {
        // Use predefined logo
        const logo = predefinedLogos.find(l => l.id === selectedLogo);
        logoData = logo?.emoji || "🏆";
      }

      const teamData = {
        name: teamName.trim(),
        abbreviation: teamAbbreviation.trim(),
        userId: user?.id,
        budget: "1000000",
        region: "International",
        logo: logoData,
        founded: new Date().toISOString(),
        description: `${teamName} - Ready for competitive esports`
      };

      const response = await apiRequest("POST", "/api/teams", teamData);
      const newTeam = await response.json();
      
      setCurrentTeam(newTeam);
      onTeamCreated();
    } catch (err) {
      setError("Failed to create team. Please try again.");
      console.error("Team creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = teamName.trim() && teamAbbreviation.length === 3 && selectedLogo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Create Your Team
                </h1>
                <p className="text-slate-400 text-sm md:text-base">Build your esports dynasty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-h-[calc(100vh-80px)] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Team Creation Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-white flex items-center">
                  <Users className="h-5 w-5 md:h-6 md:w-6 mr-2 text-purple-400" />
                  Team Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {error && (
                  <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Team Name */}
                <div className="space-y-2">
                  <Label htmlFor="teamName" className="text-white">
                    Team Name
                  </Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    className="bg-slate-900 border-slate-600 text-white"
                    maxLength={50}
                  />
                  <p className="text-xs text-slate-400">
                    {teamName.length}/50 characters
                  </p>
                </div>

                {/* Team Abbreviation */}
                <div className="space-y-2">
                  <Label htmlFor="teamAbbr" className="text-white">
                    Team Abbreviation (3 Letters)
                  </Label>
                  <Input
                    id="teamAbbr"
                    value={teamAbbreviation}
                    onChange={(e) => handleAbbreviationChange(e.target.value)}
                    placeholder="ABC"
                    className="bg-slate-900 border-slate-600 text-white uppercase"
                    maxLength={3}
                  />
                  <p className="text-xs text-slate-400">
                    This will be used in tournaments and rankings
                  </p>
                </div>

                {/* Logo Selection */}
                <div className="space-y-4">
                  <Label className="text-white">Team Logo</Label>
                  
                  {/* Predefined Logos */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Choose from collection:</h4>
                    <div className="max-h-48 overflow-y-auto pr-2">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {predefinedLogos.map((logo) => (
                          <div
                            key={logo.id}
                            className={`relative cursor-pointer rounded-lg p-2 md:p-3 border-2 transition-all ${
                              selectedLogo === logo.id
                                ? "border-purple-500 bg-purple-900/20"
                                : "border-slate-600 hover:border-slate-500 bg-slate-900/50"
                            }`}
                            onClick={() => {
                              setSelectedLogo(logo.id);
                              setCustomLogo(null);
                            }}
                          >
                            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r ${logo.color} flex items-center justify-center mx-auto mb-1`}>
                              <span className="text-sm md:text-lg">{logo.emoji}</span>
                            </div>
                            <p className="text-[10px] md:text-xs text-slate-400 text-center truncate">{logo.name}</p>
                            {selectedLogo === logo.id && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                <Check className="h-2 w-2 md:h-3 md:w-3 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Custom Logo Upload */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Or upload custom logo:</h4>
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".png"
                        onChange={handleCustomLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center space-y-2">
                          <Upload className="h-8 w-8 text-slate-400" />
                          <p className="text-sm text-slate-300">
                            {customLogo ? customLogo.name : "Click to upload PNG"}
                          </p>
                          <p className="text-xs text-slate-500">
                            Maximum 2MB, PNG format only
                          </p>
                          <p className="text-xs text-slate-500">
                            Recommended: 256x256 pixels
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={createTeam}
                    disabled={!isFormValid || loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Team...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4" />
                        <span>Create Team</span>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Info */}
          <div className="space-y-6">
            {/* Team Preview */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Preview</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {selectedLogo && (
                  <div className="flex flex-col items-center space-y-3">
                    {selectedLogo === "custom" && customLogo ? (
                      <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(customLogo)}
                          alt="Custom logo"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${
                        predefinedLogos.find(l => l.id === selectedLogo)?.color || "from-gray-600 to-slate-600"
                      } flex items-center justify-center`}>
                        <span className="text-2xl">
                          {predefinedLogos.find(l => l.id === selectedLogo)?.emoji || "🏆"}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {teamName || "Your Team Name"}
                      </h3>
                      <Badge variant="outline" className="text-slate-400 border-slate-600 mt-1">
                        {teamAbbreviation || "ABC"}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Starter Package Info */}
            <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                  Starter Package
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                    <span className="text-green-400">$</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">$1,000,000 Budget</p>
                    <p className="text-slate-400 text-xs">Starting funds for transfers</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Player Market Access</p>
                    <p className="text-slate-400 text-xs">Scout and sign players</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">AI Coach Assistant</p>
                    <p className="text-slate-400 text-xs">Strategic advice and analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamCreation;