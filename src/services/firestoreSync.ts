import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import {
  auth,
  db,
  handleFirestoreError,
  isFirebaseConfigured,
  OperationType,
} from './firebaseConfig';
import type { GymChallenge, TrainerProfile } from '../types/pokemon';
import { sanitizeTrainer } from './storageService';

const VALID_ID_RE = /^[a-zA-Z0-9_\-]+$/;
const SAFE_URL_RE = /^(\/assets\/[a-zA-Z0-9_.\/\-]+|https?:\/\/[^\s]+)$/;

function clampString(val: unknown, maxLen: number, fallback = ''): string {
  const str = typeof val === 'string' ? val.trim() : fallback;
  return str.slice(0, maxLen);
}

function sanitizeSafeUrl(val: unknown, fallback: string): string {
  const str = clampString(val, 500, fallback);
  return SAFE_URL_RE.test(str) ? str : fallback;
}

function sanitizeDocId(id: string, prefix: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
  return VALID_ID_RE.test(cleaned) && cleaned.length > 0 ? cleaned : `${prefix}-${Date.now()}`;
}

export async function syncUserPrivateProfile(user: User): Promise<void> {
  if (!isFirebaseConfigured() || !db || !user.emailVerified || !user.email) return;
  const path = `users/${user.uid}/private/profile`;
  const ref = doc(db, 'users', user.uid, 'private', 'profile');
  try {
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        email: clampString(user.email, 200, user.email),
        displayName: clampString(user.displayName, 100, 'Entrenador'),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        displayName: clampString(user.displayName, 100, 'Entrenador'),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncTrainerToCloud(trainer: TrainerProfile): Promise<void> {
  const user = auth?.currentUser;
  if (!isFirebaseConfigured() || !db || !user || !user.emailVerified) return;

  const docId = sanitizeDocId(trainer.id, 'trainer');
  const path = `trainers/${docId}`;
  const ref = doc(db, 'trainers', docId);
  const clean = sanitizeTrainer(trainer);

  const defaultAvatar = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png';

  try {
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      await setDoc(ref, {
        id: docId,
        ownerId: user.uid,
        name: clampString(clean.name, 60, 'Entrenador'),
        inGameName: clampString(clean.inGameName, 40, '@entrenador'),
        trainerIdNumber: clampString(clean.trainerIdNumber, 32, '00001-LG'),
        registrationDate: clampString(clean.registrationDate, 32, '01/01/26'),
        avatarUrl: sanitizeSafeUrl(clean.avatarUrl, defaultAvatar),
        region: clampString(clean.region, 80, 'Liga Pokémon Champions'),
        quote: clampString(clean.quote, 200, '¡Listo para el combate!'),
        theme: clean.theme,
        isLocked: Boolean(clean.isLocked),
        ...(clean.lockedAt ? { lockedAt: clampString(clean.lockedAt, 40) } : {}),
        team: clean.team.slice(0, 6),
        gymBadges: clean.gymBadges.slice(0, 8),
        eliteFour: clean.eliteFour.slice(0, 4),
        champion: {
          isChampion: false,
          title: clampString(clean.champion?.title, 100, 'Aspirante de la Liga Pokémon'),
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const existingData = existing.data();
    if (existingData?.isLocked) {
      await updateDoc(ref, {
        theme: clean.theme,
        quote: clampString(clean.quote, 200, '¡Listo para el combate!'),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        name: clampString(clean.name, 60, 'Entrenador'),
        inGameName: clampString(clean.inGameName, 40, '@entrenador'),
        avatarUrl: sanitizeSafeUrl(clean.avatarUrl, defaultAvatar),
        region: clampString(clean.region, 80, 'Liga Pokémon Champions'),
        quote: clampString(clean.quote, 200, '¡Listo para el combate!'),
        theme: clean.theme,
        team: clean.team.slice(0, 6),
        isLocked: Boolean(clean.isLocked),
        ...(clean.lockedAt ? { lockedAt: clampString(clean.lockedAt, 40) } : {}),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTrainerFromCloud(trainerId: string): Promise<void> {
  const user = auth?.currentUser;
  if (!isFirebaseConfigured() || !db || !user || !user.emailVerified) return;

  const docId = sanitizeDocId(trainerId, 'trainer');
  const path = `trainers/${docId}`;
  try {
    await deleteDoc(doc(db, 'trainers', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncChallengeToCloud(challenge: GymChallenge): Promise<void> {
  const user = auth?.currentUser;
  if (!isFirebaseConfigured() || !db || !user || !user.emailVerified) return;

  const docId = sanitizeDocId(challenge.id, 'chal');
  const path = `challenges/${docId}`;
  const ref = doc(db, 'challenges', docId);
  const defaultAvatar = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png';

  const rawMessages = Array.isArray(challenge.battleMessages) && challenge.battleMessages.length > 0
    ? challenge.battleMessages.slice(-50)
    : [
        {
          id: `msg-${Date.now()}`,
          sender: 'system' as const,
          senderName: 'Sistema de Liga',
          text: 'Desafío registrado.',
          timestamp: '00:00',
        },
      ];

  const messages = rawMessages.map((m, idx) => ({
    id: sanitizeDocId(String(m.id || `msg-${idx}`), 'msg'),
    sender: m.sender === 'leader' || m.sender === 'system' ? m.sender : 'trainer',
    senderName: clampString(m.senderName, 80, 'Participante'),
    text: clampString(m.text, 500, '...'),
    timestamp: clampString(m.timestamp, 32, '00:00'),
  }));

  try {
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      await setDoc(ref, {
        id: docId,
        ownerId: user.uid,
        gymId: Number(challenge.gymId) || 1,
        gymName: clampString(challenge.gymName, 80, 'Gimnasio'),
        gymLeaderName: clampString(challenge.gymLeaderName, 80, 'Líder'),
        leaderUsername: clampString(challenge.leaderUsername, 40, 'lider'),
        trainerId: sanitizeDocId(challenge.trainerId, 'trainer'),
        trainerName: clampString(challenge.trainerName, 60, 'Entrenador'),
        trainerIgn: clampString(challenge.trainerIgn, 40, '@entrenador'),
        trainerAvatar: sanitizeSafeUrl(challenge.trainerAvatar, defaultAvatar),
        ...(challenge.pokemonChampionsRoomId
          ? { pokemonChampionsRoomId: clampString(challenge.pokemonChampionsRoomId, 64) }
          : {}),
        status: 'pendiente',
        battleMessages: messages,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        battleMessages: messages,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeUserTrainers(
  user: User,
  onData: (trainers: TrainerProfile[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured() || !db || !user.emailVerified) {
    return () => {};
  }
  const path = 'trainers';
  const q = query(collection(db, path), where('ownerId', '==', user.uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => sanitizeTrainer(d.data()));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}
