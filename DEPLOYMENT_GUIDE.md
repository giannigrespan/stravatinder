# 🚀 Guida al Deploy di GravelMatch

Questa guida ti aiuterà a deployare la tua applicazione GravelMatch in produzione.

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere:

1. **Database MongoDB**
   - MongoDB Atlas (consigliato, piano gratuito disponibile)
   - Oppure MongoDB self-hosted

2. **Account Cloudinary**
   - Per l'upload e gestione delle immagini
   - Piano gratuito disponibile su [cloudinary.com](https://cloudinary.com)

3. **Emergent LLM Key** (opzionale)
   - Per le funzionalità AI
   - Necessaria solo se vuoi utilizzare i suggerimenti AI

---

## 🎯 Opzione 1: Deploy con Docker (Consigliato per VPS/Server dedicato)

### Vantaggi
✅ Portabilità completa
✅ Facile da configurare
✅ Gestione unificata di frontend e backend

### Prerequisiti
- Docker e Docker Compose installati
- Server con almeno 1GB RAM

### Passaggi

#### 1. Configura le variabili d'ambiente

**Backend** - Crea `backend/.env`:
```bash
# MongoDB (usa MongoDB Atlas per il deploy)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=gravelmatch

# JWT Secret (genera una chiave sicura)
SECRET_KEY=$(openssl rand -hex 32)

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Emergent AI (opzionale)
EMERGENT_LLM_KEY=your-key
```

**Frontend** - Modifica `docker-compose.yml` per settare:
```yaml
args:
  - REACT_APP_BACKEND_URL=https://your-domain.com
```

#### 2. Build e avvia i container

```bash
# Build delle immagini
docker-compose build

# Avvia i servizi
docker-compose up -d

# Verifica lo stato
docker-compose ps
docker-compose logs -f
```

#### 3. Verifica il funzionamento

- Backend: `http://your-server:8001/api/health`
- Frontend: `http://your-server`

#### 4. Setup Nginx Reverse Proxy (opzionale ma consigliato)

Installa Nginx sul server per gestire HTTPS e routing:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🌐 Opzione 2: Deploy su Render.com (Consigliato - Facile e Gratuito)

### Vantaggi
✅ Deploy gratuito
✅ HTTPS automatico
✅ CI/CD integrato
✅ Facile da configurare

### Passaggi

#### 1. Setup MongoDB Atlas

1. Vai su [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Crea un database chiamato `gravelmatch`
4. Ottieni la connection string
5. Aggiungi l'IP 0.0.0.0/0 nelle Network Access (per permettere connessioni da Render)

#### 2. Deploy Backend su Render

1. Vai su [render.com](https://render.com) e crea un account
2. Click su "New +" → "Web Service"
3. Connetti il tuo repository GitHub
4. Configura:
   - **Name**: `gravelmatch-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

5. Aggiungi le Environment Variables:
   ```
   MONGO_URL=mongodb+srv://...
   DB_NAME=gravelmatch
   SECRET_KEY=<genera-chiave-sicura>
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   EMERGENT_LLM_KEY=... (opzionale)
   ```

6. Click su "Create Web Service"
7. Salva l'URL del backend (es: `https://gravelmatch-backend.onrender.com`)

#### 3. Deploy Frontend su Render

1. Click su "New +" → "Static Site"
2. Connetti lo stesso repository
3. Configura:
   - **Name**: `gravelmatch-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Aggiungi Environment Variable:
   ```
   REACT_APP_BACKEND_URL=https://gravelmatch-backend.onrender.com
   ```

5. Click su "Create Static Site"

✅ Fatto! La tua app sarà disponibile all'URL fornito da Render.

---

## ☁️ Opzione 3: Deploy su Railway.app

### Vantaggi
✅ Deploy semplicissimo
✅ $5 di credito gratuito al mese
✅ Gestione database integrata

### Passaggi

1. Vai su [railway.app](https://railway.app)
2. Click su "New Project" → "Deploy from GitHub repo"
3. Seleziona il repository
4. Railway rileverà automaticamente backend e frontend
5. Aggiungi un database MongoDB dal Railway marketplace
6. Configura le variabili d'ambiente come nell'opzione Render
7. Deploy automatico!

---

## 🔧 Opzione 4: Deploy Separato

### Backend su Railway/Render + Frontend su Vercel/Netlify

#### Backend (Railway o Render)
Segui i passaggi dell'Opzione 2 o 3 per il backend.

#### Frontend su Vercel

1. Vai su [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connetti il repository
4. Configura:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
   - **Environment Variables**:
     ```
     REACT_APP_BACKEND_URL=https://your-backend-url.com
     ```
5. Deploy!

#### Frontend su Netlify

1. Vai su [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connetti il repository
4. Configura:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
   - **Environment variables**:
     ```
     REACT_APP_BACKEND_URL=https://your-backend-url.com
     ```
5. Deploy!

---

## 🔐 Sicurezza - IMPORTANTE

### 1. Genera una SECRET_KEY sicura

```bash
openssl rand -hex 32
```

### 2. Limita CORS nel backend

Modifica `backend/server.py` (riga 20-26):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],  # Specifica il dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. MongoDB Security

- Non usare l'utente admin
- Crea un utente dedicato con permessi limitati al database `gravelmatch`
- Usa una password forte

### 4. Cloudinary

- Non esporre mai le credenziali nel frontend
- Upload sempre tramite backend

---

## 📊 Monitoraggio

### Health Check Endpoint

L'API ha un endpoint di health check:
```
GET /api/health
```

Usalo per monitorare lo stato del backend.

### Logs

**Docker:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Render/Railway:**
Logs disponibili nella dashboard

---

## 🐛 Troubleshooting

### Backend non si avvia

1. Verifica le variabili d'ambiente:
   ```bash
   # Test locale
   cd backend
   python -c "from dotenv import load_dotenv; import os; load_dotenv(); print(os.environ.get('MONGO_URL'))"
   ```

2. Testa la connessione MongoDB:
   ```bash
   python -c "from pymongo import MongoClient; client = MongoClient('your-mongo-url'); print(client.list_database_names())"
   ```

### Frontend non si connette al backend

1. Verifica REACT_APP_BACKEND_URL:
   ```bash
   cd frontend
   echo $REACT_APP_BACKEND_URL
   ```

2. Controlla la console del browser per errori CORS

3. Verifica che il backend sia raggiungibile:
   ```bash
   curl https://your-backend-url.com/api/health
   ```

### Problemi con le immagini

1. Verifica le credenziali Cloudinary
2. Controlla i limiti del piano gratuito
3. Verifica i logs del backend per errori di upload

---

## 🚀 Deploy Rapido - Comando Singolo

Se vuoi testare rapidamente in locale con Docker:

```bash
# Copia e configura .env
cp backend/.env.example backend/.env
# Modifica backend/.env con le tue credenziali

# Build e avvia
docker-compose up --build

# L'app sarà disponibile su:
# Frontend: http://localhost
# Backend: http://localhost:8001
```

---

## 📞 Supporto

Se hai problemi con il deploy:
1. Controlla i logs
2. Verifica tutte le variabili d'ambiente
3. Testa ogni componente separatamente (MongoDB, Backend, Frontend)
4. Consulta la documentazione specifica della piattaforma usata

---

## 🎉 Congratulazioni!

Se sei arrivato fino a qui, la tua app GravelMatch dovrebbe essere online! 🚴‍♂️

Ricorda di:
- [ ] Configurare backup regolari del database
- [ ] Monitorare l'uso delle risorse
- [ ] Aggiornare regolarmente le dipendenze
- [ ] Implementare un sistema di logging
