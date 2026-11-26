export type CardTheme = 'cyan-league' | 'rocket-crimson' | 'kanto-classic' | 'cyber-emerald' | 'custom';

export interface PokemonStats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface PokemonEVs {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface PokemonMember {
  slot: number; // 1 to 6
  species: string;
  pokedexNumber: number;
  nickname: string;
  level: number;
  gender: 'male' | 'female' | 'genderless';
  isShiny: boolean;
  spriteUrl: string;
  artworkUrl: string;
  types: string[];
  ability: string;
  nature: string;
  heldItem: string;
  teraType?: string;
  stats: PokemonStats;
  evs: PokemonEVs;
  moves: string[];
}

export interface GymBadge {
  id: number;
  number: number;
  name: string;
  gymLeader: string;
  city: string;
  type: string;
  badgeIcon: string;
  color: string;
  isEarned: boolean;
  earnedDate?: string;
  signedByLeader?: string;
  battleNotes?: string;
}

export interface EliteFourInsignia {
  id: number;
  name: string;
  member: string;
  specialty: string;
  isEarned: boolean;
  earnedDate?: string;
}

export interface ChampionRecord {
  isChampion: boolean;
  title: string;
  earnedDate?: string;
  hallOfFameId?: string;
  awardedBy?: string;
}

export interface TrainerProfile {
  id: string;
  name: string;
  inGameName: string; // IGN / @ws
  trainerIdNumber: string;
  registrationDate: string;
  avatarUrl: string;
  region: string;
  quote?: string;
  theme: CardTheme;
  isLocked: boolean; // Locked after initial registration
  lockedAt?: string;
  team: PokemonMember[]; // Exactly 6 Pokémon
  gymBadges: GymBadge[]; // 8 Gym Badges
  eliteFour: EliteFourInsignia[];
  champion: ChampionRecord;
}

export type GymStatus = 'abierto' | 'en_batalla' | 'cerrado';

export interface GymLeaderAccount {
  id: string;
  username: string; // Individual login user
  password: string; // Assigned by Super Admin
  pin?: string; // Secret 4-digit PIN
  leaderName: string;
  gymId: number; // Links to Gym Badge
  gymName: string;
  city: string;
  elementalType: string;
  avatarUrl: string;
  status: GymStatus;
  badgeName: string;
  badgeIcon: string;
  badgeColor: string;
}

export type ChallengeStatus = 'pendiente' | 'aceptado' | 'en_combate' | 'victoria_retador' | 'victoria_lider' | 'cancelado';

export interface BattleMessage {
  id: string;
  sender: 'trainer' | 'leader' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface GymChallenge {
  id: string;
  gymId: number;
  gymName: string;
  gymLeaderName: string;
  leaderUsername: string;
  trainerId: string;
  trainerName: string;
  trainerIgn: string;
  trainerAvatar: string;
  pokemonChampionsRoomId?: string; // Private room ID inserted by Leader
  status: ChallengeStatus;
  createdAt: string;
  updatedAt: string;
  battleMessages: BattleMessage[];
  battleNotes?: string;
  badgeAwarded?: boolean;
}

export interface LeagueSettings {
  leagueName: string;
  seasonTitle: string;
  primaryColor: string;
  accentColor: string;
  bannerTitle: string;
  announcementText: string;
  adminUsername: string;
  adminPassword: string;
  adminPin: string; // Secret 4-digit master PIN for Super Admin
}
