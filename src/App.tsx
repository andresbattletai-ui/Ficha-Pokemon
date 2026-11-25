/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  TrainerProfile,
  PokemonMember,
  CardTheme,
  GymLeaderAccount,
  GymChallenge,
} from './types/pokemon';
import {
  getStoredProfiles,
  getActiveProfile,
  setActiveProfileId,
  saveProfiles,
  getStoredGymLeaders,
  getActiveLeaderSession,
  getStoredChallenges,
  getLeagueSettings,
  deleteTrainerProfile,
} from './services/storageService';
import { sounds } from './utils/soundEffects';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { PokedexHeader } from './components/PokedexHeader';
import { TrainerCardView } from './components/TrainerCardView';
import { GymDirectoryView } from './components/GymDirectoryView';
import { PokemonDetailModal } from './components/PokemonDetailModal';
import { LeaderPortalModal } from './components/LeaderPortalModal';
import { SuperAdminModal } from './components/SuperAdminModal';
import { BattleRoomModal } from './components/BattleRoomModal';
import { TrainerRegistrationModal } from './components/TrainerRegistrationModal';
import { ShareExportModal } from './components/ShareExportModal';
import { Swords, CreditCard, Sparkles, Trophy, Shield, Gamepad2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'card' | 'gyms'>('card');
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [activeTrainer, setActiveTrainer] = useState<TrainerProfile | null>(null);
  const [gymLeaders, setGymLeaders] = useState<GymLeaderAccount[]>([]);
  const [activeLeader, setActiveLeader] = useState<GymLeaderAccount | null>(null);
  const [challenges, setChallenges] = useState<GymChallenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<GymChallenge | null>(null);

  // Modals state
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonMember | null>(null);
  const [showLeaderPortal, setShowLeaderPortal] = useState(false);
  const [showSuperAdmin, setShowSuperAdmin] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const isOnline = useOnlineStatus();
  const leagueSettings = getLeagueSettings();

  const reloadData = () => {
    const list = getStoredProfiles();
    setTrainers(list);
    const active = getActiveProfile();
    setActiveTrainer(active);
    setGymLeaders(getStoredGymLeaders());
    setActiveLeader(getActiveLeaderSession());
    setChallenges(getStoredChallenges());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleSelectTrainer = (id: string) => {
    setActiveProfileId(id);
    const found = trainers.find((t) => t.id === id);
    if (found) {
      setActiveTrainer(found);
      sounds.playBeep(750, 'sine', 0.08);
    }
  };

  const handleUpdateTrainer = (updated: TrainerProfile) => {
    setActiveTrainer(updated);
    const nextList = trainers.map((t) => (t.id === updated.id ? updated : t));
    setTrainers(nextList);
    saveProfiles(nextList);
  };

  const handleRegisterTrainer = (newTrainer: TrainerProfile) => {
    const nextList = [newTrainer, ...trainers];
    setTrainers(nextList);
    setActiveTrainer(newTrainer);
    setActiveProfileId(newTrainer.id);
    saveProfiles(nextList);
  };

  const handleDeleteTrainer = (id: string) => {
    const { remaining, active } = deleteTrainerProfile(id);
    setTrainers(remaining);
    setActiveTrainer(active);
    sounds.playBeep(450, 'sawtooth', 0.15);
  };

  const handleChangeTheme = (theme: CardTheme) => {
    if (!activeTrainer) return;
    const updated = { ...activeTrainer, theme };
    handleUpdateTrainer(updated);
    sounds.playBeep(850, 'sine', 0.06);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playBeep(900, 'triangle', 0.1);
  };

  if (!activeTrainer) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300 font-tech">
        Cargando Pokédex...
      </div>
    );
  }

  const activeChallengesCount = challenges.filter(
    (c) => c.status === 'pendiente' || c.status === 'en_combate'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Offline Toast */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/90 border border-amber-400 px-3 py-2 text-xs font-tech text-white shadow-xl backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span>Modo Sin Conexión — La Pokédex funciona con datos en caché.</span>
        </div>
      )}

      {/* Pokédex Header Bar with dual tab switch & access portals */}
      <PokedexHeader
        currentTab={currentTab}
        onTabChange={(tab) => {
          sounds.playBeep(800, 'sine', 0.06);
          setCurrentTab(tab);
        }}
        trainer={activeTrainer}
        allTrainers={trainers}
        activeLeader={activeLeader}
        activeChallengesCount={activeChallengesCount}
        onSelectTrainer={handleSelectTrainer}
        onOpenRegister={() => setShowRegisterModal(true)}
        onOpenLeaderPortal={() => setShowLeaderPortal(true)}
        onOpenSuperAdmin={() => setShowSuperAdmin(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onChangeTheme={handleChangeTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col items-center">
        
        {/* League Announcement Banner */}
        <div className="w-full max-w-6xl mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900/70 to-cyan-950/40 border border-slate-800 text-xs font-tech flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-300">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span>
              <strong>{leagueSettings.leagueName}:</strong> {leagueSettings.announcementText}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentTab === 'card' ? (
              <button
                onClick={() => setCurrentTab('gyms')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-tech font-bold text-xs shadow-md transition"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Ver Gimnasios Activos</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('card')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold text-xs shadow-md transition"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Ver Mi Ficha Pokédex</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: Master Trainer Card View */}
        {currentTab === 'card' && (
          <TrainerCardView
            trainer={activeTrainer}
            onOpenPokemonDetail={(poke) => setSelectedPokemon(poke)}
            onOpenAdmin={() => setShowLeaderPortal(true)}
            onOpenRegister={() => setShowRegisterModal(true)}
            onOpenShare={() => setShowShareModal(true)}
            onDeleteTrainer={handleDeleteTrainer}
          />
        )}

        {/* TAB 2: Gym Directory & Challenge Arena */}
        {currentTab === 'gyms' && (
          <GymDirectoryView
            gymLeaders={gymLeaders}
            activeTrainer={activeTrainer}
            challenges={challenges}
            onOpenBattleRoom={(chal) => setSelectedChallenge(chal)}
            onChallengeCreated={(chal) => {
              setChallenges((prev) => [chal, ...prev]);
            }}
          />
        )}
      </main>

      {/* MODALS */}
      
      {/* 1. Pokemon Detail Modal */}
      <PokemonDetailModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />

      {/* 2. Private Battle Room between Trainer & Gym Leader */}
      <BattleRoomModal
        isOpen={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        challenge={selectedChallenge}
        currentTrainer={activeTrainer}
        currentLeader={activeLeader}
        onTrainerUpdated={(updated) => handleUpdateTrainer(updated)}
        onChallengeUpdated={(updated) => {
          setSelectedChallenge(updated);
          setChallenges((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          );
        }}
      />

      {/* 3. Individual Gym Leader Portal */}
      <LeaderPortalModal
        isOpen={showLeaderPortal}
        onClose={() => setShowLeaderPortal(false)}
        activeLeader={activeLeader}
        onLeaderLogin={(leader) => {
          setActiveLeader(leader);
          setGymLeaders(getStoredGymLeaders());
        }}
        onLeaderLogout={() => {
          setActiveLeader(null);
        }}
        allChallenges={challenges}
        onOpenBattleRoom={(chal) => {
          setShowLeaderPortal(false);
          setSelectedChallenge(chal);
        }}
        onTrainerUpdated={(updated) => handleUpdateTrainer(updated)}
      />

      {/* 4. Super Admin General Control Center */}
      <SuperAdminModal
        isOpen={showSuperAdmin}
        onClose={() => setShowSuperAdmin(false)}
        onDataModified={reloadData}
      />

      {/* 5. Trainer Registration & Sealed Lock Modal */}
      <TrainerRegistrationModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegisterTrainer={handleRegisterTrainer}
      />

      {/* 6. Share and QR Modal */}
      <ShareExportModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        trainer={activeTrainer}
      />

      {/* Footer */}
      <footer className="w-full py-4 px-6 border-t border-slate-900 bg-slate-950/80 text-center text-xs font-tech text-slate-500">
        <p>
          PokéCard Pass • Ficha de Entrenador Pokémon & Sistema de Desafíos de Gimnasio Pokémon Champions • App PWA Instalable
        </p>
      </footer>
    </div>
  );
}
