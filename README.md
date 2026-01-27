# 🚴‍♂️ GravelMatch - Tinder per Ciclisti Gravel

![GravelMatch](https://img.shields.io/badge/status-active-success.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)

**GravelMatch** è una piattaforma di social matching per ciclisti appassionati di gravel. Trova compagni di pedalata con il tuo stesso livello, condividi percorsi e organizza uscite insieme!

## ✨ Caratteristiche

- 🔍 **Discovery & Matching**: Swipe per trovare ciclisti compatibili
- 🗺️ **Condivisione Percorsi**: Crea e condividi i tuoi percorsi gravel preferiti
- 💬 **Chat**: Messaggeria in-app per organizzare uscite
- 📊 **Filtri Avanzati**: Filtra per esperienza, distanza, zona preferita
- 🤖 **AI Suggestions**: Suggerimenti intelligenti per percorsi e conversazioni
- 📱 **Responsive**: Ottimizzato per mobile e desktop

## 🏗️ Architettura

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Auth**: JWT
- **Storage**: Cloudinary (immagini)
- **AI**: Emergent Integrations

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Maps**: Leaflet
- **Router**: React Router v6
- **HTTP**: Axios

## 🚀 Quick Start

### Prerequisiti
- Python 3.11+
- Node.js 18+
- MongoDB (locale o Atlas)
- Account Cloudinary

### 1. Setup Variabili d'Ambiente

```bash
# Esegui lo script di setup
./scripts/setup_env.sh

# Oppure manualmente:
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Modifica i file `.env` con le tue credenziali.

### 2. Avvia il Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

Il backend sarà disponibile su `http://localhost:8001`

### 3. Avvia il Frontend

```bash
cd frontend
npm install
npm start
```

Il frontend sarà disponibile su `http://localhost:3000`

## 🐳 Deploy con Docker

Il modo più semplice per deployare l'intera applicazione:

```bash
# Setup variabili d'ambiente
./scripts/setup_env.sh

# Build e avvia
docker-compose up --build

# In background
docker-compose up -d
```

Applicazione disponibile su:
- Frontend: `http://localhost`
- Backend: `http://localhost:8001`

## 📚 Deploy in Produzione

Leggi la [Guida Completa al Deploy](./DEPLOYMENT_GUIDE.md) per istruzioni dettagliate su come deployare su:

- 🐳 **Docker** (VPS/Server dedicato)
- 🌐 **Render.com** (Consigliato - Gratuito)
- 🚂 **Railway.app** (Facile e veloce)
- ⚡ **Vercel + Railway** (Deploy separato)
- 🌊 **Netlify + Render** (Alternativa)

## 📖 API Documentation

Una volta avviato il backend, la documentazione interattiva è disponibile su:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

### Principali Endpoint

#### Auth
- `POST /api/auth/register` - Registrazione
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Profilo corrente

#### Profile
- `PUT /api/profile` - Aggiorna profilo
- `POST /api/upload/profile-picture` - Upload foto profilo

#### Discovery
- `GET /api/discover` - Scopri nuovi ciclisti
- `POST /api/swipe` - Swipe like/pass

#### Routes
- `GET /api/routes` - Lista percorsi
- `POST /api/routes` - Crea percorso
- `GET /api/routes/{id}` - Dettaglio percorso

#### Chat
- `GET /api/matches` - I tuoi match
- `GET /api/chat/{match_id}` - Messaggi
- `POST /api/chat` - Invia messaggio

## 🔧 Configurazione

### Variabili d'Ambiente Backend

```bash
# Database
MONGO_URL=mongodb+srv://...
DB_NAME=gravelmatch

# Security
SECRET_KEY=<genera-con-openssl-rand-hex-32>

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# AI (opzionale)
EMERGENT_LLM_KEY=...
```

### Variabili d'Ambiente Frontend

```bash
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📁 Struttura del Progetto

```
stravatinder/
├── backend/
│   ├── server.py           # FastAPI app
│   ├── requirements.txt    # Dipendenze Python
│   └── .env               # Variabili d'ambiente
├── frontend/
│   ├── src/
│   │   ├── components/    # Componenti React
│   │   ├── pages/        # Pagine
│   │   └── context/      # Context API
│   ├── package.json      # Dipendenze Node
│   └── .env             # Variabili d'ambiente
├── docker-compose.yml    # Orchestrazione Docker
├── Dockerfile.backend    # Docker backend
├── Dockerfile.frontend   # Docker frontend
└── DEPLOYMENT_GUIDE.md  # Guida deploy completa
```

## 🤝 Contribuire

Contributi, issues e feature requests sono benvenuti!

## 📝 License

Questo progetto è [MIT](LICENSE) licensed.

## 👨‍💻 Autore

Creato con ❤️ per la community gravel

---

## 📞 Supporto

Per problemi o domande:
1. Controlla la [Guida al Deploy](./DEPLOYMENT_GUIDE.md)
2. Consulta la [documentazione API](http://localhost:8001/docs)
3. Apri una issue su GitHub

---

**Happy Gravel Riding! 🚴‍♂️🚴‍♀️**
