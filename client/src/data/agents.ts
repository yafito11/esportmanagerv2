export interface AgentAbility {
  name: string;
  type: 'basic' | 'signature' | 'ultimate';
  description: string;
  cooldown?: number;
  cost?: number;
}

export interface Agent {
  id: number;
  name: string;
  role: 'duelist' | 'initiator' | 'controller' | 'sentinel';
  description: string;
  abilities: AgentAbility[];
  difficulty: number; // 1-5 scale
  isOriginal: boolean;
  lore?: string;
  nationality?: string;
  realName?: string;
}

export const AGENTS: Agent[] = [
  // DUELIST AGENTS
  {
    id: 1,
    name: "Phoenix",
    role: "duelist",
    description: "Aggressive entry fragger with fire-based abilities for healing and area denial",
    abilities: [
      { name: "Blaze", type: "signature", description: "Create a wall of fire that heals you and damages enemies", cooldown: 20 },
      { name: "Curveball", type: "basic", description: "Flash that curves around corners", cost: 200 },
      { name: "Hot Hands", type: "basic", description: "Fireball that creates a damaging area", cost: 200 },
      { name: "Run It Back", type: "ultimate", description: "Mark your location and resurrect there if killed", cost: 6 }
    ],
    difficulty: 2,
    isOriginal: false,
    nationality: "UK",
    realName: "Jamie Adeyemi"
  },
  {
    id: 2,
    name: "Jett",
    role: "duelist",
    description: "Highly mobile wind-based agent perfect for quick rotations and aggressive plays",
    abilities: [
      { name: "Updraft", type: "basic", description: "Launch yourself into the air", cost: 150 },
      { name: "Tailwind", type: "signature", description: "Dash forward quickly", cooldown: 12 },
      { name: "Cloudburst", type: "basic", description: "Throw a smoke cloud", cost: 100 },
      { name: "Blade Storm", type: "ultimate", description: "Equip throwing knives that refresh on kills", cost: 7 }
    ],
    difficulty: 3,
    isOriginal: false,
    nationality: "South Korea",
    realName: "Joon-hee"
  },
  {
    id: 3,
    name: "Reyna",
    role: "duelist",
    description: "Soul-harvesting vampire who gets stronger with each kill",
    abilities: [
      { name: "Devour", type: "basic", description: "Consume soul orb to heal", cost: 100 },
      { name: "Dismiss", type: "basic", description: "Consume soul orb to go intangible", cost: 100 },
      { name: "Leer", type: "signature", description: "Cast an ethereal eye that nearsights enemies", cooldown: 40 },
      { name: "Empress", type: "ultimate", description: "Enter frenzy mode with combat stim and invisibility", cost: 6 }
    ],
    difficulty: 4,
    isOriginal: false,
    nationality: "Mexico",
    realName: "Zyanya Mondragón"
  },
  {
    id: 4,
    name: "Raze",
    role: "duelist",
    description: "Explosive specialist who excels at clearing out cramped areas",
    abilities: [
      { name: "Blast Pack", type: "basic", description: "Explosive satchel for movement and damage", cost: 200 },
      { name: "Paint Shells", type: "signature", description: "Cluster grenade with sub-munitions", cooldown: 25 },
      { name: "Boom Bot", type: "basic", description: "Deployable robot that hunts enemies", cost: 400 },
      { name: "Showstopper", type: "ultimate", description: "Rocket launcher with massive AOE damage", cost: 8 }
    ],
    difficulty: 2,
    isOriginal: false,
    nationality: "Brazil",
    realName: "Tayane Alves"
  },
  {
    id: 5,
    name: "Yoru",
    role: "duelist",
    description: "Interdimensional infiltrator who manipulates reality",
    abilities: [
      { name: "Fakeout", type: "basic", description: "Send out a clone that explodes when shot", cost: 100 },
      { name: "Blindside", type: "basic", description: "Rip a hole in reality for an unstoppable flash", cost: 250 },
      { name: "Gatecrash", type: "signature", description: "Teleport to a tether's location", cooldown: 35 },
      { name: "Dimensional Drift", type: "ultimate", description: "Enter another dimension to move undetected", cost: 7 }
    ],
    difficulty: 5,
    isOriginal: false,
    nationality: "Japan",
    realName: "Ryo Kiritani"
  },
  {
    id: 6,
    name: "Neon",
    role: "duelist",
    description: "Electric speedster who can outrun any enemy",
    abilities: [
      { name: "Fast Lane", type: "basic", description: "Fire two energy lines that create walls", cost: 300 },
      { name: "Relay Bolt", type: "basic", description: "Throw energy bolt that bounces and stuns", cost: 200 },
      { name: "High Gear", type: "signature", description: "Charge up and gain speed and slide", cooldown: 60 },
      { name: "Overdrive", type: "ultimate", description: "Unleash electric beam that can kill with body shots", cost: 7 }
    ],
    difficulty: 3,
    isOriginal: false,
    nationality: "Philippines",
    realName: "Tala Nicole Dimaapi Valdez"
  },
  {
    id: 7,
    name: "Iso",
    role: "duelist",
    description: "Chinese assassin who manipulates energy to create shields and isolation",
    abilities: [
      { name: "Contingency", type: "basic", description: "Enter flow state to push through damage", cost: 250 },
      { name: "Undercut", type: "basic", description: "Apply vulnerability through walls", cost: 200 },
      { name: "Double Tap", type: "signature", description: "Focus timer grants shield on kill", cooldown: 25 },
      { name: "Kill Contract", type: "ultimate", description: "Pull enemy into arena for 1v1 duel", cost: 7 }
    ],
    difficulty: 4,
    isOriginal: false,
    nationality: "China",
    realName: "Li Zhao Yu"
  },

  // CONTROLLER AGENTS
  {
    id: 8,
    name: "Brimstone",
    role: "controller",
    description: "Veteran commander with orbital arsenal for area control",
    abilities: [
      { name: "Stim Beacon", type: "basic", description: "Deploy beacon that grants rapid fire", cost: 100 },
      { name: "Incendiary", type: "basic", description: "Launch incendiary grenade", cost: 200 },
      { name: "Sky Smoke", type: "signature", description: "Call down smoke clouds anywhere on map", cooldown: 19 },
      { name: "Orbital Strike", type: "ultimate", description: "Launch devastating laser from orbit", cost: 7 }
    ],
    difficulty: 2,
    isOriginal: false,
    nationality: "USA",
    realName: "Liam Byrnes"
  },
  {
    id: 9,
    name: "Viper",
    role: "controller",
    description: "Chemical warfare specialist who controls territory with toxic screens",
    abilities: [
      { name: "Snake Bite", type: "basic", description: "Fire chemical launcher creating acid pool", cost: 200 },
      { name: "Poison Cloud", type: "basic", description: "Deployable gas emitter", cost: 200 },
      { name: "Toxic Screen", type: "signature", description: "Deploy long line of gas emitters", cooldown: 45 },
      { name: "Viper's Pit", type: "ultimate", description: "Create massive toxic cloud", cost: 7 }
    ],
    difficulty: 4,
    isOriginal: false,
    nationality: "USA",
    realName: "Dr. Sabine Callas"
  },
  {
    id: 10,
    name: "Omen",
    role: "controller",
    description: "Phantom wraith who hunts in shadows and controls darkness",
    abilities: [
      { name: "Shrouded Step", type: "basic", description: "Teleport short distance", cost: 150 },
      { name: "Paranoia", type: "basic", description: "Send shadow projectile that nearsights", cost: 300 },
      { name: "Dark Cover", type: "signature", description: "Cast shadow orbs anywhere on map", cooldown: 30 },
      { name: "From the Shadows", type: "ultimate", description: "Teleport anywhere and reform", cost: 7 }
    ],
    difficulty: 3,
    isOriginal: false,
    nationality: "Unknown",
    realName: "Unknown"
  },
  {
    id: 11,
    name: "Astra",
    role: "controller",
    description: "Cosmic being who harnesses energies of the universe",
    abilities: [
      { name: "Nova Pulse", type: "basic", description: "Place star that can concuss enemies", cost: 200 },
      { name: "Nebula", type: "basic", description: "Place star that becomes smoke", cost: 150 },
      { name: "Gravity Well", type: "basic", description: "Place star that pulls enemies", cost: 200 },
      { name: "Astral Form", type: "signature", description: "Enter cosmic form to place stars", cooldown: 25 },
      { name: "Cosmic Divide", type: "ultimate", description: "Split map with cosmic barrier", cost: 7 }
    ],
    difficulty: 5,
    isOriginal: false,
    nationality: "Ghana",
    realName: "Efia Danso"
  },
  {
    id: 12,
    name: "Harbor",
    role: "controller",
    description: "Ancient technology wielder who controls water and shields",
    abilities: [
      { name: "Cascade", type: "basic", description: "Create water wave that goes through walls", cost: 250 },
      { name: "Cove", type: "basic", description: "Deploy water sphere that blocks bullets", cost: 400 },
      { name: "High Tide", type: "signature", description: "Send out water wall along ground", cooldown: 40 },
      { name: "Reckoning", type: "ultimate", description: "Control geyser strikes across map", cost: 8 }
    ],
    difficulty: 3,
    isOriginal: false,
    nationality: "India",
    realName: "Varun Batra"
  },
  {
    id: 13,
    name: "Clove",
    role: "controller",
    description: "Immortal being who can continue fighting beyond death",
    abilities: [
      { name: "Pick-me-up", type: "basic", description: "Heal allies or self over time", cost: 200 },
      { name: "Meddle", type: "basic", description: "Throw smoke that activates on landing", cost: 150 },
      { name: "Ruse", type: "signature", description: "View map and place smokes globally", cooldown: 30 },
      { name: "Not Dead Yet", type: "ultimate", description: "Revive temporarily after death", cost: 7 }
    ],
    difficulty: 4,
    isOriginal: false,
    nationality: "Scotland",
    realName: "Clove"
  },

  // INITIATOR AGENTS
  {
    id: 14,
    name: "Sova",
    role: "initiator",
    description: "Master tracker who hunts down enemies with precision",
    abilities: [
      { name: "Owl Drone", type: "basic", description: "Deploy reconnaissance drone", cost: 400 },
      { name: "Shock Bolt", type: "basic", description: "Fire electric arrow that damages area", cost: 150 },
      { name: "Recon Bolt", type: "signature", description: "Fire arrow that reveals enemies", cooldown: 40 },
      { name: "Hunter's Fury", type: "ultimate", description: "Fire energy blasts through walls", cost: 8 }
    ],
    difficulty: 3,
    isOriginal: false,
    nationality: "Russia",
    realName: "Aleksandr Novikov"
  },
  {
    id: 15,
    name: "Breach",
    role: "initiator",
    description: "Bionic arms allow him to fire powerful blasts through terrain",
    abilities: [
      { name: "Aftershock", type: "basic", description: "Charge fusion blast through walls", cost: 200 },
      { name: "Flashpoint", type: "basic", description: "Fast-charging blind through walls", cost: 250 },
      { name: "Fault Line", type: "signature", description: "Launch seismic blast in cone", cooldown: 35 },
      { name: "Rolling Thunder", type: "ultimate", description: "Send cascading quakes across map", cost: 8 }
    ],
    difficulty: 2,
    isOriginal: false,
    nationality: "Sweden",
    realName: "Erik Torsten"
  },
  {
    id: 16,
    name: "Skye",
    role: "initiator",
    description: "Australian healer who commands creatures and nature",
    abilities: [
      { name: "Regrowth", type: "basic", description: "Heal teammates with channeled ability", cost: 200 },
      { name: "Trailblazer", type: "basic", description: "Control Tasmanian tiger", cost: 300 },
      { name: "Guiding Light", type: "signature", description: "Send hawk that can flash", cooldown: 40 },
      { name: "Seekers", type: "ultimate", description: "Send three seekers to track enemies", cost: 8 }
    ],
    difficulty: 3,
    isOriginal: false,
    nationality: "Australia",
    realName: "Kirra Foster"
  },
  {
    id: 17,
    name: "KAY/O",
    role: "initiator",
    description: "War machine built to suppress enemy abilities",
    abilities: [
      { name: "FRAG/ment", type: "basic", description: "Stick explosive that damages in pulses", cost: 200 },
      { name: "FLASH/drive", type: "basic", description: "Throw flash that pops after delay", cost: 250 },
      { name: "ZERO/point", type: "signature", description: "Throw suppression blade", cooldown: 40 },
      { name: "NULL/cmd", type: "ultimate", description: "Overload with combat stim and suppression pulses", cost: 8 }
    ],
    difficulty: 2,
    isOriginal: false,
    nationality: "Unknown",
    realName: "KAY/O"
  },
  {
    id: 18,
    name: "Fade",
    role: "initiator",
    description: "Nightmare hunter who reveals enemies' worst fears",
    abilities: [
      { name: "Prowler", type: "basic", description: "Send creature that tracks enemies", cost: 300 },
      { name: "Seize", type: "basic", description: "Throw orb that tethers enemies", cost: 200 },
      { name: "Haunt", type: "signature", description: "Throw nightmare that reveals and trails", cooldown: 40 },
      { name: "Nightfall", type: "ultimate", description: "Send wave of nightmare energy", cost: 7 }
    ],
    difficulty: 4,
    isOriginal: false,
    nationality: "Turkey",
    realName: "Hazal Eyletmez"
  },
  {
    id: 19,
    name: "Gekko",
    role: "initiator",
    description: "Los Angeles native who leads pack of creatures",
    abilities: [
      { name: "Dizzy", type: "basic", description: "Send creature that blinds enemies", cost: 250 },
      { name: "Wingman", type: "basic", description: "Send creature that can plant spike", cost: 300 },
      { name: "Mosh Pit", type: "signature", description: "Throw creature that explodes after delay", cooldown: 45 },
      { name: "Thrash", type: "ultimate", description: "Control large creature to clear areas", cost: 8 }
    ],
    difficulty: 3,
    isOriginal: false,
    nationality: "USA",
    realName: "Mateo Armendáriz De la Fuente"
  },

  // SENTINEL AGENTS
  {
    id: 20,
    name: "Sage",
    role: "sentinel",
    description: "Support specialist who heals teammates and controls space",
    abilities: [
      { name: "Slow Orb", type: "basic", description: "Create slowing field", cost: 200 },
      { name: "Healing Orb", type: "basic", description: "Heal teammate or self", cost: 200 },
      { name: "Barrier Orb", type: "signature", description: "Create solid wall", cooldown: 45 },
      { name: "Resurrection", type: "ultimate", description: "Revive fallen teammate", cost: 8 }
    ],
    difficulty: 2,
    isOriginal: false,
    nationality: "China",
    realName: "Wei Ling Ying"
  },
  {
    id: 21,
    name: "Cypher",
    role: "sentinel",
    description: "Information broker who watches every move",
    abilities: [
      { name: "Cyber Cage", type: "basic", description: "Deployable cage that slows enemies", cost: 200 },
      { name: "Spycam", type: "basic", description: "Place surveillance camera", cost: 200 },
      { name: "Trapwire", type: "signature", description: "Place trip that reveals and slows", cooldown: 45 },
      { name: "Neural Theft", type: "ultimate", description: "Extract locations from dead enemy", cost: 6 }
    ],
    difficulty: 3,
    isOriginal: false,
    nationality: "Morocco",
    realName: "Amir"
  },
  {
    id: 22,
    name: "Killjoy",
    role: "sentinel",
    description: "Genius inventor who secures areas with gadgets",
    abilities: [
      { name: "Alarmbot", type: "basic", description: "Deploy bot that hunts enemies", cost: 200 },
      { name: "Turret", type: "basic", description: "Deploy turret that fires at enemies", cost: 200 },
      { name: "Nanoswarm", type: "signature", description: "Deploy invisible swarm grenades", cooldown: 45 },
      { name: "Lockdown", type: "ultimate", description: "Deploy device that detains enemies", cost: 9 }
    ],
    difficulty: 3,
    isOriginal: false,
    nationality: "Germany",
    realName: "Klara Böhringer"
  },
  {
    id: 23,
    name: "Chamber",
    role: "sentinel",
    description: "Well-dressed weapons designer with custom arsenal",
    abilities: [
      { name: "Trademark", type: "basic", description: "Place trap that scans for enemies", cost: 200 },
      { name: "Headhunter", type: "basic", description: "Activate heavy pistol", cost: 150 },
      { name: "Rendezvous", type: "signature", description: "Place teleport anchors", cooldown: 20 },
      { name: "Tour de Force", type: "ultimate", description: "Activate powerful sniper rifle", cost: 8 }
    ],
    difficulty: 4,
    isOriginal: false,
    nationality: "France",
    realName: "Vincent Fabron"
  },
  {
    id: 24,
    name: "Deadlock",
    role: "sentinel",
    description: "Norwegian operative who traps and isolates threats",
    abilities: [
      { name: "GravNet", type: "basic", description: "Throw net that forces crouch", cost: 200 },
      { name: "Sonic Sensor", type: "basic", description: "Deploy sensor that detects sound", cost: 200 },
      { name: "Barrier Mesh", type: "signature", description: "Deploy barrier discs", cooldown: 45 },
      { name: "Annihilation", type: "ultimate", description: "Capture enemy in cocoon", cost: 9 }
    ],
    difficulty: 3,
    isOriginal: false,
    nationality: "Norway",
    realName: "Iselin"
  },
  {
    id: 25,
    name: "Vyse",
    role: "sentinel",
    description: "Liquid metal manipulator who reshapes the battlefield",
    abilities: [
      { name: "Shear", type: "basic", description: "Deploy invisible wall that slows", cost: 200 },
      { name: "Arc Rose", type: "basic", description: "Place blind that can detain", cost: 200 },
      { name: "Razorvine", type: "signature", description: "Deploy metal vines", cooldown: 45 },
      { name: "Steel Garden", type: "ultimate", description: "Copy and spread utility", cost: 8 }
    ],
    difficulty: 4,
    isOriginal: false,
    nationality: "Unknown",
    realName: "Unknown"
  },

  // ORIGINAL AGENTS (2)
  {
    id: 29,
    name: "Nexus",
    role: "initiator",
    description: "Digital realm hacker who manipulates electronic systems and data streams",
    abilities: [
      { name: "System Breach", type: "basic", description: "Hack enemy utility to disable temporarily", cost: 300 },
      { name: "Data Pulse", type: "basic", description: "Send scanner wave that reveals enemies briefly", cost: 200 },
      { name: "Network Override", type: "signature", description: "Create data link between two points", cooldown: 35 },
      { name: "Total Shutdown", type: "ultimate", description: "Disable all enemy abilities in large area", cost: 8 }
    ],
    difficulty: 4,
    isOriginal: true,
    nationality: "Digital Realm",
    realName: "N3X-07",
    lore: "Born from the convergence of multiple data streams, Nexus exists in both digital and physical realms. Their consciousness emerged from the first radianite-powered quantum computer, giving them unique abilities to interface with any electronic system."
  },
  {
    id: 30,
    name: "Tempest",
    role: "controller",
    description: "Weather manipulation specialist controlling atmospheric conditions and elemental forces",
    abilities: [
      { name: "Wind Gust", type: "basic", description: "Create wind current that pushes enemies and projectiles", cost: 250 },
      { name: "Lightning Strike", type: "basic", description: "Call down lightning at target location", cost: 300 },
      { name: "Storm Cloud", type: "signature", description: "Deploy moving cloud that obscures vision", cooldown: 40 },
      { name: "Hurricane", type: "ultimate", description: "Create massive storm system across map", cost: 9 }
    ],
    difficulty: 5,
    isOriginal: true,
    nationality: "Sky Islands",
    realName: "Zara Stormwind",
    lore: "Once a meteorologist studying radianite's effect on weather patterns, Zara was caught in a radianite storm that fundamentally changed her connection to atmospheric forces. Now she can command the very weather itself."
  }
];

export const getAgentsByRole = (role: string) => {
  return AGENTS.filter(agent => agent.role === role);
};

export const getAgentById = (id: number) => {
  return AGENTS.find(agent => agent.id === id);
};

export const getRandomAgents = (count: number, excludeIds: number[] = []) => {
  const available = AGENTS.filter(agent => !excludeIds.includes(agent.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getAgentsByDifficulty = (difficulty: number) => {
  return AGENTS.filter(agent => agent.difficulty === difficulty);
};

export const getOriginalAgents = () => {
  return AGENTS.filter(agent => agent.isOriginal);
};

export const getAdaptedAgents = () => {
  return AGENTS.filter(agent => !agent.isOriginal);
};
