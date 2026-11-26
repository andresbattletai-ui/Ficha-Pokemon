# 🔴 PokéCard Pass: Ficha de Entrenador Pokémon

> Aplicación web progresiva (**PWA**) instalable en teléfonos móviles y PC para la gestión de fichas oficiales de Entrenadores Pokémon, desafíos de gimnasios y salas privadas de **Pokémon Champions**.

---

## 🚀 Tecnologías Utilizadas

- **Frontend:** React 19 + TypeScript + Vite 8
- **Estilos:** Tailwind CSS v4 + Fuentes HUD Futuristas (Orbitron, Rajdhani, Teko)
- **PWA:** `vite-plugin-pwa` con Service Worker, caché offline y Web App Manifest
- **Efectos:** Canvas Confetti + Web Audio API (efectos de sonido sintetizados estilo Pokédex)
- **Hosting / Dominio:** Compatible con **Vercel** (`vercel.json` preconfigurado)
- **Base de Datos / Backend:** Compatible con **Firebase Firestore** (`firebase.json`, `firestore.rules`)

---

## 🌟 Características Principales

1. **Ficha Oficial de Entrenador (Estilo Pokédex)**:
   - Nombre real, IGN de juego / WhatsApp (`@ws`), N.° de ID de registro y Foto de perfil.
   - Equipo certificado de 6 Pokémon con artes oficiales, sprites, niveles, habilidades, objetos y variocolor (Shiny ✨).
   - Modal de estadísticas completas: PS, Ataque, Defensa, Atq. Esp., Def. Esp., Velocidad, reparto de EVs (hasta 508) y 4 ataques.
   - Sello oficial contra alteraciones indebidas.
   - Botón directo para **"Borrar Ficha"** con modal de confirmación en la misma app.

2. **Arena de Gimnasios & Desafíos**:
   - Directorio de todos los gimnasios con estado en tiempo real (**Abierto**, **En Batalla**, **Cerrado**).
   - Reto a líderes y creación automática de salas privadas de combate.

3. **Salas Privadas de Combate & ID de Pokémon Champions**:
   - Cada desafío abre una sala privada entre el Retador y el Líder.
   - El Líder ingresa la **ID de Sala de Pokémon Champions** con botón de copia rápida para el retador.
   - Chat interactivo con respuestas rápidas y otorgamiento de medalla oficial con veredicto personalizado.

4. **Portal Individual de Líderes de Gimnasio**:
   - Acceso seguro mediante **PIN secreto de 4 dígitos** completamente oculto con indicador de esferas de seguridad (ej. Brock: `1001`, Misty: `1002`, Lt. Surge: `1003`, Erika: `1004`, Koga: `1005`, Sabrina: `1006`, Blaine: `1007`, Giovanni: `1008`).
   - Control del estado del gimnasio y bandeja de retadores entrantes.

5. **Panel de Super Administrador General**:
   - Acceso protegido con **PIN secreto maestro de 4 dígitos** (por defecto: `2026`), completamente oculto para máxima confidencialidad.
   - Modificación completa de fichas de jugadores, desbloqueo de sellos, monitor de batallas en vivo, creación o eliminación de gimnasios y reasignación de PINs confidenciales a los líderes.

---

## 📦 Instrucciones de Despliegue

### 1. Subir a GitHub

El proyecto ya tiene `git` inicializado, la rama `main` configurada y el commit inicial listo con todos los archivos limpios.

Para enlazarlo con tu nuevo repositorio en GitHub, ejecuta en la terminal:

```bash
# 1. Vincular con tu repositorio nuevo de GitHub (reemplaza TU_USUARIO y TU_REPOSITORIO)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 2. Subir el código a GitHub
git push -u origin main

# (Nota: Si tu repositorio en GitHub se creó con un README o licencia por defecto, usa --force):
# git push -u origin main --force
```

> **Incluido para GitHub:** Se añadió `.github/workflows/deploy.yml` y configuración `base: './'` en Vite para que el proyecto funcione al 100% tanto en GitHub Pages como en Vercel sin pantallas en blanco ni errores 404.

---

### 2. Despliegue en Vercel (Dominio y Frontend)

1. Ve a [Vercel](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New Project"** e importa el repositorio de PokéCard Pass.
3. Vercel detectará automáticamente **Vite**:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. En la sección **Environment Variables**, añade las variables que encuentras en `.env.example`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Haz clic en **"Deploy"**. El archivo `vercel.json` incluido configurará automáticamente las redirecciones SPA y los encabezados PWA.
6. En la configuración del proyecto en Vercel (**Settings -> Domains**) puedes vincular tu propio dominio personalizado.

---

### 3. Conexión con Firebase (Servidor y Base de Datos)

1. Ingresa a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto.
2. En el menú lateral, ve a **Firestore Database** y haz clic en **"Crear base de datos"**.
3. Registra una aplicación Web en tu proyecto para obtener las credenciales (`firebaseConfig`).
4. Para desplegar las reglas de seguridad oficiales incluidas (`firestore.rules`):
   ```bash
   # Instalar Firebase CLI si no lo tienes
   npm install -g firebase-tools

   # Iniciar sesión en Firebase
   firebase login

   # Seleccionar tu proyecto
   firebase use --add

   # Desplegar reglas de Firestore
   firebase deploy --only firestore:rules
   ```

---

## 💻 Desarrollo Local

Para correr el proyecto localmente en tu computadora:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```
El servidor arrancará en `http://localhost:3000`.
