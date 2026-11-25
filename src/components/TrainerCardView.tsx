import React, { useState } from 'react';
import { TrainerProfile, PokemonMember, GymBadge } from '../types/pokemon';
import { POKEMON_TYPE_COLORS } from '../data/pokemonCatalog';
import { sounds } from '../utils/soundEffects';
import {
  Lock,
  Unlock,
  Sparkles,
  Trophy,
  Shield,
  Award,
  Zap,
  Info,
  QrCode,
  Share2,
  Swords,
  ChevronRight,
  Flame,
  CheckCircle2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  trainer: TrainerProfile;
  onOpenPokemonDetail: (pokemon: PokemonMember) => void;
  onOpenAdmin: () => void;
  onOpenRegister: () => void;
  onOpenShare: () => void;
  onDeleteTrainer?: (trainerId: string) => void;
}

export const TrainerCardView: React.FC<Props> = ({
  trainer,
  onOpenPokemonDetail,
  onOpenAdmin,
  onOpenRegister,
  onOpenShare,
  onDeleteTrainer,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<GymBadge | null>(null);
  const [showEliteChallengeModal, setShowEliteChallengeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const earnedBadgesCount = trainer.gymBadges.filter((b) => b.isEarned).length;
  const earnedEliteCount = trainer.eliteFour.filter((e) => e.isEarned).length;
  const canChallengeElite = earnedBadgesCount === 8;

  // Theme configuration
  const isRocket = trainer.theme === 'rocket-crimson';
  const isCyan = trainer.theme === 'cyan-league';
  const isEmerald = trainer.theme === 'cyber-emerald';

  const themeStyles = {
    outerBorder: isRocket
      ? 'border-red-600/80 shadow-[0_0_35px_rgba(220,38,38,0.25)]'
      : isEmerald
      ? 'border-emerald-500/80 shadow-[0_0_35px_rgba(16,185,129,0.25)]'
      : isCyan
      ? 'border-cyan-400/80 shadow-[0_0_35px_rgba(56,189,248,0.25)]'
      : 'border-rose-500/80 shadow-[0_0_35px_rgba(244,63,94,0.25)]',
    cardBg: isRocket
      ? 'bg-gradient-to-b from-stone-950 via-red-950/20 to-black'
      : isEmerald
      ? 'bg-gradient-to-b from-slate-950 via-emerald-950/20 to-black'
      : isCyan
      ? 'bg-gradient-to-b from-slate-950 via-sky-950/25 to-slate-950'
      : 'bg-gradient-to-b from-slate-950 via-red-950/20 to-slate-950',
    headerAccent: isRocket
      ? 'text-red-400 border-red-500/40 bg-red-950/50'
      : isEmerald
      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/50'
      : isCyan
      ? 'text-cyan-300 border-cyan-500/40 bg-cyan-950/50'
      : 'text-rose-400 border-rose-500/40 bg-rose-950/50',
    titleGradient: isRocket
      ? 'from-red-400 via-rose-300 to-amber-400'
      : isEmerald
      ? 'from-emerald-300 via-teal-200 to-cyan-400'
      : isCyan
      ? 'from-cyan-300 via-sky-200 to-blue-400'
      : 'from-amber-300 via-yellow-200 to-red-400',
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Lock status banner notice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-tech">
        <div className="flex items-center gap-2">
          {trainer.isLocked ? (
            <div className="flex items-center gap-1.5 text-amber-300">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="font-bold">FICHA OFICIAL CERTIFICADA Y SELLADA:</span>
              <span className="text-slate-300">
                Los datos del entrenador y los 6 Pokémon no pueden modificarse por el usuario para preservar la validez del torneo.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Unlock className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">MODO DE REGISTRO ABIERTO:</span>
              <span className="text-slate-300">Configura tu equipo de 6 criaturas antes de sellar la ficha.</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compartir / QR</span>
          </button>
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40 transition"
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>Panel Líder</span>
          </button>
          {onDeleteTrainer && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950/80 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/50 transition text-xs"
              title="Eliminar esta ficha de entrenador"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Borrar Ficha</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Pokédex Pass Card Chassis */}
      <div
        id="official-trainer-card"
        className={`relative rounded-3xl p-4 sm:p-7 border-2 ${themeStyles.outerBorder} ${themeStyles.cardBg} shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300`}
      >
        {/* Holographic metallic background overlay & scanlines */}
        <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

        {/* Card Header Plate */}
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          {/* Top Title Banner */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
              <span className="text-xl">
                {isRocket ? '⚡' : isEmerald ? '🐲' : '🔴'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`font-pokedex text-lg sm:text-2xl font-black uppercase tracking-wider bg-gradient-to-r ${themeStyles.titleGradient} bg-clip-text text-transparent`}>
                  {isRocket ? 'GYM LEGADOS - ROCKET PASS' : 'GYM NEW GENERATIONS'}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700">
                  VERSIÓN OFICIAL
                </span>
              </div>
              <p className="text-xs font-tech text-slate-400 tracking-wide">
                PASAPORTE OFICIAL DE ENTRENADOR POKÉMON • LIGA NACIONAL
              </p>
            </div>
          </div>

          {/* Medals Counter & Status Chip */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 font-tech">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 text-xs">MEDALLAS:</span>
              <span className="font-pokedex font-bold text-amber-400 text-sm">
                {earnedBadgesCount}/8
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 font-tech">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400 text-xs">ALTO MANDO:</span>
              <span className="font-pokedex font-bold text-purple-400 text-sm">
                {earnedEliteCount}/4
              </span>
            </div>
          </div>
        </div>

        {/* Card Body Grid (Trainer Info + Registered Team + Badges) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* LEFT COLUMN: Trainer Info & 6 Registered Pokemon (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. DATOS DEL ENTRENADOR (as in reference image) */}
            <div className="relative rounded-2xl bg-slate-950/85 border border-slate-800 p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <span className={`font-pokedex text-xs sm:text-sm font-bold uppercase tracking-wider ${themeStyles.headerAccent} px-3 py-1 rounded-lg border`}>
                  DATOS DEL ENTRENADOR
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  ID: {trainer.trainerIdNumber}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Profile Photo / Avatar with holographic frame */}
                <div className="relative group shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-900 border-2 border-cyan-500/60 p-1 shadow-lg shadow-cyan-950/30 overflow-hidden relative">
                    <img
                      src={trainer.avatarUrl}
                      alt={trainer.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    {trainer.champion.isChampion && (
                      <div className="absolute top-1 right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                        <Trophy className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-1.5">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
                      FOTO DE PERFIL
                    </span>
                  </div>
                </div>

                {/* Trainer Information fields */}
                <div className="flex-1 space-y-2.5 w-full text-xs font-tech">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase">NOMBRE:</span>
                    <span className="font-pokedex font-bold text-white text-sm">
                      {trainer.name}
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase">NOMBRE DE WS / IGN:</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {trainer.inGameName}
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase">FECHA DE REGISTRO:</span>
                    <span className="font-mono text-slate-200">
                      {trainer.registrationDate}
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase">REGIÓN / LIGA:</span>
                    <span className="font-semibold text-amber-300">
                      {trainer.region}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. EQUIPO REGISTRADO (6 POKÉMON) */}
            <div className="relative rounded-2xl bg-slate-950/85 border border-slate-800 p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`font-pokedex text-xs sm:text-sm font-bold uppercase tracking-wider ${themeStyles.headerAccent} px-3 py-1 rounded-lg border`}>
                    EQUIPO REGISTRADO (6 POKÉMON)
                  </span>
                </div>
                <span className="text-[11px] font-tech text-slate-400">
                  Toca una criatura para ver estadísticas completas
                </span>
              </div>

              {/* Grid 2x3 or 3x2 for the 6 Pokemon */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {trainer.team.map((poke) => {
                  const mainType = poke.types[0] || 'Normal';
                  const typeStyle = POKEMON_TYPE_COLORS[mainType] || POKEMON_TYPE_COLORS['Normal'];

                  return (
                    <div
                      key={poke.slot}
                      onClick={() => {
                        sounds.playBeep(800, 'sine', 0.05);
                        onOpenPokemonDetail(poke);
                      }}
                      className="group relative rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/60 p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-cyan-950/30 hover:-translate-y-0.5"
                    >
                      {/* Top slot header */}
                      <div className="flex items-center justify-between text-[11px] font-tech">
                        <span className="text-slate-400 font-mono">#{poke.slot}</span>
                        <span className="font-mono text-cyan-400 font-bold">Nv. {poke.level}</span>
                      </div>

                      {/* Pokemon Image */}
                      <div className="relative my-2 w-full h-24 flex items-center justify-center bg-radial from-slate-800/50 to-transparent rounded-lg">
                        <img
                          src={poke.artworkUrl || poke.spriteUrl}
                          alt={poke.species}
                          className="max-h-20 max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition duration-300"
                        />
                        {poke.isShiny && (
                          <span className="absolute top-0 right-1 text-amber-300 text-xs">✨</span>
                        )}
                      </div>

                      {/* Name & Species */}
                      <div className="text-center">
                        <h4 className="font-pokedex text-xs font-bold text-white truncate">
                          {poke.nickname || poke.species}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-tech truncate">
                          {poke.species}
                        </p>
                      </div>

                      {/* Type Badges */}
                      <div className="flex items-center justify-center gap-1 mt-2">
                        {poke.types.map((t) => {
                          const tStyle = POKEMON_TYPE_COLORS[t] || POKEMON_TYPE_COLORS['Normal'];
                          return (
                            <span
                              key={t}
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shadow-sm ${tStyle.bg} ${tStyle.text}`}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>

                      {/* Held item footnote */}
                      <div className="mt-2 pt-1 border-t border-slate-800/80 text-[10px] text-slate-400 font-tech flex items-center justify-between">
                        <span className="truncate">{poke.heldItem || 'Sin Objeto'}</span>
                        <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Gym Badges (8 Spaces), Elite 4, Champion Trophy (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 3. GYM NEW GENERATIONS / GYM LEGADOS (8 ESPACIOS EN BLANCO / MEDALLERO) */}
            <div className="relative rounded-2xl bg-slate-950/85 border border-slate-800 p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <span className={`font-pokedex text-xs sm:text-sm font-bold uppercase tracking-wider ${themeStyles.headerAccent} px-3 py-1 rounded-lg border`}>
                  {isRocket ? 'GYM LEGADOS (8 ESPACIOS)' : 'GYM NEW GENERATIONS (8 MEDALLAS)'}
                </span>
                <span className="text-[11px] font-tech text-amber-400 font-bold">
                  {earnedBadgesCount}/8 GANADAS
                </span>
              </div>

              {/* 8 Badges Grid (2 rows of 4) */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {trainer.gymBadges.map((badge) => (
                  <div
                    key={badge.id}
                    onClick={() => {
                      sounds.playBeep(700, 'sine', 0.05);
                      setSelectedBadge(badge);
                    }}
                    className={`relative rounded-2xl p-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      badge.isEarned
                        ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/80 shadow-[0_0_15px_rgba(250,204,21,0.25)] hover:scale-105'
                        : 'bg-slate-950 border border-slate-800 hover:border-slate-700 opacity-60'
                    }`}
                  >
                    {/* Badge number badge */}
                    <span className="absolute top-1 left-2 font-mono text-[10px] font-bold text-slate-400">
                      {badge.number}
                    </span>

                    {/* Badge Icon / Disc */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center my-1 border-2 transition ${
                        badge.isEarned
                          ? 'bg-radial from-amber-300/20 to-slate-900 border-amber-400 shadow-md text-2xl'
                          : 'bg-slate-900/60 border-slate-800 text-slate-600 text-lg'
                      }`}
                    >
                      {badge.isEarned ? (
                        <span>{badge.badgeIcon}</span>
                      ) : (
                        <Lock className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    {/* Name */}
                    <span className="text-[10px] font-pokedex font-bold text-slate-200 text-center truncate w-full">
                      {badge.name.replace('Medalla ', '')}
                    </span>
                    <span className="text-[9px] font-tech text-slate-400 text-center truncate w-full">
                      {badge.gymLeader}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tap badge info note */}
              <p className="text-[11px] text-slate-400 font-tech text-center mt-3">
                * Las medallas son acreditadas exclusivamente por los Líderes de Gimnasio.
              </p>
            </div>

            {/* 4. ÉLITE 4 (4 ESPACIOS LLAMATIVOS) */}
            <div className="relative rounded-2xl bg-slate-950/85 border border-slate-800 p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <span className={`font-pokedex text-xs sm:text-sm font-bold uppercase tracking-wider ${themeStyles.headerAccent} px-3 py-1 rounded-lg border`}>
                  {isRocket ? 'GENERALES ROCKET (4 SLOTS)' : 'ÉLITE 4 (4 ESPACIOS LLAMATIVOS)'}
                </span>
                <span className="text-[11px] font-tech text-purple-400 font-bold">
                  {earnedEliteCount}/4 DERROTADOS
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {trainer.eliteFour.map((elite, i) => (
                  <div
                    key={elite.id}
                    className={`rounded-xl p-2.5 text-center border transition ${
                      elite.isEarned
                        ? 'bg-purple-950/60 border-purple-400/80 text-purple-200 shadow-lg shadow-purple-950/40'
                        : 'bg-slate-950 border-slate-800/80 text-slate-600'
                    }`}
                  >
                    <div className="text-base sm:text-xl font-bold mb-0.5">
                      {elite.isEarned ? '⭐' : '◇'}
                    </div>
                    <span className="block text-[10px] font-pokedex font-bold truncate">
                      {elite.name.replace('Insignia ', '')}
                    </span>
                    <span className="block text-[9px] font-tech text-slate-400 truncate">
                      {elite.member}
                    </span>
                    <span className="block text-[8px] font-mono mt-1 font-bold text-slate-300">
                      {elite.isEarned ? 'VENCIDO' : 'PENDIENTE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. CAMPEÓN DE LA LIGA POKÉMON & BOTÓN RETAR AL ALTO MANDO */}
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/50 p-4 sm:p-5 shadow-2xl text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="font-pokedex text-xs sm:text-sm font-black uppercase text-amber-300 tracking-wider">
                  ¡CAMPEÓN DE LA LIGA POKÉMON!
                </h3>
              </div>

              {trainer.champion.isChampion ? (
                <div className="bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border border-yellow-400/60 p-3.5 rounded-xl space-y-1 shadow-inner">
                  <span className="text-xs font-pokedex font-bold text-yellow-200 block">
                    ¡FELICIDADES ENTRENADOR!
                  </span>
                  <p className="text-[11px] font-tech text-slate-200">
                    Reconocimiento oficial por ser el Campeón Máximo de la Liga.
                  </p>
                  {trainer.champion.earnedDate && (
                    <span className="text-[10px] font-mono text-amber-300 block">
                      Consagrado el: {trainer.champion.earnedDate}
                    </span>
                  )}
                </div>
              ) : (
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-xs font-tech text-slate-400">
                  Completa las 8 medallas de gimnasio y vence al Alto Mando para obtener el reconocimiento oficial de Campeón de la Liga.
                </div>
              )}

              {/* Botón "RETAR AL ALTO MANDO" as requested in attachment */}
              <button
                onClick={() => {
                  sounds.playBeep(900, 'square', 0.1);
                  setShowEliteChallengeModal(true);
                }}
                className={`w-full py-3 px-4 rounded-xl font-pokedex text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                  canChallengeElite
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white border border-amber-400/50 shadow-red-950/50 animate-pulse'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <Swords className="w-4 h-4" />
                <span>RETAR AL ALTO MANDO</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card Footer Stamp */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-tech text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CERTIFICADO OFICIAL N.° {trainer.trainerIdNumber}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>SISTEMA DE LIGA REGISTRADA</span>
            <span>TEMPORADA 2026</span>
          </div>
        </div>
      </div>

      {/* Badge Detail Modal when user clicks any of the 8 badges */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-amber-500/60 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="text-center space-y-2">
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl border-2 ${
                  selectedBadge.isEarned
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                {selectedBadge.isEarned ? selectedBadge.badgeIcon : <Lock className="w-8 h-8" />}
              </div>
              <h3 className="font-pokedex text-base font-bold text-white">
                #{selectedBadge.number} {selectedBadge.name}
              </h3>
              <p className="text-xs font-tech text-slate-300">
                Gimnasio Oficial de {selectedBadge.city} • Tipo {selectedBadge.type}
              </p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs font-tech">
              <div className="flex justify-between">
                <span className="text-slate-400">Líder Oficial:</span>
                <span className="font-bold text-slate-200">{selectedBadge.gymLeader}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estado:</span>
                <span className={`font-bold ${selectedBadge.isEarned ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedBadge.isEarned ? 'GANADA Y ACREDITADA ✓' : 'NO CONQUISTADA'}
                </span>
              </div>
              {selectedBadge.isEarned && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fecha de Victoria:</span>
                    <span className="font-mono text-amber-300">{selectedBadge.earnedDate || 'Reciente'}</span>
                  </div>
                  {selectedBadge.battleNotes && (
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-slate-400 block text-[10px]">VEREDICTO DEL LÍDER:</span>
                      <p className="italic text-slate-300 mt-0.5">"{selectedBadge.battleNotes}"</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Retar al Alto Mando Status Modal */}
      {showEliteChallengeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-pokedex text-sm font-bold text-white tracking-wider">
                  SOLICITUD: RETAR AL ALTO MANDO
                </h3>
                <p className="text-[11px] font-tech text-slate-400">Revisión de requisitos de la Liga Pokémon</p>
              </div>
            </div>

            {canChallengeElite ? (
              <div className="bg-emerald-950/50 border border-emerald-500/50 p-4 rounded-xl space-y-2 text-xs font-tech text-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡ACCESO APROBADO A LA MESETA AÑIL!</span>
                </div>
                <p>
                  Has conquistado las 8 Medallas de Gimnasio oficiales. Tu equipo de 6 criaturas está certificado para enfrentar a los 4 Miembros del Alto Mando y al Campeón.
                </p>
                <div className="pt-2 text-[11px] text-slate-300">
                  Preséntate ante el Juez del Alto Mando en el <strong>Panel de Líder</strong> para certificar cada una de tus 4 victorias.
                </div>
              </div>
            ) : (
              <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl space-y-2 text-xs font-tech text-amber-200">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>REQUISITOS INCOMPLETOS ({earnedBadgesCount}/8 Medallas)</span>
                </div>
                <p>
                  Para retar al Alto Mando necesitas ganar las 8 medallas oficiales de gimnasio. Te faltan <strong>{8 - earnedBadgesCount} medalla(s)</strong>.
                </p>
                <p className="text-slate-400 text-[11px]">
                  Pide a los Líderes de Gimnasio que certifiquen tus victorias en el <strong>Panel de Líder</strong>.
                </p>
              </div>
            )}

            <button
              onClick={() => setShowEliteChallengeModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal: Delete Trainer Card */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border-2 border-red-500/80 p-6 shadow-2xl text-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-pokedex text-sm font-bold text-white tracking-wider">
                  ¿ELIMINAR ESTA FICHA POKÉDEX?
                </h4>
                <p className="text-xs text-slate-400 font-tech">Esta acción es permanente e irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-tech leading-relaxed">
              Se eliminará permanentemente la ficha de <strong className="text-white">{trainer.name}</strong> (<span className="text-cyan-300 font-mono">{trainer.inGameName}</span>), su equipo de 6 criaturas y todo el progreso de medallas.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-tech font-bold text-slate-300 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  onDeleteTrainer?.(trainer.id);
                }}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-pokedex font-bold text-white shadow-lg shadow-red-950/50 transition active:scale-95"
              >
                Sí, Eliminar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
