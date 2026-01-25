# GravelMatch - Product Requirements Document

## Overview
**App Name:** GravelMatch  
**Tagline:** "Trova il tuo prossimo ride"  
**Description:** App mobile-first che combina funzionalità stile Strava (percorsi gravel) e Tinder (matching tra rider)

## User Personas
1. **Rider Principiante** - Cerca percorsi facili e compagni esperti da cui imparare
2. **Rider Intermedio** - Vuole scoprire nuovi percorsi e trovare compagni di pedalata
3. **Rider Esperto** - Condivide percorsi impegnativi e cerca sfidanti del suo livello

## Core Requirements (Static)
- Autenticazione JWT + Google OAuth (opzionale)
- Gestione profilo utente con profilazione gravel
- Creazione e condivisione percorsi manuali
- Sistema di matching stile Tinder basato su compatibilità
- Chat 1-to-1 dopo il match
- Suggerimenti AI personalizzati

## What's Been Implemented (Jan 2026)

### Backend (FastAPI + MongoDB)
- ✅ API REST completa con autenticazione JWT
- ✅ CRUD utenti con profilazione (livello, distanza, zona)
- ✅ CRUD percorsi con difficoltà, tags, likes
- ✅ Sistema swipe e matching
- ✅ Chat real-time per match
- ✅ AI suggestions con GPT-5.2 (Emergent LLM Key)
- ✅ Endpoint health check

### Frontend (React + TailwindCSS + Framer Motion)
- ✅ Landing page con hero image
- ✅ Login/Registrazione con validazione
- ✅ Profile Setup wizard (3 step)
- ✅ Home feed percorsi
- ✅ Creazione percorsi con form completo
- ✅ Dettaglio percorso con like/share
- ✅ Discover page con swipe cards animati
- ✅ Match detection e modal celebrativo
- ✅ Lista matches con preview messaggi
- ✅ Chat interface con invio messaggi
- ✅ Settings con modifica profilo
- ✅ Bottom navigation mobile
- ✅ AI suggestions card in home
- ✅ Dark theme "Gravel Dark" (Terracotta accent)

### Design
- ✅ Mobile-first responsive
- ✅ Glassmorphism effects
- ✅ Custom fonts (Manrope, Inter, Chivo Mono)
- ✅ Micro-animations con Framer Motion
- ✅ Swipe gestures per matching

## Prioritized Backlog

### P0 (Critical) - DONE
- [x] Auth system
- [x] Core matching flow
- [x] Route creation
- [x] Chat basic

### P1 (High Priority)
- [ ] Google OAuth integration (configurato ma non abilitato)
- [ ] Notifiche push per nuovi match/messaggi
- [ ] Filtri avanzati per discover (età, distanza max)
- [ ] Mappa interattiva con Leaflet per percorsi

### P2 (Medium Priority)  
- [ ] Upload immagini profilo/percorsi (Cloudinary)
- [ ] Gruppi/eventi per uscite collettive
- [ ] Statistiche personali (km totali, match)
- [ ] Export/import GPX percorsi

### P3 (Nice to Have)
- [ ] Dark/Light theme toggle
- [ ] PWA con offline support
- [ ] Integrazione Strava API
- [ ] Gamification (badges, livelli)

## Technical Stack
- **Frontend:** React 18, TailwindCSS, Framer Motion, React Router
- **Backend:** FastAPI, PyMongo, python-jose (JWT)
- **Database:** MongoDB
- **AI:** GPT-5.2 via Emergent LLM Key
- **Hosting:** Emergent Platform

## API Endpoints Summary
```
POST /api/auth/register - Registrazione
POST /api/auth/login - Login
GET  /api/auth/me - User corrente
PUT  /api/profile - Aggiorna profilo
GET  /api/routes - Lista percorsi
POST /api/routes - Crea percorso
GET  /api/routes/{id} - Dettaglio percorso
POST /api/routes/{id}/like - Like percorso
GET  /api/discover - Utenti da scoprire
POST /api/swipe - Like/Dislike utente
GET  /api/matches - Lista match
GET  /api/chat/{match_id} - Messaggi chat
POST /api/chat - Invia messaggio
GET  /api/ai/route-suggestions - Suggerimenti AI percorsi
GET  /api/ai/match-tips - Tips conversazione AI
```

## Next Tasks
1. Aggiungere filtri avanzati in discover
2. Implementare notifiche push
3. Integrare mappa Leaflet per visualizzazione percorsi
4. Upload immagini con Cloudinary
