# 🚀 Deploy GravelMatch su Render.com - Guida Step-by-Step

## ✅ Checklist Pre-Deploy

- [x] Repository su GitHub: https://github.com/giannigrespan/stravatinder
- [x] MongoDB Atlas configurato
- [x] Cloudinary configurato
- [ ] Account Render.com

---

## 📝 Fase 1: Prepara le Credenziali

Prima di iniziare, raccogli queste informazioni:

### MongoDB Atlas
- **Connection String**: `mongodb+srv://username:password@cluster.mongodb.net/`
- **Database Name**: `gravelmatch`

### Cloudinary
- **Cloud Name**: `_______________`
- **API Key**: `_______________`
- **API Secret**: `_______________`

### SECRET_KEY (da generare)
Apri un terminale e esegui:
```bash
openssl rand -hex 32
```
Salva il risultato: `_______________`

---

## 🎯 Fase 2: Deploy Backend

### 1. Vai su Render.com
👉 [https://dashboard.render.com/](https://dashboard.render.com/)

### 2. Crea un nuovo Web Service
- Click su **"New +"** → **"Web Service"**
- Se è la prima volta, clicca su **"Connect GitHub"** e autorizza Render

### 3. Seleziona il Repository
- Cerca `giannigrespan/stravatinder`
- Click su **"Connect"**

### 4. Configura il Service

Inserisci questi valori:

| Campo | Valore |
|-------|--------|
| **Name** | `gravelmatch-backend` |
| **Root Directory** | `backend` |
| **Environment** | `Python 3` |
| **Region** | `Frankfurt (EU Central)` o più vicino a te |
| **Branch** | `main` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

### 5. Aggiungi Environment Variables

Click su **"Advanced"** → **"Add Environment Variable"** per ciascuna:

```
MONGO_URL = mongodb+srv://[tuo-username]:[tua-password]@cluster.mongodb.net/
DB_NAME = gravelmatch
SECRET_KEY = [la chiave generata con openssl]
CLOUDINARY_CLOUD_NAME = [tuo-cloud-name]
CLOUDINARY_API_KEY = [tua-api-key]
CLOUDINARY_API_SECRET = [tuo-api-secret]
```

*(opzionale)* Se hai Emergent AI:
```
EMERGENT_LLM_KEY = [tua-key]
```

### 6. Deploy!
- Click su **"Create Web Service"**
- Attendi 2-3 minuti per il build

### 7. Salva l'URL del Backend
Una volta completato il deploy, copia l'URL (sarà tipo):
```
https://gravelmatch-backend.onrender.com
```
**➡️ URL BACKEND: `_______________`** (scrivilo qui!)

### 8. Testa il Backend
Apri nel browser:
```
https://gravelmatch-backend.onrender.com/api/health
```

Dovresti vedere: `{"status":"ok"}`

---

## 🎨 Fase 3: Deploy Frontend

### 1. Crea Static Site su Render
- Click su **"New +"** → **"Static Site"**
- Seleziona lo stesso repository `stravatinder`

### 2. Configura il Static Site

| Campo | Valore |
|-------|--------|
| **Name** | `gravelmatch-frontend` |
| **Root Directory** | `frontend` |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

### 3. Aggiungi Environment Variable

Click su **"Advanced"** → **"Add Environment Variable"**:

```
REACT_APP_BACKEND_URL = [URL del backend che hai salvato sopra]
```

Esempio:
```
REACT_APP_BACKEND_URL = https://gravelmatch-backend.onrender.com
```

### 4. Deploy!
- Click su **"Create Static Site"**
- Attendi 3-5 minuti per il build

### 5. Salva l'URL del Frontend
```
https://gravelmatch-frontend.onrender.com
```
**➡️ URL FRONTEND: `_______________`**

---

## 🔧 Fase 4: Configura CORS (IMPORTANTE!)

Dopo il primo deploy del frontend, devi aggiornare il CORS del backend.

### 1. Annota l'URL esatto del frontend

### 2. Torna su Render → Backend Service

### 3. Aggiungi Environment Variable
```
FRONTEND_URL = https://gravelmatch-frontend.onrender.com
```

### 4. Il backend si riavvierà automaticamente

---

## ✅ Fase 5: Test Finale

### 1. Apri il Frontend
Vai all'URL del frontend: `https://gravelmatch-frontend.onrender.com`

### 2. Testa la Registrazione
- Crea un nuovo account
- Verifica che la registrazione funzioni

### 3. Testa l'Upload Foto
- Fai login
- Carica una foto profilo
- Verifica che appaia su Cloudinary

### 4. Testa la Discovery
- Naviga nella sezione Discovery
- Verifica che i dati vengano caricati

---

## 🎉 Congratulazioni!

La tua app GravelMatch è online! 🚴‍♂️

### Link Utili:
- **Frontend**: [URL FRONTEND]
- **Backend API**: [URL BACKEND]
- **API Docs**: [URL BACKEND]/docs
- **Dashboard Render**: https://dashboard.render.com/

---

## 🐛 Troubleshooting

### Il backend non si avvia?
1. Vai su Render Dashboard → Backend Service → **Logs**
2. Cerca errori relativi a:
   - MongoDB connection
   - Missing environment variables
   - Import errors

### Il frontend mostra errori?
1. Apri la Console del Browser (F12)
2. Verifica errori di connessione al backend
3. Controlla che `REACT_APP_BACKEND_URL` sia corretto

### CORS errors?
1. Verifica che `FRONTEND_URL` sia configurata nel backend
2. Riavvia il backend service su Render
3. Controlla che gli URL non abbiano slash finali

---

## 📊 Monitoraggio

### Render Dashboard
- **Backend Logs**: Dashboard → gravelmatch-backend → Logs
- **Frontend Logs**: Dashboard → gravelmatch-frontend → Logs
- **Metrics**: Vedi uso CPU, memoria, bandwidth

### MongoDB Atlas
- Vai su Atlas Dashboard
- Controlla le connessioni attive
- Verifica l'uso dello storage

### Cloudinary
- Dashboard → Media Library
- Controlla le immagini caricate
- Verifica l'uso della bandwidth

---

## 🔄 Deploy Automatico

Render è configurato per il **deploy automatico**!

Ogni volta che fai push su `main`:
```bash
git add .
git commit -m "Update app"
git push origin main
```

Render rileverà il push e farà il redeploy automaticamente! 🎉

---

## 💡 Tips

1. **Free Tier Render**: Il backend va in sleep dopo 15 minuti di inattività. Il primo accesso sarà lento (30 secondi).

2. **Keep Alive**: Per evitare lo sleep, puoi usare un servizio come UptimeRobot per pingare il backend ogni 10 minuti.

3. **Custom Domain**: Puoi aggiungere un dominio custom su Render (es: gravelmatch.com)

4. **HTTPS**: Render fornisce HTTPS automatico! ✅

---

**Buon deploy! 🚀**
