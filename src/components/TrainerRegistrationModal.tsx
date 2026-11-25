import React, { useState } from 'react';
import { TrainerProfile, PokemonMember, CardTheme } from '../types/pokemon';
import { POPULAR_POKEMON, DEFAULT_AVATARS, INITIAL_GYM_BADGES, INITIAL_ELITE_FOUR, CatalogPokemon } from '../data/pokemonCatalog';
import { searchPokemonOnline } from '../services/pokeApiService';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  X,
  Lock,
  Sparkles,
  Upload,
  Search,
  Plus,
  ShieldAlert,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Heart,
  Sword,
  Shield,
  Zap,
  FastForward,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegisterTrainer: (newTrainer: TrainerProfile) => void;
}

export const TrainerRegistrationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRegisterTrainer,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [validationError, setValidationError] = useState('');

  // Trainer profile state
  const [name, setName] = useState('');
  const [inGameName, setInGameName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATARS[0].url);
  const [region, setRegion] = useState('Liga New Generations');
  const [theme, setTheme] = useState<CardTheme>('cyan-league');

  // 6 Pokemon Team state
  const [team, setTeam] = useState<PokemonMember[]>(
    POPULAR_POKEMON.slice(0, 6).map((cat, i) => ({
      slot: i + 1,
      species: cat.name,
      pokedexNumber: cat.id,
      nickname: cat.name,
      level: 70,
      gender: 'male',
      isShiny: false,
      spriteUrl: cat.spriteUrl,
      artworkUrl: cat.artworkUrl,
      types: cat.types,
      ability: cat.ability,
      nature: 'Firme (+Atk, -SpA)',
      heldItem: 'Restos',
      stats: { hp: cat.hp, atk: cat.atk, def: cat.def, spa: cat.spa, spd: cat.spd, spe: cat.spe },
      evs: { hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252 },
      moves: [...cat.moves],
    }))
  );

  const [activeSlot, setActiveSlot] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CatalogPokemon[]>([]);
  const [searchError, setSearchError] = useState('');

  if (!isOpen) return null;

  const currentPokemon = team.find((p) => p.slot === activeSlot) || team[0];

  const handleUpdateCurrentPokemon = (patch: Partial<PokemonMember>) => {
    setTeam((prev) =>
      prev.map((m) => (m.slot === activeSlot ? { ...m, ...patch } : m))
    );
  };

  const handleSearchPokemon = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError('');
    try {
      const match = await searchPokemonOnline(searchQuery);
      if (match) {
        setSearchResults([match]);
      } else {
        setSearchError(`No se encontró "${searchQuery}". Revisa el nombre en inglés o número.`);
      }
    } catch {
      setSearchError('Error al consultar PokéAPI.');
    } finally {
      setIsSearching(false);
    }
  };

  const applySelectedPokemon = (cat: CatalogPokemon) => {
    handleUpdateCurrentPokemon({
      species: cat.name,
      pokedexNumber: cat.id,
      nickname: cat.name,
      artworkUrl: cat.artworkUrl,
      spriteUrl: cat.spriteUrl,
      types: cat.types,
      ability: cat.ability,
      stats: { hp: cat.hp, atk: cat.atk, def: cat.def, spa: cat.spa, spd: cat.spd, spe: cat.spe },
      moves: [...cat.moves],
    });
    sounds.playBeep(880, 'sine', 0.08);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setAvatarUrl(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = () => {
    setValidationError('');
    if (!name.trim()) {
      setValidationError('Por favor ingresa tu Nombre Real de Entrenador.');
      sounds.playBeep(260, 'sawtooth', 0.15);
      setStep(1);
      return;
    }
    if (!inGameName.trim()) {
      setValidationError('Por favor ingresa tu Nombre en el Juego (IGN / @ws).');
      sounds.playBeep(260, 'sawtooth', 0.15);
      setStep(1);
      return;
    }

    const randomId = Math.floor(10000 + Math.random() * 90000);
    const dateFormatted = new Date().toLocaleDateString('es-ES');

    const newTrainer: TrainerProfile = {
      id: `trainer-${Date.now()}`,
      name: name.trim(),
      inGameName: inGameName.trim().startsWith('@') ? inGameName.trim() : `@${inGameName.trim()}`,
      trainerIdNumber: `${randomId}-LG`,
      registrationDate: dateFormatted,
      avatarUrl: avatarUrl || DEFAULT_AVATARS[0].url,
      region,
      theme,
      isLocked: true, // Se sella permanentemente para el torneo/liga
      lockedAt: new Date().toISOString(),
      team,
      gymBadges: INITIAL_GYM_BADGES.map((b) => ({ ...b, isEarned: false })),
      eliteFour: INITIAL_ELITE_FOUR.map((e) => ({ ...e, isEarned: false })),
      champion: {
        isChampion: false,
        title: 'Aspirante de la Liga Pokémon',
      },
    };

    sounds.playLockSound();
    sounds.playRegisterFanfare();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });

    onRegisterTrainer(newTrainer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border-2 border-cyan-500/60 shadow-2xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-pokedex text-sm sm:text-base font-bold text-white tracking-wider">
                REGISTRO & CERTIFICACIÓN DE FICHA DE ENTRENADOR
              </h3>
              <p className="text-[11px] font-tech text-slate-400">
                Paso {step} de 2: {step === 1 ? 'Datos del Entrenador' : 'Equipo de 6 Pokémon & Estadísticas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official League Rule Warning Banner */}
        <div className="bg-amber-950/50 border-b border-amber-500/40 px-6 py-2.5 flex items-center gap-2.5 text-xs font-tech text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Regla Oficial de la Liga:</strong> Una vez completado el registro, tu Ficha quedará <strong>SELLADA Y BLOQUEADA</strong> contra modificaciones. Las medallas serán acreditadas exclusivamente por los Líderes de Gimnasio.
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-4">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/70 text-rose-300 text-xs font-tech flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: TRAINER DETAILS */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-pokedex font-bold text-slate-300 mb-1.5">
                    NOMBRE REAL DEL ENTRENADOR:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Andrés Omaña"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-sm font-tech text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-pokedex font-bold text-slate-300 mb-1.5">
                    NOMBRE DE JUEGO / WHATSAPP (IGN):
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. @ws_andres o RedMaster"
                    value={inGameName}
                    onChange={(e) => setInGameName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-sm font-mono text-cyan-300 outline-none"
                  />
                </div>
              </div>

              {/* Avatar Selector or Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-pokedex font-bold text-slate-300">
                  FOTO DE PERFIL / AVATAR:
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-cyan-400 overflow-hidden flex-shrink-0">
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <span className="text-xs font-tech text-slate-400 block">
                      Selecciona un avatar clásico o sube tu propia foto desde tu dispositivo:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {DEFAULT_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setAvatarUrl(av.url)}
                          className={`w-9 h-9 rounded-lg border overflow-hidden p-0.5 transition ${
                            avatarUrl === av.url ? 'border-cyan-400 ring-2 ring-cyan-400/50' : 'border-slate-700 opacity-60 hover:opacity-100'
                          }`}
                          title={av.name}
                        >
                          <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                        </button>
                      ))}

                      {/* File upload input */}
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-tech text-slate-200 cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Subir Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCustomImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme & Region Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-pokedex font-bold text-slate-300 mb-1.5">
                    REGIÓN / LIGA:
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-tech text-slate-200 outline-none"
                  >
                    <option value="Liga New Generations">Liga New Generations</option>
                    <option value="Ruta del Legado Rocket">Ruta del Legado Rocket</option>
                    <option value="Kanto & Meseta Añil">Kanto & Meseta Añil</option>
                    <option value="Johto League">Johto League</option>
                    <option value="Hoenn Championship">Hoenn Championship</option>
                    <option value="Sinnoh League">Sinnoh League</option>
                    <option value="Paldea Teracristal">Paldea Teracristal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-pokedex font-bold text-slate-300 mb-1.5">
                    TEMA VISUAL DE LA FICHA:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-tech">
                    <button
                      type="button"
                      onClick={() => setTheme('cyan-league')}
                      className={`p-2 rounded-xl border text-center transition ${
                        theme === 'cyan-league' ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 font-bold' : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      Cyan New Gen
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('rocket-crimson')}
                      className={`p-2 rounded-xl border text-center transition ${
                        theme === 'rocket-crimson' ? 'border-red-500 bg-red-950/60 text-red-200 font-bold' : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      Rocket Legados
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: 6 POKEMON ROSTER SETUP */
            <div className="space-y-6">
              {/* 6 Slot Navigator Tabs */}
              <div className="grid grid-cols-6 gap-2">
                {team.map((poke) => (
                  <button
                    key={poke.slot}
                    type="button"
                    onClick={() => setActiveSlot(poke.slot)}
                    className={`p-2 rounded-xl border flex flex-col items-center transition ${
                      activeSlot === poke.slot
                        ? 'border-cyan-400 bg-cyan-950/70 shadow-lg shadow-cyan-950/40'
                        : 'border-slate-800 bg-slate-950 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Slot {poke.slot}
                    </span>
                    <img
                      src={poke.spriteUrl}
                      alt={poke.species}
                      className="w-10 h-10 object-contain my-1"
                    />
                    <span className="text-[10px] font-pokedex font-bold text-slate-200 truncate w-full text-center">
                      {poke.nickname || poke.species}
                    </span>
                  </button>
                ))}
              </div>

              {/* Slot Editor Body */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-5">
                {/* Search / Change Pokemon */}
                <div className="space-y-2">
                  <label className="block text-xs font-pokedex font-bold text-slate-300">
                    SELECCIONAR ESPECIE O BUSCAR EN POKÉDEX:
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Buscar por nombre (ej. Lucario, Gengar, Rayquaza, 6)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchPokemon()}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-tech text-white outline-none"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    <button
                      type="button"
                      onClick={handleSearchPokemon}
                      disabled={isSearching}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs font-tech text-white transition disabled:opacity-50"
                    >
                      {isSearching ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>
                  {searchError && <p className="text-xs text-rose-400 font-tech">{searchError}</p>}

                  {/* Search result preview or Popular quick picks */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    <span className="text-[10px] font-tech text-slate-400 shrink-0">Populares:</span>
                    {POPULAR_POKEMON.slice(0, 8).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => applySelectedPokemon(cat)}
                        className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-tech text-slate-300 whitespace-nowrap"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={searchResults[0].spriteUrl} alt="" className="w-8 h-8 object-contain" />
                        <span className="font-pokedex text-xs font-bold text-white">
                          #{searchResults[0].id} {searchResults[0].name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          applySelectedPokemon(searchResults[0]);
                          setSearchResults([]);
                          setSearchQuery('');
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs font-tech"
                      >
                        Asignar al Slot {activeSlot}
                      </button>
                    </div>
                  )}
                </div>

                {/* Nickname, Level, Shiny */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-tech text-slate-400 mb-1">MOTE / APODO:</label>
                    <input
                      type="text"
                      value={currentPokemon.nickname}
                      onChange={(e) => handleUpdateCurrentPokemon({ nickname: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-tech text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-tech text-slate-400 mb-1">NIVEL (1 - 100):</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={currentPokemon.level}
                      onChange={(e) => handleUpdateCurrentPokemon({ level: Number(e.target.value) || 50 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 outline-none"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateCurrentPokemon({ isShiny: !currentPokemon.isShiny })}
                      className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-tech font-bold transition ${
                        currentPokemon.isShiny
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{currentPokemon.isShiny ? 'VARIOPINTO ✨ (SHINY)' : 'NORMAL'}</span>
                    </button>
                  </div>
                </div>

                {/* Ability, Nature, Held Item */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-tech text-slate-400 mb-1">HABILIDAD:</label>
                    <input
                      type="text"
                      value={currentPokemon.ability}
                      onChange={(e) => handleUpdateCurrentPokemon({ ability: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-tech text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-tech text-slate-400 mb-1">NATURALEZA:</label>
                    <input
                      type="text"
                      value={currentPokemon.nature}
                      onChange={(e) => handleUpdateCurrentPokemon({ nature: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-tech text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-tech text-slate-400 mb-1">OBJETO EQUIPADO:</label>
                    <input
                      type="text"
                      value={currentPokemon.heldItem}
                      onChange={(e) => handleUpdateCurrentPokemon({ heldItem: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-tech text-amber-300 outline-none"
                    />
                  </div>
                </div>

                {/* 4 Moves */}
                <div className="space-y-2">
                  <label className="block text-xs font-pokedex font-bold text-slate-300">
                    4 MOVIMIENTOS REGISTRADOS:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((moveIndex) => (
                      <input
                        key={moveIndex}
                        type="text"
                        placeholder={`Movimiento ${moveIndex + 1}`}
                        value={currentPokemon.moves[moveIndex] || ''}
                        onChange={(e) => {
                          const newMoves = [...currentPokemon.moves];
                          newMoves[moveIndex] = e.target.value;
                          handleUpdateCurrentPokemon({ moves: newMoves });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-tech text-slate-200 outline-none"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-tech font-bold text-slate-200 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás a Datos</span>
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={() => {
                if (!name.trim()) {
                  setValidationError('Por favor ingresa tu Nombre Real antes de continuar.');
                  sounds.playBeep(260, 'sawtooth', 0.15);
                  return;
                }
                setValidationError('');
                setStep(2);
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-pokedex font-bold text-white transition active:scale-95"
            >
              <span>Configurar Equipo (6 Pokémon)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-xs font-pokedex font-black text-white shadow-lg shadow-red-900/40 border border-amber-400/50 transition active:scale-95"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              <span>REGISTRAR Y SELLAR FICHA</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
