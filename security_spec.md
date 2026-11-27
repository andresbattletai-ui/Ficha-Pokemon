# Security Specification — PokéCard Pass (`fichapokemon-e3cde`)

## 1. Data Invariants
1. **Default-Deny Baseline:** Every Firestore path outside explicitly declared collections is denied for both read and write.
2. **Verified Identity:** Standard writes require `request.auth != null && request.auth.token.email_verified == true`.
3. **Owner & Admin Isolation:** Trainers (`trainers/{trainerId}`) and private user profiles (`users/{userId}/private/profile`) can only be written by their owner (`ownerId == request.auth.uid`) or verified admin (`isAdmin()`).
4. **Trainer Lock Integrity:** Once `existing().isLocked == true`, non-admin owners cannot mutate `team`, `name`, `inGameName`, or `isLocked`.
5. **No Orphaned Challenges:** Creating `challenges/{challengeId}` requires `exists(/databases/$(database)/documents/trainers/$(incoming().trainerId))` and ownership of that trainer.
6. **Terminal Challenge State Lock:** Once a challenge reaches `victoria_retador`, `victoria_lider`, or `cancelado`, only `isAdmin()` can modify it.
7. **PII & Secret Isolation:** Emails live exclusively in `users/{userId}/private/profile`, strictly verified against `request.auth.token.email`, readable only by the owner or verified admin. Gym leader `pin`/`password` and `adminPin` are never stored in public collections.
8. **Temporal, URL & Structural Integrity:** `createdAt` and `updatedAt` must equal `request.time`; `ownerId` and `createdAt` are immutable; URLs require `https?://` or `/assets/`; colors require valid hex codes; all strings, maps, and arrays enforce strict schema and `.size()` bounds.

## 2. Red Team Audit & Hardening Delta Report
- **URL Scheme Injection Guard:** Added `isValidSafeUrl()` to reject `javascript:` or `data:` URIs on `avatarUrl` and `trainerAvatar`.
- **Hex Color Validation:** Added `isValidHexColor()` on `badgeColor`, `primaryColor`, and `accentColor`.
- **Nested Map Schema Guards:** Added `isValidChampionRecord()` and `isValidBattleMessage()` so attackers cannot inject arbitrary oversized nested fields inside `champion` or `battleMessages[0]`.
- **Privilege Escalation Prevention:** Blocked self-promotion on `trainers` create (`incoming().champion.isChampion == false`), restricted `admins` create/delete strictly to `isBootstrapAdmin()` (preventing horizontal admin tampering and self-deletion), and blocked unauthorized `leaderOwnerId` / `badgeAwarded` injection on `challenges` create.
- **Private Profile Strict Binding:** Enforced `docId == 'profile'` and `data.email == request.auth.token.email` on `users/{userId}/private/profile`.
- **Client Write Alignment (`src/services/firestoreSync.ts`):** Replaced `setDoc(..., { merge: true })` updates with `getDoc` + `setDoc` (create) / `updateDoc` (update) so `createdAt` remains immutable and locked trainers only update `['theme', 'quote', 'updatedAt']`.

## 3. The "Dirty Dozen" Attack Payloads
1. **Unauthenticated Write (`trainers/t-1`)**: Anonymous/null auth attempts creating a trainer -> `PERMISSION_DENIED`.
2. **Unverified Email Admin Spoof (`leagueSettings/main`)**: Token claims `email: "andresomana3@gmail.com"` with `email_verified: false` -> `PERMISSION_DENIED`.
3. **Owner Spoofing on Create (`trainers/t-2`)**: User `uid-A` tries creating with `ownerId: "uid-B"` -> `PERMISSION_DENIED`.
4. **Shadow Ghost Field (`trainers/t-3`)**: Valid user sends extra field `isAdmin: true` -> `PERMISSION_DENIED`.
5. **Path ID Poisoning (`trainers/bad$$id!...`)**: Malformed or oversized document ID -> `PERMISSION_DENIED`.
6. **Denial-of-Wallet Oversized String (`trainers/t-4`)**: `quote` longer than 200 chars -> `PERMISSION_DENIED`.
7. **Unbounded Team Array (`trainers/t-5`)**: `team` array with 7 Pokemon instead of max 6 -> `PERMISSION_DENIED`.
8. **Mutating Locked Trainer Team (`trainers/t-locked`)**: Non-admin updates `team` when `existing().isLocked == true` -> `PERMISSION_DENIED`.
9. **Orphan Challenge Create (`challenges/c-orphan`)**: Challenge references nonexistent `trainerId` -> `PERMISSION_DENIED`.
10. **Terminal State Reopen (`challenges/c-done`)**: Non-admin tries changing `status` after `victoria_retador` -> `PERMISSION_DENIED`.
11. **Client Timestamp Forgery (`challenges/c-time`)**: Payload provides fake `createdAt` string instead of `request.time` -> `PERMISSION_DENIED`.
12. **Cross-User Private PII Read (`users/uid-B/private/profile`)**: User `uid-A` reads `uid-B` private email profile -> `PERMISSION_DENIED`.
