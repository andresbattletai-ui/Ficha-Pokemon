import React from 'react';
import { PokemonMember } from '../types/pokemon';
import { POKEMON_TYPE_COLORS } from '../data/pokemonCatalog';
import { X, Sparkles, Shield, Zap, Heart, Sword, FastForward, Activity } from 'lucide-react';

interface Props {
  pokemon: PokemonMember | null;
  onClose: () => void;
}

export const PokemonDetailModal: React.FC<Props> = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  const statConfig = [
    { label: 'PS (HP)', key: 'hp', val: pokemon.stats.hp, ev: pokemon.evs.hp, color: 'bg-emerald-500', icon: Heart },
    { label: 'Ataque', key: 'atk', val: pokemon.stats.atk, ev: pokemon.evs.atk, color: 'bg-red-500', icon: Sword },
    { label: 'Defensa', key: 'def', val: pokemon.stats.def, ev: pokemon.evs.def, color: 'bg-amber-500', icon: Shield },
    { label: 'Atq. Esp.', key: 'spa', val: pokemon.stats.spa, ev: pokemon.evs.spa, color: 'bg-cyan-500', icon: Zap },
    { label: 'Def. Esp.', key: 'spd', val: pokemon.stats.spd, ev: pokemon.evs.spd, color: 'bg-blue-500', icon: Shield },
    { label: 'Velocidad', key: 'spe', val: pokemon.stats.spe, ev: pokemon.evs.spe, color: 'bg-pink-500', icon: FastForward },
  ];

  const totalBase = pokemon.stats.hp + pokemon.stats.atk + pokemon.stats.def + pokemon.stats.spa + pokemon.stats.spd + pokemon.stats.spe;
  const totalEVs = pokemon.evs.hp + pokemon.evs.atk + pokemon.evs.def + pokemon.evs.spa + pokemon.evs.spd + pokemon.evs.spe;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Futuristic top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-pokedex text-xs font-bold text-cyan-400 tracking-wider">
              REGISTRO POKÉDEX #{String(pokemon.pokedexNumber).padStart(3, '0')}
            </span>
            {pokemon.isShiny && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-bold">
                <Sparkles className="w-3 h-3" /> SHINY
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Header with image and basic info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center bg-radial from-slate-800/80 to-transparent rounded-2xl border border-slate-700/60 p-2">
              <img
                src={pokemon.artworkUrl || pokemon.spriteUrl}
                alt={pokemon.species}
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              />
              <span className="absolute bottom-1 right-2 font-pokedex text-xs font-bold text-slate-300">
                Nv. {pokemon.level}
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="font-pokedex text-xl font-bold text-white tracking-wide">
                  {pokemon.nickname || pokemon.species}
                </h3>
                {pokemon.nickname && pokemon.nickname !== pokemon.species && (
                  <span className="text-xs text-slate-400 font-tech">({pokemon.species})</span>
                )}
              </div>

              {/* Types */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                {pokemon.types.map((type) => {
                  const style = POKEMON_TYPE_COLORS[type] || POKEMON_TYPE_COLORS['Normal'];
                  return (
                    <span
                      key={type}
                      className={`px-3 py-0.5 rounded-md text-xs font-bold tracking-wide shadow-sm ${style.bg} ${style.text} border ${style.border}`}
                    >
                      {type.toUpperCase()}
                    </span>
                  );
                })}
              </div>

              {/* Attributes */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-tech text-slate-300">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">HABILIDAD</span>
                  <span className="font-bold text-slate-100">{pokemon.ability || 'Presión'}</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">OBJETO EQUIPADO</span>
                  <span className="font-bold text-amber-300">{pokemon.heldItem || 'Ninguno'}</span>
                </div>
                <div className="col-span-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">NATURALEZA</span>
                  <span className="font-bold text-slate-200">{pokemon.nature || 'Firme (+Atk, -SpA)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Base Stats & EVs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="font-pokedex text-xs font-bold text-slate-200 tracking-wider">
                  ESTADÍSTICAS BASE & DISTRIBUCIÓN DE EVs
                </h4>
              </div>
              <div className="text-[11px] font-tech text-slate-400">
                BST: <span className="font-bold text-cyan-400">{totalBase}</span> | EVs: <span className="font-bold text-amber-400">{totalEVs}/508</span>
              </div>
            </div>

            <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
              {statConfig.map((s) => {
                const StatIcon = s.icon;
                const percentage = Math.min(100, Math.round((s.val / 200) * 100));
                return (
                  <div key={s.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-tech">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <StatIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-100 font-mono text-xs">{s.val}</span>
                        {s.ev > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                            +{s.ev} EV
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div
                        className={`h-full ${s.color} transition-all duration-500 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Moves / Ataques */}
          <div className="space-y-2.5">
            <h4 className="font-pokedex text-xs font-bold text-slate-200 tracking-wider flex items-center gap-2">
              <Sword className="w-4 h-4 text-rose-400" />
              MOVIMIENTOS REGISTRADOS (4 SLOTS)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pokemon.moves && pokemon.moves.length > 0 ? (
                pokemon.moves.map((move, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-slate-900/80 px-3.5 py-2.5 rounded-lg border border-slate-800 font-tech"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-slate-100 text-xs tracking-wide">
                        {move}
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono">OFICIAL</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-xs text-slate-500 py-3">
                  Sin movimientos registrados
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-3.5 bg-slate-900/60 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition active:scale-95"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
