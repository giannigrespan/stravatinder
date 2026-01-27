# 📝 Guida Configurazione - Cosa Modificare Esattamente

I file `.env` sono stati creati! Ora devi solo modificare alcuni valori.

---

## ✅ Cosa È GIÀ CONFIGURATO

- ✅ `SECRET_KEY` - Già generata automaticamente
- ✅ `DB_NAME` - Già impostato a `gravelmatch`
- ✅ `REACT_APP_BACKEND_URL` - Già impostato per test locale

---

## 📝 COSA DEVI MODIFICARE

### 1. File: `backend/.env`

Apri il file `backend/.env` e modifica queste righe:

#### Riga 3: MONGO_URL

```bash
# PRIMA (template):
MONGO_URL=mongodb+srv://gravelmatch_user:YOUR_PASSWORD@gym-wizard.xxxxx.mongodb.net/gravelmatch?retryWrites=true&w=majority

# DOPO (con i tuoi dati):
MONGO_URL=mongodb+srv://gravelmatch_user:TuaPasswordQui@gym-wizard.a1b2c.mongodb.net/gravelmatch?retryWrites=true&w=majority
```

**Come ottenerla:**

1. Vai su [cloud.mongodb.com](https://cloud.mongodb.com)
2. Nella sezione **Database Access** (menu laterale):
   - Click "Add New Database User"
   - Username: `gravelmatch_user`
   - Password: Crea e **salva la password** 🔐
   - Privileges: "Read and write to any database"
   - Click "Add User"

3. Nella sezione **Network Access** (menu laterale):
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

4. Torna su **Database**:
   - Click "Connect" sul cluster `gym-wizard`
   - Scegli "Connect your application"
   - Driver: Python 3.12+
   - **Copia la connection string**
   - Sostituisci `<password>` con la password che hai creato al punto 2

---

#### Righe 11-13: CLOUDINARY

```bash
# PRIMA (template):
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# DOPO (con i tuoi dati):
CLOUDINARY_CLOUD_NAME=dxy123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcXYZ123-secretkey
```

**Come ottenerle:**

1. Vai su [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Registrati (gratis)
3. Dopo il login, vai su **Dashboard**
4. Troverai:
   - **Cloud Name** (es: `dxy123abc`)
   - **API Key** (numero lungo)
   - **API Secret** (click su "Reveal Authentication Token" per vederlo)
5. Copia questi 3 valori nel file `.env`

---

#### Riga 17: EMERGENT_LLM_KEY (OPZIONALE)

```bash
# Se NON usi le funzionalità AI, lascia vuoto:
EMERGENT_LLM_KEY=

# Se hai una chiave Emergent:
EMERGENT_LLM_KEY=your-emergent-key-here
```

Questa è **opzionale**. Lasciala vuota se non usi le funzionalità AI.

---

### 2. File: `frontend/.env`

Questo file è **già configurato** per test locale:

```bash
REACT_APP_BACKEND_URL=http://localhost:8001
```

**Quando modificarlo:**
- Solo quando fai il deploy su Render/Vercel e vuoi che il frontend punti al backend remoto
- Esempio: `REACT_APP_BACKEND_URL=https://gravelmatch-backend.onrender.com`

---

## 🔍 Verifica File Modificati

Dopo aver modificato, il tuo `backend/.env` dovrebbe assomigliare a:

```bash
# MongoDB Configuration
MONGO_URL=mongodb+srv://gravelmatch_user:MySecurePassword123@gym-wizard.a1b2c.mongodb.net/gravelmatch?retryWrites=true&w=majority
DB_NAME=gravelmatch

# JWT Secret Key (già generata automaticamente)
SECRET_KEY=546672b3171cae066ffdcc4d189462f6f2ff75df3626bbe98cdaec2aeb8d5a03

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dxy123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcXYZ123-secretkey

# Emergent AI Integration (optional)
EMERGENT_LLM_KEY=
```

---

## 🧪 Test della Configurazione

### Test MongoDB

```bash
cd /home/user/stravatinder/backend
python3 << 'EOF'
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
try:
    client = MongoClient(os.getenv('MONGO_URL'), serverSelectionTimeoutMS=5000)
    client.server_info()
    print("✅ MongoDB connesso!")
except Exception as e:
    print(f"❌ Errore: {e}")
EOF
```

### Test Cloudinary

```bash
cd /home/user/stravatinder/backend
python3 << 'EOF'
import cloudinary
from dotenv import load_dotenv
import os

load_dotenv()
try:
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET')
    )
    print("✅ Cloudinary configurato!")
except Exception as e:
    print(f"❌ Errore: {e}")
EOF
```

---

## ⚠️ Errori Comuni

### 1. MongoDB: "Authentication failed"

**Problema:** Password errata nella connection string

**Soluzione:**
- Verifica che la password nella MONGO_URL sia corretta
- Nessun spazio prima/dopo la password
- Se la password contiene caratteri speciali, devono essere encoded (es: `@` diventa `%40`)

### 2. MongoDB: "IP not whitelisted"

**Problema:** IP non autorizzato

**Soluzione:**
- Vai su MongoDB Atlas → Network Access
- Aggiungi 0.0.0.0/0 (Allow from Anywhere)

### 3. Cloudinary: "Invalid API credentials"

**Problema:** Credenziali sbagliate

**Soluzione:**
- Ricontrolla Cloud Name, API Key, API Secret
- Copia e incolla direttamente da Cloudinary Dashboard
- Non ci devono essere spazi

---

## 🚀 Prossimi Passi

Dopo aver configurato tutto:

### Test Locale (consigliato prima del deploy)

```bash
cd /home/user/stravatinder
docker-compose up --build
```

Accedi su:
- Frontend: http://localhost
- Backend: http://localhost:8001/docs

### Deploy su Render

Una volta testato in locale, segui `QUICK_START.md` per il deploy su Render.

---

## 💡 Suggerimenti

1. **Non committare mai i file .env su Git** - Sono già nel `.gitignore`
2. **Salva le credenziali in un posto sicuro** - Password manager o note sicure
3. **Per deploy, usa variabili d'ambiente** - Copia i valori nella dashboard Render, non fare commit dei .env

---

## ✅ Checklist

- [ ] Ho creato un database user su MongoDB Atlas
- [ ] Ho configurato Network Access (0.0.0.0/0)
- [ ] Ho ottenuto la connection string e modificato MONGO_URL
- [ ] Ho creato account Cloudinary
- [ ] Ho ottenuto Cloud Name, API Key, API Secret
- [ ] Ho modificato le credenziali Cloudinary nel .env
- [ ] Ho testato la connessione MongoDB (script sopra)
- [ ] Ho testato Cloudinary (script sopra)
- [ ] Sono pronto per `docker-compose up --build`!

---

Hai problemi? Controlla la sezione "Troubleshooting" in `QUICK_START.md`!
