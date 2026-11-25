import React, { useState } from 'react';
import {
  GymLeaderAccount,
  TrainerProfile,
  GymChallenge,
} from '../types/pokemon';
import { POKEMON_TYPE_COLORS } from '../data/pokemonCatalog';
import { createGymChallenge } from '../services/storageService';
import { sounds } from '../utils/soundEffects';
import {
  Swords,
  Shield,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Gamepad2,
  Lock,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface Props {
  gymLeaders: GymLeaderAccount[];
  activeTrainer: TrainerProfile;
  challenges: GymChallenge[];
  onOpenBattleRoom: (challenge: GymChallenge) => void;
  onChallengeCreated: (newChallenge: GymChallenge) => void;
}

export const GymDirectoryView: React.FC<Props> = ({
  gymLeaders,
  activeTrainer,
  challenges,
  onOpenBattleRoom,
  onChallengeCreated,
}) => {
  const [filterType, setFilterType] = useState<string>('todos');

  // Filter challenges for this trainer
  const myActiveChallenges = challenges.filter(
    (c) => c.trainerId === activeTrainer.id && c.status !== 'cancelado'
  );

  const handleChallenge = (leader: GymLeaderAccount) => {
    // Check if there is already an ongoing challenge with this gym
    const existing = myActiveChallenges.find(
      (c) => c.gymId === leader.gymId && c.status !== 'victoria_retador' && c.status !== 'victoria_lider'
    );
    if (existing) {
      sounds.playBeep(700, 'sine', 0.08);
      onOpenBattleRoom(existing);
      return;
    }

    sounds.playBeep(900, 'square', 0.12);
    const newChal = createGymChallenge(activeTrainer, leader);
    onChallengeCreated(newChal);
    onOpenBattleRoom(newChal);
  };

  const filteredLeaders = gymLeaders.filter((leader) => {
    if (filterType === 'todos') return true;
    if (filterType === 'abierto') return leader.status === 'abierto';
    return leader.elementalType.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="relative rounded-3xl p-5 sm:p-7 bg-gradient-to-r from-red-950 via-slate-900 to-cyan-950 border-2 border-red-500/50 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-600/30 border border-red-500 text-red-400">
                <Swords className="w-5 h-5" />
              </span>
              <h2 className="font-pokedex text-lg sm:text-2xl font-black text-white tracking-wide">
                ARENA DE GIMNASIOS & DESAFÍOS OFICIALES
              </h2>
            </div>
            <p className="text-xs font-tech text-slate-300 max-w-2xl leading-relaxed">
              Selecciona un Gimnasio activo para retar a su Líder. Se creará una <strong>Sala Privada</strong> donde el Líder te proporcionará la <strong>ID de sala de Pokémon Champions</strong> para combatir y acreditar tu medalla oficial.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800 shrink-0">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] font-tech text-slate-400 block">TUS MEDALLAS:</span>
              <span className="font-pokedex text-sm font-bold text-amber-300">
                {activeTrainer.gymBadges.filter((b) => b.isEarned).length} de {gymLeaders.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Battle Rooms Bar if Trainer has pending/active duels */}
      {myActiveChallenges.length > 0 && (
        <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-cyan-500/40 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-pokedex text-xs font-bold text-cyan-400 tracking-wider flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              TUS SALAS DE COMBATE ACTIVAS ({myActiveChallenges.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myActiveChallenges.map((chal) => (
              <div
                key={chal.id}
                onClick={() => onOpenBattleRoom(chal)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-400 cursor-pointer transition shadow-md flex items-center justify-between group"
              >
                <div>
                  <span className="font-pokedex text-xs font-bold text-white block">
                    {chal.gymName}
                  </span>
                  <span className="text-[11px] font-tech text-slate-400 block">
                    Líder: {chal.gymLeaderName}
                  </span>
                  {chal.pokemonChampionsRoomId ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      Sala: {chal.pokemonChampionsRoomId}
                    </span>
                  ) : (
                    <span className="text-[10px] font-tech text-amber-400">
                      Esperando ID de sala...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-cyan-400 text-xs font-tech font-bold group-hover:translate-x-1 transition">
                  <span>Entrar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setFilterType('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-tech font-bold transition ${
              filterType === 'todos'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todos ({gymLeaders.length})
          </button>
          <button
            onClick={() => setFilterType('abierto')}
            className={`px-3 py-1.5 rounded-xl text-xs font-tech font-bold transition ${
              filterType === 'abierto'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🟢 Abiertos para Retar
          </button>
        </div>
      </div>

      {/* Gym Leaders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeaders.map((leader) => {
          const typeStyle = POKEMON_TYPE_COLORS[leader.elementalType] || POKEMON_TYPE_COLORS['Normal'];
          const isBadgeEarned = activeTrainer.gymBadges.some(
            (b) => (b.number === leader.gymId || b.id === leader.gymId) && b.isEarned
          );
          const isOpen = leader.status === 'abierto';
          const isInBattle = leader.status === 'en_batalla';

          return (
            <div
              key={leader.id}
              className={`relative rounded-2xl bg-slate-900/90 border-2 p-5 flex flex-col justify-between transition-all duration-300 shadow-xl ${
                isOpen
                  ? 'border-slate-800 hover:border-cyan-500/80 hover:shadow-cyan-950/30'
                  : isInBattle
                  ? 'border-amber-600/40 bg-slate-950/90'
                  : 'border-slate-800/60 opacity-70'
              }`}
            >
              {/* Card Header: Gym Name and Status */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <div>
                    <span className="font-pokedex text-xs font-bold text-slate-400 block font-mono">
                      GIMNASIO #{leader.gymId}
                    </span>
                    <h3 className="font-pokedex text-sm font-bold text-white tracking-wide">
                      {leader.gymName}
                    </h3>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border flex items-center gap-1 ${
                      isOpen
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isInBattle
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOpen ? 'bg-emerald-400' : isInBattle ? 'bg-amber-400' : 'bg-slate-500'
                      }`}
                    />
                    {isOpen ? 'Abierto' : isInBattle ? 'En Batalla' : 'Cerrado'}
                  </span>
                </div>

                {/* Leader Info and Avatar */}
                <div className="flex items-center gap-3.5 my-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <div className="relative w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 p-0.5 overflow-hidden shrink-0">
                    <img
                      src={leader.avatarUrl}
                      alt={leader.leaderName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-pokedex text-xs font-bold text-slate-100 truncate">
                      {leader.leaderName}
                    </h4>
                    <span className="text-[11px] font-tech text-slate-400 block truncate">
                      {leader.city}
                    </span>

                    {/* Element pill */}
                    <div className="mt-1">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase shadow-sm ${typeStyle.bg} ${typeStyle.text}`}
                      >
                        TIPO {leader.elementalType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badge reward preview */}
                <div className="flex items-center justify-between bg-slate-950/50 px-3 py-2 rounded-xl border border-slate-800/60 text-xs font-tech mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{leader.badgeIcon}</span>
                    <span className="font-bold text-slate-300">{leader.badgeName}</span>
                  </div>
                  {isBadgeEarned ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Conquistada</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">Pendiente</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="button"
                  onClick={() => handleChallenge(leader)}
                  disabled={!isOpen && !isInBattle}
                  className={`w-full py-2.5 px-4 rounded-xl font-pokedex text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 ${
                    isOpen
                      ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white border border-amber-400/40 shadow-red-950/40'
                      : isInBattle
                      ? 'bg-amber-600/30 border border-amber-500 text-amber-300 hover:bg-amber-600/40'
                      : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Swords className="w-4 h-4" />
                  <span>
                    {isBadgeEarned
                      ? 'DESAFIAR NUEVAMENTE'
                      : isOpen
                      ? 'DESAFIAR GIMNASIO'
                      : isInBattle
                      ? 'UNIRSE / VER SALA'
                      : 'GIMNASIO CERRADO'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
