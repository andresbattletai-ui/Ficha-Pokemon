import {
  TrainerProfile,
  GymBadge,
  EliteFourInsignia,
  PokemonMember,
  GymLeaderAccount,
  GymChallenge,
  LeagueSettings,
  BattleMessage,
} from '../types/pokemon';
import { INITIAL_GYM_BADGES, INITIAL_ELITE_FOUR, DEFAULT_INITIAL_TEAM } from '../data/pokemonCatalog';

const STORAGE_PROFILES_KEY = 'pokecard_trainer_profiles_v2';
const ACTIVE_PROFILE_KEY = 'pokecard_active_trainer_id_v2';
const STORAGE_LEADERS_KEY = 'pokecard_gym_leaders_v2';
const STORAGE_CHALLENGES_KEY = 'pokecard_gym_challenges_v2';
const STORAGE_SETTINGS_KEY = 'pokecard_league_settings_v2';
const ACTIVE_LEADER_SESSION_KEY = 'pokecard_active_leader_session_v2';
const ACTIVE_ADMIN_SESSION_KEY = 'pokecard_active_admin_session_v2';

export const DEFAULT_LEAGUE_SETTINGS: LeagueSettings = {
  leagueName: 'Liga Pokémon Champions 2026',
  seasonTitle: 'Temporada Oficial • Desafío de Gimnasios',
  primaryColor: '#dc2626',
  accentColor: '#38bdf8',
  bannerTitle: 'GYM NEW GENERATIONS & LEGADOS',
  announcementText: '¡Desafía a los Líderes de Gimnasio activos para recibir la ID de la sala de Pokémon Champions y ganar tus medallas oficiales!',
  adminUsername: 'admin',
  adminPassword: 'admin2026',
};

export const INITIAL_GYM_LEADERS: GymLeaderAccount[] = [
  {
    id: 'leader-1',
    username: 'brock',
    password: 'roca123',
    leaderName: 'Líder Brock',
    gymId: 1,
    gymName: 'Gimnasio Plateada',
    city: 'Ciudad Plateada',
    elementalType: 'Roca',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/brock.png',
    status: 'abierto',
    badgeName: 'Medalla Roca',
    badgeIcon: '💎',
    badgeColor: '#a8a29e',
  },
  {
    id: 'leader-2',
    username: 'misty',
    password: 'agua123',
    leaderName: 'Líder Misty',
    gymId: 2,
    gymName: 'Gimnasio Celeste',
    city: 'Ciudad Celeste',
    elementalType: 'Agua',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/misty.png',
    status: 'abierto',
    badgeName: 'Medalla Cascada',
    badgeIcon: '💧',
    badgeColor: '#38bdf8',
  },
  {
    id: 'leader-3',
    username: 'surge',
    password: 'rayo123',
    leaderName: 'Líder Lt. Surge',
    gymId: 3,
    gymName: 'Gimnasio Carmín',
    city: 'Ciudad Carmín',
    elementalType: 'Eléctrico',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/surge.png',
    status: 'abierto',
    badgeName: 'Medalla Trueno',
    badgeIcon: '⚡',
    badgeColor: '#eab308',
  },
  {
    id: 'leader-4',
    username: 'erika',
    password: 'planta123',
    leaderName: 'Líder Erika',
    gymId: 4,
    gymName: 'Gimnasio Azulona',
    city: 'Ciudad Azulona',
    elementalType: 'Planta',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/erika.png',
    status: 'abierto',
    badgeName: 'Medalla Arcoíris',
    badgeIcon: '🌸',
    badgeColor: '#22c55e',
  },
  {
    id: 'leader-5',
    username: 'koga',
    password: 'veneno123',
    leaderName: 'Líder Koga',
    gymId: 5,
    gymName: 'Gimnasio Fucsia',
    city: 'Ciudad Fucsia',
    elementalType: 'Veneno',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/koga.png',
    status: 'en_batalla',
    badgeName: 'Medalla Alma',
    badgeIcon: '💜',
    badgeColor: '#a855f7',
  },
  {
    id: 'leader-6',
    username: 'sabrina',
    password: 'psico123',
    leaderName: 'Líder Sabrina',
    gymId: 6,
    gymName: 'Gimnasio Azafrán',
    city: 'Ciudad Azafrán',
    elementalType: 'Psíquico',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/sabrina.png',
    status: 'abierto',
    badgeName: 'Medalla Pantano',
    badgeIcon: '🔮',
    badgeColor: '#ec4899',
  },
  {
    id: 'leader-7',
    username: 'blaine',
    password: 'fuego123',
    leaderName: 'Líder Blaine',
    gymId: 7,
    gymName: 'Gimnasio Canela',
    city: 'Isla Canela',
    elementalType: 'Fuego',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/blaine.png',
    status: 'cerrado',
    badgeName: 'Medalla Volcán',
    badgeIcon: '🔥',
    badgeColor: '#ef4444',
  },
  {
    id: 'leader-8',
    username: 'giovanni',
    password: 'rocket123',
    leaderName: 'Líder Giovanni (Rocket)',
    gymId: 8,
    gymName: 'Gym Legados Verde',
    city: 'Ciudad Verde',
    elementalType: 'Tierra',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/giovanni.png',
    status: 'abierto',
    badgeName: 'Medalla Tierra',
    badgeIcon: '🛡️',
    badgeColor: '#d97706',
  },
];

export const INITIAL_TRAINER: TrainerProfile = {
  id: 'trainer-08492',
  name: 'Andrés Omaña',
  inGameName: '@ws_andres',
  trainerIdNumber: '08492-LG',
  registrationDate: '18/10/26',
  avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png',
  region: 'Liga Pokémon Champions',
  quote: '¡Seré el mejor entrenador en Pokémon Champions!',
  theme: 'cyan-league',
  isLocked: true,
  lockedAt: '18/10/26 10:32:00',
  team: DEFAULT_INITIAL_TEAM,
  gymBadges: INITIAL_GYM_BADGES.map((b, idx) => {
    if (idx < 2) {
      return {
        ...b,
        isEarned: true,
        earnedDate: '19/10/26',
        signedByLeader: b.gymLeader,
        battleNotes: `Victoria épica en Pokémon Champions. Sala ID: CHAMP-00${idx + 1}`,
      };
    }
    return b;
  }),
  eliteFour: INITIAL_ELITE_FOUR,
  champion: {
    isChampion: false,
    title: 'Aspirante de la Liga Pokémon',
  },
};

// INITIAL CHALLENGE SAMPLE
export const INITIAL_CHALLENGES: GymChallenge[] = [
  {
    id: 'chal-sample-1',
    gymId: 1,
    gymName: 'Gimnasio Plateada',
    gymLeaderName: 'Líder Brock',
    leaderUsername: 'brock',
    trainerId: 'trainer-08492',
    trainerName: 'Andrés Omaña',
    trainerIgn: '@ws_andres',
    trainerAvatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png',
    pokemonChampionsRoomId: 'CHAMP-PKMN-4892',
    status: 'en_combate',
    createdAt: '20/10/26 09:30',
    updatedAt: '20/10/26 09:32',
    battleMessages: [
      {
        id: 'msg-1',
        sender: 'system',
        senderName: 'Sistema de Liga',
        text: 'Desafío oficial iniciado por el entrenador Andrés Omaña.',
        timestamp: '09:30',
      },
      {
        id: 'msg-2',
        sender: 'leader',
        senderName: 'Líder Brock',
        text: '¡Acepto tu reto! Conéctate a Pokémon Champions con el ID de sala: CHAMP-PKMN-4892. Formato 6v6 reglas oficiales.',
        timestamp: '09:32',
      },
      {
        id: 'msg-3',
        sender: 'trainer',
        senderName: 'Andrés Omaña',
        text: '¡Entendido Líder! Entrando a la sala ahora mismo con mi equipo sellado.',
        timestamp: '09:33',
      },
    ],
  },
];

// --- TRAINER PROFILES ---

export function createNewBlankTrainer(): TrainerProfile {
  const randomId = Math.floor(10000 + Math.random() * 90000);
  const dateFormatted = new Date().toLocaleDateString('es-ES');
  return {
    id: `trainer-${Date.now()}`,
    name: 'Nuevo Entrenador',
    inGameName: '@entrenador',
    trainerIdNumber: `${randomId}-LG`,
    registrationDate: dateFormatted,
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png',
    region: 'Liga Pokémon Champions',
    quote: '¡Listo para desafiar a los gimnasios!',
    theme: 'cyan-league',
    isLocked: false,
    team: DEFAULT_INITIAL_TEAM,
    gymBadges: INITIAL_GYM_BADGES.map((b) => ({ ...b, isEarned: false })),
    eliteFour: INITIAL_ELITE_FOUR.map((e) => ({ ...e, isEarned: false })),
    champion: {
      isChampion: false,
      title: 'Aspirante de la Liga Pokémon',
    },
  };
}

export function getStoredProfiles(): TrainerProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    if (!raw) {
      const initial = [INITIAL_TRAINER];
      localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(initial));
      localStorage.setItem(ACTIVE_PROFILE_KEY, INITIAL_TRAINER.id);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      if (parsed.length > 0) {
        return parsed;
      }
      // If array exists but is empty (e.g. user deleted all trainers), create a fresh new one
      // instead of re-injecting the old deleted INITIAL_TRAINER
      const fresh = createNewBlankTrainer();
      localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify([fresh]));
      localStorage.setItem(ACTIVE_PROFILE_KEY, fresh.id);
      return [fresh];
    }
    return [INITIAL_TRAINER];
  } catch {
    return [INITIAL_TRAINER];
  }
}

export function saveProfiles(profiles: TrainerProfile[]) {
  try {
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error('Failed to save trainer profiles:', err);
  }
}

export function getActiveProfileId(): string {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY) || '';
  } catch {
    return '';
  }
}

export function setActiveProfileId(id: string) {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  } catch (err) {
    console.error(err);
  }
}

export function getActiveProfile(): TrainerProfile {
  const profiles = getStoredProfiles();
  const activeId = getActiveProfileId();
  const found = profiles.find((p) => p.id === activeId);
  if (found) return found;
  if (profiles.length > 0) {
    setActiveProfileId(profiles[0].id);
    return profiles[0];
  }
  const fresh = createNewBlankTrainer();
  saveProfiles([fresh]);
  setActiveProfileId(fresh.id);
  return fresh;
}

export function updateActiveProfile(updated: TrainerProfile) {
  const profiles = getStoredProfiles();
  const idx = profiles.findIndex((p) => p.id === updated.id);
  if (idx !== -1) {
    profiles[idx] = updated;
  } else {
    profiles.push(updated);
  }
  saveProfiles(profiles);
}

export function deleteTrainerProfile(id: string): { remaining: TrainerProfile[]; active: TrainerProfile } {
  let profiles = getStoredProfiles();
  profiles = profiles.filter((p) => p.id !== id);

  if (profiles.length === 0) {
    const fresh = createNewBlankTrainer();
    profiles = [fresh];
  }

  saveProfiles(profiles);

  // Clean up challenges associated with this deleted trainer
  try {
    const challenges = getStoredChallenges().filter((c) => c.trainerId !== id);
    saveChallenges(challenges);
  } catch (e) {
    console.warn('Could not clean challenges for deleted trainer', e);
  }

  // Update active profile ID if the active one was deleted
  const currentActiveId = getActiveProfileId();
  let nextActive = profiles[0];
  if (currentActiveId === id || !profiles.some((p) => p.id === currentActiveId)) {
    setActiveProfileId(nextActive.id);
  } else {
    nextActive = profiles.find((p) => p.id === currentActiveId) || profiles[0];
  }

  return { remaining: profiles, active: nextActive };
}

export function deleteGymLeader(id: string): GymLeaderAccount[] {
  let leaders = getStoredGymLeaders();
  leaders = leaders.filter((l) => l.id !== id);
  saveGymLeaders(leaders);
  return leaders;
}

// --- GYM LEADERS ---
export function getStoredGymLeaders(): GymLeaderAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_LEADERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_LEADERS_KEY, JSON.stringify(INITIAL_GYM_LEADERS));
      return INITIAL_GYM_LEADERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_GYM_LEADERS;
  } catch {
    return INITIAL_GYM_LEADERS;
  }
}

export function saveGymLeaders(leaders: GymLeaderAccount[]) {
  try {
    localStorage.setItem(STORAGE_LEADERS_KEY, JSON.stringify(leaders));
  } catch (err) {
    console.error(err);
  }
}

export function getActiveLeaderSession(): GymLeaderAccount | null {
  try {
    const raw = localStorage.getItem(ACTIVE_LEADER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setActiveLeaderSession(leader: GymLeaderAccount | null) {
  try {
    if (leader) {
      localStorage.setItem(ACTIVE_LEADER_SESSION_KEY, JSON.stringify(leader));
    } else {
      localStorage.removeItem(ACTIVE_LEADER_SESSION_KEY);
    }
  } catch (err) {
    console.error(err);
  }
}

// --- SUPER ADMIN SESSION ---
export function getIsAdminAuthenticated(): boolean {
  try {
    return localStorage.getItem(ACTIVE_ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setIsAdminAuthenticated(authed: boolean) {
  try {
    if (authed) {
      localStorage.setItem(ACTIVE_ADMIN_SESSION_KEY, 'true');
    } else {
      localStorage.removeItem(ACTIVE_ADMIN_SESSION_KEY);
    }
  } catch (err) {
    console.error(err);
  }
}

// --- GYM CHALLENGES & PRIVATE BATTLE ROOMS ---
export function getStoredChallenges(): GymChallenge[] {
  try {
    const raw = localStorage.getItem(STORAGE_CHALLENGES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CHALLENGES_KEY, JSON.stringify(INITIAL_CHALLENGES));
      return INITIAL_CHALLENGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_CHALLENGES;
  } catch {
    return INITIAL_CHALLENGES;
  }
}

export function saveChallenges(challenges: GymChallenge[]) {
  try {
    localStorage.setItem(STORAGE_CHALLENGES_KEY, JSON.stringify(challenges));
  } catch (err) {
    console.error(err);
  }
}

export function createGymChallenge(
  trainer: TrainerProfile,
  gymLeader: GymLeaderAccount
): GymChallenge {
  const challenges = getStoredChallenges();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toLocaleDateString('es-ES');

  const newChallenge: GymChallenge = {
    id: `chal-${Date.now()}`,
    gymId: gymLeader.gymId,
    gymName: gymLeader.gymName,
    gymLeaderName: gymLeader.leaderName,
    leaderUsername: gymLeader.username,
    trainerId: trainer.id,
    trainerName: trainer.name,
    trainerIgn: trainer.inGameName,
    trainerAvatar: trainer.avatarUrl,
    status: 'pendiente',
    createdAt: `${dateStr} ${timeStr}`,
    updatedAt: `${dateStr} ${timeStr}`,
    battleMessages: [
      {
        id: `msg-${Date.now()}-sys`,
        sender: 'system',
        senderName: 'Sistema de Liga',
        text: `El entrenador ${trainer.name} (${trainer.inGameName}) ha enviado una solicitud de desafío oficial al ${gymLeader.gymName}. Esperando respuesta del líder con la ID de sala de Pokémon Champions.`,
        timestamp: timeStr,
      },
    ],
  };

  const updated = [newChallenge, ...challenges];
  saveChallenges(updated);
  return newChallenge;
}

export function addMessageToChallenge(
  challengeId: string,
  message: Omit<BattleMessage, 'id' | 'timestamp'>
): GymChallenge | null {
  const challenges = getStoredChallenges();
  const idx = challenges.findIndex((c) => c.id === challengeId);
  if (idx === -1) return null;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const fullMsg: BattleMessage = {
    ...message,
    id: `msg-${Date.now()}`,
    timestamp: timeStr,
  };

  challenges[idx].battleMessages.push(fullMsg);
  challenges[idx].updatedAt = timeStr;
  saveChallenges(challenges);
  return challenges[idx];
}

// Award badge directly through battle room victory
export function awardBadgeFromBattleRoom(
  challengeId: string,
  leader: GymLeaderAccount,
  battleNotes: string
): { success: boolean; trainer?: TrainerProfile } {
  const challenges = getStoredChallenges();
  const chal = challenges.find((c) => c.id === challengeId);
  if (!chal) return { success: false };

  // Update challenge
  chal.status = 'victoria_retador';
  chal.badgeAwarded = true;
  chal.battleNotes = battleNotes;
  saveChallenges(challenges);

  // Update trainer
  const profiles = getStoredProfiles();
  const trainer = profiles.find((p) => p.id === chal.trainerId);
  if (!trainer) return { success: false };

  const dateStr = new Date().toLocaleDateString('es-ES');
  trainer.gymBadges = trainer.gymBadges.map((b) => {
    if (b.number === leader.gymId || b.id === leader.gymId) {
      return {
        ...b,
        isEarned: true,
        earnedDate: dateStr,
        signedByLeader: leader.leaderName,
        battleNotes: battleNotes || `Victoria oficial en Pokémon Champions. Sala ID: ${chal.pokemonChampionsRoomId || 'OFICIAL'}`,
      };
    }
    return b;
  });

  saveProfiles(profiles);
  return { success: true, trainer };
}

// --- LEAGUE SETTINGS ---
export function getLeagueSettings(): LeagueSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_LEAGUE_SETTINGS));
      return DEFAULT_LEAGUE_SETTINGS;
    }
    return { ...DEFAULT_LEAGUE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_LEAGUE_SETTINGS;
  }
}

export function saveLeagueSettings(settings: LeagueSettings) {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error(err);
  }
}
