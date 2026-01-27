# 🚀 Quick Start - Deploy GravelMatch

Guida rapida per deployare GravelMatch con MongoDB Atlas già configurato!

## ✅ Prerequisiti che hai già

- ✅ MongoDB Atlas: Cluster `gym-wizard` attivo
- ✅ Progetto `gravelmatch` su Atlas

## 📋 Checklist Pre-Deploy (5 minuti)

### 1. MongoDB Atlas - Ottieni Connection String

Nel tuo dashboard Atlas:

1. **Database Access** (menu laterale):
   - Click "Add New Database User"
   - Username: `gravelmatch_user`
   - Password: Genera e **salva la password** 🔐
   - Privileges: "Read and write to any database"
   - Click "Add User"

2. **Network Access** (menu laterale):
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

3. **Database** → Click "Connect" sul cluster `gym-wizard`:
   - Scegli "Connect your application"
   - Driver: Python 3.12+
   - Copia la connection string:
   ```
   mongodb+srv://gravelmatch_user:YOUR_PASSWORD@gym-wizard.xxxxx.mongodb.net/gravelmatch
   ```

### 2. Cloudinary - Account Gratuito

1. Vai su https://cloudinary.com
2. Sign Up (gratis)
3. Dashboard → Salva questi valori:
   - Cloud Name
   - API Key
   - API Secret

### 3. Configurazione Automatica

Esegui lo script interattivo:

```bash
cd /home/user/stravatinder/scripts
./setup_interactive.sh
```

Lo script ti chiederà:
- MongoDB Connection String (da step 1)
- Cloudinary credentials (da step 2)
- Genererà automaticamente SECRET_KEY sicura

✅ Tutti i file `.env` saranno configurati automaticamente!

---

## 🚀 Opzione A: Deploy su Render.com (CONSIGLIATO - Gratuito)

### Perché Render?
- ✅ Completamente gratuito
- ✅ HTTPS automatico
- ✅ Deploy in 10 minuti
- ✅ CI/CD integrato

### Passaggi:

#### 1. Deploy Backend

1. Vai su https://render.com e fai login con GitHub
2. Click "New +" → "Web Service"
3. Connetti il repository `giannigrespan/stravatinder`
4. Configura:
   ```
   Name: gravelmatch-backend
   Region: Frankfurt (o più vicino a te)
   Branch: main (o il tuo branch)
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

5. **Environment Variables** → Aggiungi (copia da `backend/.env`):
   ```
   MONGO_URL=mongodb+srv://gravelmatch_user:PASSWORD@gym-wizard...
   DB_NAME=gravelmatch
   SECRET_KEY=<dalla tua .env>
   CLOUDINARY_CLOUD_NAME=<tuo cloud name>
   CLOUDINARY_API_KEY=<tua api key>
   CLOUDINARY_API_SECRET=<tuo api secret>
   ```

6. Click "Create Web Service"

7. **Aspetta il deploy** (3-5 minuti)

8. **Copia l'URL del backend**: `https://gravelmatch-backend.onrender.com`

#### 2. Deploy Frontend

1. Su Render, click "New +" → "Static Site"
2. Stesso repository
3. Configura:
   ```
   Name: gravelmatch-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

4. **Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://gravelmatch-backend.onrender.com
   ```
   (usa l'URL che hai copiato al passo 1.8)

5. Click "Create Static Site"

6. Aspetta il deploy (2-3 minuti)

7. **🎉 Fatto!** Apri l'URL fornito da Render

### ⚠️ Importante per Render

Il piano gratuito di Render mette in sleep i servizi dopo 15 minuti di inattività. Il primo caricamento dopo il sleep può richiedere 30-60 secondi.

---

## 🚀 Opzione B: Test Locale con Docker

### Requisiti
- Docker Desktop installato

### Passaggi

1. **Assicurati di aver eseguito lo script di setup** (vedi sopra)

2. **Avvia i container**:
   ```bash
   cd /home/user/stravatinder
   docker-compose up --build
   ```

3. **Accedi all'app**:
   - Frontend: http://localhost
   - Backend API Docs: http://localhost:8001/docs
   - Backend Health: http://localhost:8001/api/health

4. **Logs in tempo reale**:
   ```bash
   # In un altro terminale
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

5. **Stop**:
   ```bash
   docker-compose down
   ```

---

## 🧪 Test della Connessione MongoDB

Prima del deploy, testa che MongoDB funzioni:

```bash
cd /home/user/stravatinder/backend
pip install pymongo python-dotenv
python << EOF
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
mongo_url = os.getenv('MONGO_URL')

try:
    client = MongoClient(mongo_url)
    print("✅ Connessione MongoDB riuscita!")
    print(f"Databases disponibili: {client.list_database_names()}")
except Exception as e:
    print(f"❌ Errore connessione: {e}")
EOF
```

Se vedi "✅ Connessione MongoDB riuscita!" sei pronto! 🎉

---

## 🔧 Troubleshooting

### Backend non si avvia

**Errore di connessione MongoDB:**
```
pymongo.errors.ServerSelectionTimeoutError
```
**Soluzione:**
- Verifica che la password nella connection string sia corretta (niente caratteri speciali non encoded)
- Controlla Network Access su Atlas (deve includere 0.0.0.0/0)
- Verifica che il database user sia stato creato

**Errore SECRET_KEY:**
```
SECRET_KEY not found
```
**Soluzione:**
- Esegui `./scripts/setup_interactive.sh` per generare la SECRET_KEY

### Frontend non si connette al backend

**Errore CORS:**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Soluzione:**
- Verifica che `REACT_APP_BACKEND_URL` nel frontend punti al backend corretto
- Se usi Render, assicurati di NON avere `/` finale nell'URL

### Test Cloudinary

```bash
cd backend
python << EOF
from cloudinary import config
from dotenv import load_dotenv
import os

load_dotenv()
config(
  cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'),
  api_key = os.getenv('CLOUDINARY_API_KEY'),
  api_secret = os.getenv('CLOUDINARY_API_SECRET')
)
print("✅ Cloudinary configurato correttamente!")
EOF
```

---

## 📊 Monitoraggio

### Health Check

Verifica che il backend sia online:
```bash
curl https://gravelmatch-backend.onrender.com/api/health
```

Risposta attesa:
```json
{"status": "healthy"}
```

### Logs su Render

- Dashboard → Seleziona il servizio → Tab "Logs"
- I logs sono in tempo reale

---

## 🎯 Riepilogo Veloce

```bash
# 1. Setup
cd /home/user/stravatinder/scripts
./setup_interactive.sh

# 2. Test locale (opzionale)
cd /home/user/stravatinder
docker-compose up --build

# 3. Deploy su Render
# - Vai su render.com
# - Deploy backend (vedi istruzioni sopra)
# - Deploy frontend (vedi istruzioni sopra)
# - Apri l'URL e testa!
```

---

## 📚 Risorse

- 📖 Guida completa: `DEPLOYMENT_GUIDE.md`
- 🐳 Docker: `docker-compose.yml`
- 🔧 Scripts: `scripts/`
- 📝 Docs API: `/docs` endpoint del backend

---

## 🆘 Serve Aiuto?

1. Controlla i logs
2. Verifica tutte le variabili d'ambiente
3. Testa la connessione MongoDB (vedi sopra)
4. Consulta `DEPLOYMENT_GUIDE.md` per troubleshooting dettagliato

---

## ✅ Checklist Deploy Completato

- [ ] MongoDB Atlas: User e Network Access configurati
- [ ] Cloudinary: Account creato, credenziali salvate
- [ ] Script setup eseguito: `.env` files creati
- [ ] Test connessione MongoDB: ✅
- [ ] Backend deployato su Render
- [ ] Frontend deployato su Render
- [ ] Test dell'app: Registrazione, Login, Upload funzionano

🎉 **Congratulazioni! GravelMatch è online!** 🚴‍♂️
