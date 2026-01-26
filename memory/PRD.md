# GravelMatch - Product Requirements Document

## Overview
**App Name:** GravelMatch  
**Tagline:** "Trova il tuo prossimo ride"  
**Version:** 2.0.0  
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

## What's Been Implemented

### Version 1.0 (Jan 25, 2026)
- ✅ Auth JWT completa
- ✅ Profilo utente con profilazione gravel
- ✅ CRUD percorsi
- ✅ Sistema swipe e matching
- ✅ Chat 1-to-1
- ✅ AI suggestions (GPT-5.2)

### Version 2.0 (Jan 26, 2026) - NEW FEATURES
- ✅ **Filtri avanzati Discover**: età min/max, distanza min/max, livello, zona
- ✅ **Mappa Leaflet**: visualizzazione percorsi con marker colorati (partenza verde, arrivo rosso)
- ✅ **Map Picker**: selezione punto partenza su mappa interattiva
- ✅ **Upload Cloudinary**: immagini percorsi e foto profilo (resize automatico, face detection per profili)
- ✅ **Sistema Notifiche**: 
  - Bell icon con badge unread count
  - Panel laterale slide-in
  - Notifiche per match e messaggi
  - Mark as read singolo/tutti
- ✅ Campo età nel profilo per filtri matching

### Backend (FastAPI + MongoDB)
- ✅ API REST completa v2.0.0
- ✅ Cloudinary integration per upload
- ✅ Notifications collection e endpoints
- ✅ Filtri avanzati discover con query builder

### Frontend (React + TailwindCSS + Framer Motion)
- ✅ DiscoverFilters component (modal bottom sheet)
- ✅ RouteMap component (Leaflet, dark tiles CARTO)
- ✅ RouteMapPicker component (click to select)
- ✅ ImageUpload component (drag & drop, preview)
- ✅ ProfilePictureUpload component
- ✅ NotificationBell + NotificationPanel + NotificationProvider

## API Endpoints v2.0

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Profile
```
PUT  /api/profile
```

### Routes
```
GET  /api/routes
POST /api/routes
GET  /api/routes/{id}
POST /api/routes/{id}/like
```

### Discovery & Matching
```
GET  /api/discover?min_age=&max_age=&min_distance=&max_distance=&experience_level=&zone=
POST /api/swipe
GET  /api/matches
```

### Chat
```
GET  /api/chat/{match_id}
POST /api/chat
```

### Upload (NEW)
```
POST /api/upload/image
POST /api/upload/profile-picture
```

### Notifications (NEW)
```
GET  /api/notifications
GET  /api/notifications/unread-count
PUT  /api/notifications/{id}/read
PUT  /api/notifications/read-all
```

### AI
```
GET  /api/ai/route-suggestions
GET  /api/ai/match-tips?target_user_id=
```

## Technical Stack
- **Frontend:** React 18, TailwindCSS, Framer Motion, React Router, Leaflet
- **Backend:** FastAPI, PyMongo, python-jose (JWT), Cloudinary
- **Database:** MongoDB
- **AI:** GPT-5.2 via Emergent LLM Key
- **Cloud:** Cloudinary (images)
- **Hosting:** Emergent Platform

## Prioritized Backlog

### P0 (Critical) - DONE
- [x] Auth system
- [x] Core matching flow
- [x] Route creation
- [x] Chat basic
- [x] Advanced filters
- [x] Map integration
- [x] Image upload
- [x] Notifications

### P1 (High Priority)
- [ ] Google OAuth integration
- [ ] Push notifications (web push API)
- [ ] Real-time chat (WebSocket)
- [ ] Infinite scroll routes feed

### P2 (Medium Priority)
- [ ] Gruppi/eventi per uscite collettive
- [ ] Statistiche personali (km totali, match)
- [ ] Export/import GPX percorsi
- [ ] Route waypoints editor

### P3 (Nice to Have)
- [ ] Dark/Light theme toggle
- [ ] PWA con offline support
- [ ] Integrazione Strava API
- [ ] Gamification (badges, livelli)

## Cloudinary Configuration
- Cloud Name: dxzxdgzeh
- Folders: gravelmatch/routes, gravelmatch/profiles
- Auto-transformations: resize, quality auto, format auto
- Face detection for profile pictures

## Next Tasks
1. Implementare WebSocket per chat real-time
2. Aggiungere Web Push API per notifiche native
3. Eventi/gruppi per uscite collettive
