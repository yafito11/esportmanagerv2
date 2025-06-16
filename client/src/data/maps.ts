export interface MapCallout {
  name: string;
  x: number;
  y: number;
  type: 'site' | 'spawn' | 'mid' | 'connector' | 'choke';
}

export interface MapLayout {
  id: number;
  name: string;
  displayName: string;
  theme: string;
  description: string;
  callouts: MapCallout[];
  bombSites: { name: string; x: number; y: number }[];
  spawns: { team: 'attack' | 'defense'; x: number; y: number }[];
  lanes: { from: { x: number; y: number }; to: { x: number; y: number } }[];
  chokePoints: { x: number; y: number; radius: number }[];
  sightLines: { from: { x: number; y: number }; to: { x: number; y: number } }[];
  tacticalNotes: string[];
}

export const MAPS: MapLayout[] = [
  {
    id: 1,
    name: "ascent",
    displayName: "Ascent",
    theme: "Italian coastal town",
    description: "A two-site map with an open middle area and vertical gameplay elements",
    callouts: [
      { name: "A Site", x: 175, y: 100, type: "site" },
      { name: "B Site", x: 625, y: 400, type: "site" },
      { name: "Mid", x: 400, y: 250, type: "mid" },
      { name: "A Main", x: 100, y: 150, type: "connector" },
      { name: "B Main", x: 700, y: 350, type: "connector" },
      { name: "Catwalk", x: 300, y: 100, type: "connector" },
      { name: "Market", x: 500, y: 200, type: "mid" },
      { name: "Pizza", x: 350, y: 300, type: "mid" },
      { name: "Courtyard", x: 450, y: 300, type: "connector" }
    ],
    bombSites: [
      { name: "A", x: 175, y: 100 },
      { name: "B", x: 625, y: 400 }
    ],
    spawns: [
      { team: "attack", x: 75, y: 400 },
      { team: "defense", x: 725, y: 100 }
    ],
    lanes: [
      { from: { x: 75, y: 400 }, to: { x: 400, y: 250 } },
      { from: { x: 400, y: 250 }, to: { x: 175, y: 100 } },
      { from: { x: 400, y: 250 }, to: { x: 625, y: 400 } }
    ],
    chokePoints: [
      { x: 350, y: 200, radius: 30 },
      { x: 450, y: 300, radius: 25 },
      { x: 200, y: 150, radius: 20 }
    ],
    sightLines: [
      { from: { x: 300, y: 100 }, to: { x: 500, y: 200 } },
      { from: { x: 400, y: 250 }, to: { x: 625, y: 400 } }
    ],
    tacticalNotes: [
      "Control mid early for map control",
      "A site has multiple angles to clear",
      "B site can be smoked off easily",
      "Catwalk provides elevation advantage"
    ]
  },
  {
    id: 2,
    name: "bind",
    displayName: "Bind",
    theme: "Moroccan city",
    description: "Unique two-site map with teleporters and no middle area",
    callouts: [
      { name: "A Site", x: 150, y: 100, type: "site" },
      { name: "B Site", x: 650, y: 400, type: "site" },
      { name: "A Short", x: 200, y: 150, type: "connector" },
      { name: "A Long", x: 100, y: 200, type: "connector" },
      { name: "B Long", x: 700, y: 300, type: "connector" },
      { name: "B Short", x: 600, y: 350, type: "connector" },
      { name: "Hookah", x: 400, y: 200, type: "connector" },
      { name: "Baths", x: 300, y: 150, type: "connector" },
      { name: "Showers", x: 250, y: 100, type: "connector" }
    ],
    bombSites: [
      { name: "A", x: 150, y: 100 },
      { name: "B", x: 650, y: 400 }
    ],
    spawns: [
      { team: "attack", x: 50, y: 450 },
      { team: "defense", x: 750, y: 50 }
    ],
    lanes: [
      { from: { x: 50, y: 450 }, to: { x: 150, y: 100 } },
      { from: { x: 50, y: 450 }, to: { x: 650, y: 400 } },
      { from: { x: 400, y: 200 }, to: { x: 150, y: 100 } }
    ],
    chokePoints: [
      { x: 400, y: 200, radius: 25 },
      { x: 250, y: 100, radius: 20 },
      { x: 600, y: 350, radius: 25 }
    ],
    sightLines: [
      { from: { x: 100, y: 200 }, to: { x: 150, y: 100 } },
      { from: { x: 650, y: 400 }, to: { x: 700, y: 300 } }
    ],
    tacticalNotes: [
      "No traditional mid area - use teleporters",
      "A site has tight angles",
      "B site allows for long-range duels",
      "Hookah is key connector between sites"
    ]
  },
  {
    id: 3,
    name: "haven",
    displayName: "Haven",
    theme: "Bhutanese monastery",
    description: "Three-site map with unique strategic considerations",
    callouts: [
      { name: "A Site", x: 150, y: 80, type: "site" },
      { name: "B Site", x: 400, y: 200, type: "site" },
      { name: "C Site", x: 650, y: 350, type: "site" },
      { name: "A Long", x: 100, y: 120, type: "connector" },
      { name: "A Short", x: 200, y: 100, type: "connector" },
      { name: "Mid", x: 350, y: 250, type: "mid" },
      { name: "C Long", x: 700, y: 300, type: "connector" },
      { name: "Garage", x: 300, y: 280, type: "connector" },
      { name: "Heaven", x: 400, y: 150, type: "connector" }
    ],
    bombSites: [
      { name: "A", x: 150, y: 80 },
      { name: "B", x: 400, y: 200 },
      { name: "C", x: 650, y: 350 }
    ],
    spawns: [
      { team: "attack", x: 50, y: 400 },
      { team: "defense", x: 750, y: 50 }
    ],
    lanes: [
      { from: { x: 50, y: 400 }, to: { x: 150, y: 80 } },
      { from: { x: 350, y: 250 }, to: { x: 400, y: 200 } },
      { from: { x: 350, y: 250 }, to: { x: 650, y: 350 } }
    ],
    chokePoints: [
      { x: 300, y: 280, radius: 30 },
      { x: 200, y: 100, radius: 25 },
      { x: 700, y: 300, radius: 25 }
    ],
    sightLines: [
      { from: { x: 100, y: 120 }, to: { x: 150, y: 80 } },
      { from: { x: 400, y: 150 }, to: { x: 400, y: 200 } }
    ],
    tacticalNotes: [
      "Three sites require careful resource allocation",
      "Mid control is crucial for rotations",
      "Defenders must choose positioning carefully",
      "Attackers can split across multiple sites"
    ]
  },
  {
    id: 4,
    name: "split",
    displayName: "Split",
    theme: "Japanese urban environment",
    description: "Vertical map with elevated positions and rope climbs",
    callouts: [
      { name: "A Site", x: 150, y: 100, type: "site" },
      { name: "B Site", x: 650, y: 400, type: "site" },
      { name: "Mid", x: 400, y: 250, type: "mid" },
      { name: "A Ramp", x: 200, y: 150, type: "connector" },
      { name: "A Main", x: 100, y: 200, type: "connector" },
      { name: "B Main", x: 700, y: 350, type: "connector" },
      { name: "Heaven", x: 400, y: 150, type: "connector" },
      { name: "Sewers", x: 400, y: 350, type: "connector" },
      { name: "Vents", x: 350, y: 300, type: "connector" }
    ],
    bombSites: [
      { name: "A", x: 150, y: 100 },
      { name: "B", x: 650, y: 400 }
    ],
    spawns: [
      { team: "attack", x: 50, y: 450 },
      { team: "defense", x: 750, y: 50 }
    ],
    lanes: [
      { from: { x: 50, y: 450 }, to: { x: 400, y: 250 } },
      { from: { x: 400, y: 250 }, to: { x: 150, y: 100 } },
      { from: { x: 400, y: 250 }, to: { x: 650, y: 400 } }
    ],
    chokePoints: [
      { x: 400, y: 150, radius: 25 },
      { x: 350, y: 300, radius: 30 },
      { x: 200, y: 150, radius: 20 }
    ],
    sightLines: [
      { from: { x: 400, y: 150 }, to: { x: 150, y: 100 } },
      { from: { x: 400, y: 350 }, to: { x: 650, y: 400 } }
    ],
    tacticalNotes: [
      "Vertical gameplay with rope climbs",
      "Mid control allows access to both sites",
      "Sewers provide flanking opportunities",
      "Heaven position offers map control"
    ]
  },
  {
    id: 5,
    name: "icebox",
    displayName: "Icebox",
    theme: "Arctic research facility",
    description: "Vertical map with zip lines and multiple elevation levels",
    callouts: [
      { name: "A Site", x: 150, y: 120, type: "site" },
      { name: "B Site", x: 650, y: 380, type: "site" },
      { name: "Mid", x: 400, y: 250, type: "mid" },
      { name: "A Belt", x: 250, y: 100, type: "connector" },
      { name: "Screens", x: 200, y: 150, type: "connector" },
      { name: "Tube", x: 350, y: 200, type: "connector" },
      { name: "Kitchen", x: 450, y: 280, type: "connector" },
      { name: "Yellow", x: 500, y: 350, type: "connector" },
      { name: "Orange", x: 600, y: 300, type: "connector" }
    ],
    bombSites: [
      { name: "A", x: 150, y: 120 },
      { name: "B", x: 650, y: 380 }
    ],
    spawns: [
      { team: "attack", x: 50, y: 450 },
      { team: "defense", x: 750, y: 50 }
    ],
    lanes: [
      { from: { x: 50, y: 450 }, to: { x: 400, y: 250 } },
      { from: { x: 400, y: 250 }, to: { x: 150, y: 120 } },
      { from: { x: 400, y: 250 }, to: { x: 650, y: 380 } }
    ],
    chokePoints: [
      { x: 350, y: 200, radius: 25 },
      { x: 450, y: 280, radius: 30 },
      { x: 250, y: 100, radius: 20 }
    ],
    sightLines: [
      { from: { x: 250, y: 100 }, to: { x: 150, y: 120 } },
      { from: { x: 500, y: 350 }, to: { x: 650, y: 380 } }
    ],
    tacticalNotes: [
      "Zip lines provide quick rotations",
      "Multiple elevation levels",
      "Kitchen area controls mid access",
      "Nest position offers powerful angles"
    ]
  }
];

export const getMapByName = (name: string): MapLayout | undefined => {
  return MAPS.find(map => map.name.toLowerCase() === name.toLowerCase());
};

export const getMapById = (id: number): MapLayout | undefined => {
  return MAPS.find(map => map.id === id);
};

export const getRandomMap = (): MapLayout => {
  const randomIndex = Math.floor(Math.random() * MAPS.length);
  return MAPS[randomIndex];
};

export const getMapsByTheme = (theme: string): MapLayout[] => {
  return MAPS.filter(map => map.theme.toLowerCase().includes(theme.toLowerCase()));
};

export const getAllMapNames = (): string[] => {
  return MAPS.map(map => map.displayName);
};

export const getMapTacticalInfo = (mapName: string) => {
  const map = getMapByName(mapName);
  if (!map) return null;
  
  return {
    chokePoints: map.chokePoints.length,
    bombSites: map.bombSites.length,
    keyCallouts: map.callouts.filter(c => c.type === 'site' || c.type === 'mid').length,
    tacticalComplexity: map.tacticalNotes.length,
    recommendedComposition: getRecommendedComposition(map)
  };
};

const getRecommendedComposition = (map: MapLayout) => {
  // Basic composition recommendations based on map characteristics
  const baseLine = {
    duelist: 1,
    initiator: 1,
    controller: 1,
    sentinel: 1,
    flex: 1
  };
  
  // Adjust based on map characteristics
  if (map.bombSites.length === 3) {
    // Three-site maps like Haven need more controllers
    return { ...baseLine, controller: 2, flex: 0 };
  }
  
  if (map.chokePoints.length > 4) {
    // Maps with many chokes benefit from initiators
    return { ...baseLine, initiator: 2, flex: 0 };
  }
  
  return baseLine;
};
