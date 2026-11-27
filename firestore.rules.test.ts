/**
 * Security Rules Dirty Dozen Verification Matrix for PokéCard Pass
 * Intended for verification against the Firebase Firestore Rules Emulator
 * using @firebase/rules-unit-testing when running emulator tests locally.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  collectionPath: string;
  operation: 'create' | 'update' | 'get' | 'list';
  expected: 'PERMISSION_DENIED';
  payload?: Record<string, unknown>;
}

export const DIRTY_DOZEN_CASES: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Trainer Create',
    collectionPath: 'trainers/trainer-unauth',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { id: 'trainer-unauth', ownerId: 'anon', name: 'Ash' },
  },
  {
    id: 2,
    name: 'Unverified Email Admin Spoof',
    collectionPath: 'leagueSettings/main',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { leagueName: 'Hacked League' },
  },
  {
    id: 3,
    name: 'Owner Spoofing on Create',
    collectionPath: 'trainers/trainer-spoof',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { id: 'trainer-spoof', ownerId: 'victim-uid', name: 'Spoofer' },
  },
  {
    id: 4,
    name: 'Shadow Ghost Field Injection',
    collectionPath: 'trainers/trainer-ghost',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { id: 'trainer-ghost', ownerId: 'attacker-uid', isAdmin: true },
  },
  {
    id: 5,
    name: 'Path ID Poisoning',
    collectionPath: 'trainers/invalid$$id',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { id: 'invalid$$id', ownerId: 'attacker-uid' },
  },
  {
    id: 6,
    name: 'Oversized Quote Payload',
    collectionPath: 'trainers/trainer-big',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { quote: 'X'.repeat(500) },
  },
  {
    id: 7,
    name: 'Oversized Team Array (>6)',
    collectionPath: 'trainers/trainer-7team',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { team: [{}, {}, {}, {}, {}, {}, {}] },
  },
  {
    id: 8,
    name: 'Mutate Sealed Trainer Team',
    collectionPath: 'trainers/trainer-locked',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { team: [], isLocked: false },
  },
  {
    id: 9,
    name: 'Orphaned Challenge Without Existing Trainer',
    collectionPath: 'challenges/chal-orphan',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { trainerId: 'nonexistent-trainer-id', status: 'pendiente' },
  },
  {
    id: 10,
    name: 'Reopen Terminal Challenge State',
    collectionPath: 'challenges/chal-finished',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { status: 'pendiente' },
  },
  {
    id: 11,
    name: 'Client Forged Timestamp',
    collectionPath: 'challenges/chal-time',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { createdAt: '2020-01-01T00:00:00Z' },
  },
  {
    id: 12,
    name: 'Cross-User Private PII Read',
    collectionPath: 'users/victim-uid/private/profile',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
  },
];
