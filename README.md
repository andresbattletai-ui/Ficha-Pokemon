# PokéCard Pass — Ficha de Entrenador Pokémon

Aplicación web PWA estilo Pokédex para crear y certificar fichas de entrenador Pokémon, equipos de 6 criaturas, medallas de gimnasio y salas de combate.

## Despliegue en GitHub + Vercel + Firebase (`fichapokemon-e3cde`)

1. **Subir a GitHub:**
   ```bash
   git push -u origin main
   ```
2. **Variables de entorno en Vercel** (obtener en Firebase Console → Proyecto `fichapokemon-e3cde` → Configuración del proyecto → App Web):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN` (`fichapokemon-e3cde.firebaseapp.com`)
   - `VITE_FIREBASE_PROJECT_ID` (`fichapokemon-e3cde`)
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. **Firebase Auth & Reglas Firestore:**
   - En Firebase Console (`fichapokemon-e3cde`) → **Authentication** → **Sign-in method**, activa **Google**.
   - En **Authentication** → **Settings** → **Authorized domains**, agrega `ficha-pokemon.vercel.app`.
   - Despliega `firestore.rules`:
     ```bash
     npx firebase deploy --only firestore:rules --project fichapokemon-e3cde
     ```
