# 🚀 Blueprint Deploy - GravelMatch su Render.com

## 📋 STEP 1: Prepara le Credenziali

Prima di iniziare, raccogli queste informazioni. Compila gli spazi vuoti:

---

### 🍃 MongoDB Atlas

**Connection String:**
```
mongodb+srv://_______________:_______________@_______________.mongodb.net/
```

**Database Name:**
```
gravelmatch
```

---

### 🖼️ Cloudinary

**Cloud Name:**
```
_______________
```

**API Key:**
```
_______________
```

**API Secret:**
```
_______________
```

---

### 🔐 SECRET_KEY (Genera Ora!)

Apri un **Git Bash** o **WSL** e esegui:

```bash
openssl rand -hex 32
```

Se non hai openssl, usa questo comando Python:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**SECRET_KEY generata:**
```
_______________
```

---

### 🤖 Emergent AI (Opzionale)

Se hai una chiave Emergent LLM:
```
_______________
```

Altrimenti, lascia vuoto (non è necessaria per il funzionamento base).

---

## 🎯 STEP 2: Vai su Render.com

1. **Apri il browser** e vai su:
   👉 **https://dashboard.render.com/**

2. **Fai login** o **Sign Up** se non hai un account
   - Usa GitHub per fare login (consigliato)

---

## 🔗 STEP 3: Avvia Blueprint Deploy

1. **Una volta nella Dashboard**, click sul pulsante blu **"New +"** in alto a destra

2. Nel menu a tendina, seleziona **"Blueprint"**

3. **Prima volta?** Se è la prima volta che usi Render:
   - Click su **"Connect GitHub"**
   - Autorizza Render ad accedere ai tuoi repository
   - Puoi scegliere "All repositories" o "Only select repositories"

4. **Cerca il repository:**
   - Nella lista, cerca `stravatinder`
   - Oppure digita nel search box: `giannigrespan/stravatinder`

5. **Click su "Connect"** accanto al repository

---

## ⚙️ STEP 4: Render Rileva il Blueprint

Render ora legge il file `render.yaml` e ti mostra:

```
✅ Found render.yaml
✅ 2 services detected:
   - gravelmatch-backend (Web Service)
   - gravelmatch-frontend (Static Site)
```

---

## 🔐 STEP 5: Configura Environment Variables

Render ti mostrerà una schermata con tutte le variabili d'ambiente.

### Per `gravelmatch-backend`:

Devi compilare SOLO queste variabili (le altre sono già settate automaticamente):

| Variabile | Valore |
|-----------|--------|
| **MONGO_URL** | [Incolla la tua connection string MongoDB] |
| **CLOUDINARY_CLOUD_NAME** | [Incolla il tuo cloud name] |
| **CLOUDINARY_API_KEY** | [Incolla la tua API key] |
| **CLOUDINARY_API_SECRET** | [Incolla il tuo API secret] |
| **EMERGENT_LLM_KEY** | [Opzionale - incolla se ce l'hai] |

**Note importanti:**
- ✅ `DB_NAME` è già settato a `gravelmatch`
- ✅ `SECRET_KEY` viene generato automaticamente da Render
- ✅ `FRONTEND_URL` viene settato automaticamente dal Blueprint

### Per `gravelmatch-frontend`:

✅ **Niente da fare!** `REACT_APP_BACKEND_URL` è già configurato automaticamente dal Blueprint!

---

## 🚀 STEP 6: Deploy!

1. **Controlla tutto** - Verifica che tutte le variabili siano corrette

2. **Click sul pulsante "Apply"** in basso

3. **Render inizierà il deployment:**
   ```
   📦 Creating services...
   🔨 Building gravelmatch-backend...
   🔨 Building gravelmatch-frontend...
   ```

4. **Attendi 5-7 minuti** ☕
   - Puoi vedere i log in tempo reale
   - Il backend impiega ~3-4 minuti
   - Il frontend impiega ~2-3 minuti

---

## ✅ STEP 7: Salva gli URL

Una volta completato il deploy, salva questi URL:

**Backend URL:**
```
https://gravelmatch-backend.onrender.com
```

**Frontend URL:**
```
https://gravelmatch-frontend.onrender.com
```

**API Documentation:**
```
https://gravelmatch-backend.onrender.com/docs
```

---

## 🧪 STEP 8: Test dell'Applicazione

### Test 1: Backend Health Check

Apri nel browser:
```
https://gravelmatch-backend.onrender.com/api/health
```

✅ **Dovresti vedere:**
```json
{
  "status": "healthy",
  "app": "GravelMatch API",
  "version": "2.0.0"
}
```

---

### Test 2: API Documentation

Apri nel browser:
```
https://gravelmatch-backend.onrender.com/docs
```

✅ **Dovresti vedere:** La documentazione interattiva Swagger UI

---

### Test 3: Frontend

Apri nel browser:
```
https://gravelmatch-frontend.onrender.com
```

✅ **Dovresti vedere:** La home page di GravelMatch

---

### Test 4: Registrazione

1. Click su **"Registrati"**
2. Compila il form:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Nome: `Test User`
3. Click su **"Registrati"**

✅ **Dovresti:** Essere reindirizzato alla dashboard

---

### Test 5: Upload Foto Profilo

1. Vai su **"Profilo"**
2. Click su **"Carica foto"**
3. Seleziona un'immagine
4. Click su **"Salva"**

✅ **Dovresti:** Vedere la tua foto profilo caricata

---

## 🎉 COMPLETATO!

La tua app **GravelMatch** è ora ONLINE! 🚴‍♂️

---

## 📊 Monitoraggio

### Dashboard Render

**Backend:**
- Vai su: https://dashboard.render.com/
- Click su `gravelmatch-backend`
- Qui puoi vedere:
  - 📊 **Metrics**: CPU, RAM, Bandwidth
  - 📝 **Logs**: Log in tempo reale
  - ⚙️ **Environment**: Modifica variabili d'ambiente
  - 🔄 **Manual Deploy**: Forza un redeploy

**Frontend:**
- Click su `gravelmatch-frontend`
- Stessi controlli del backend

---

## 🔄 Deploy Automatico

Ogni volta che fai `git push` su `main`, Render farà automaticamente il redeploy!

```bash
git add .
git commit -m "Update feature"
git push origin main
```

🎯 Render rileva il push e fa il build automaticamente!

---

## ⚠️ Limitazioni Free Tier

### Backend:
- 🛏️ **Sleep dopo 15 minuti** di inattività
- ⏱️ **~30 secondi** per il primo accesso dopo lo sleep
- 💾 **512 MB RAM**
- 📊 **750 ore/mese** (circa 31 giorni)

### Frontend:
- ✅ **Sempre attivo** (static site)
- 🚀 **CDN globale**
- 📦 **100 GB bandwidth/mese**

---

## 💡 Tips & Tricks

### 1. Evitare lo Sleep del Backend

Usa **UptimeRobot** (gratuito) per pingare il backend ogni 5 minuti:

1. Vai su https://uptimerobot.com/
2. Crea un monitor HTTP
3. URL: `https://gravelmatch-backend.onrender.com/api/health`
4. Interval: 5 minuti

### 2. Custom Domain

Puoi aggiungere un dominio personalizzato:

1. Dashboard → Service → Settings
2. Click su "Add Custom Domain"
3. Segui le istruzioni per configurare DNS

### 3. Upgrade a Paid Plan

Se vuoi evitare lo sleep:
- **Starter Plan**: $7/mese per servizio
- Backend sempre attivo
- Niente cold starts

---

## 🐛 Troubleshooting

### Il backend non si avvia?

1. **Controlla i logs:**
   - Dashboard → gravelmatch-backend → Logs

2. **Errori comuni:**
   - ❌ `MongoServerError`: Connection string MongoDB sbagliata
   - ❌ `ImportError`: Problema con requirements.txt
   - ❌ `KeyError`: Variabile d'ambiente mancante

3. **Verifica variabili d'ambiente:**
   - Dashboard → gravelmatch-backend → Environment
   - Controlla che tutte le variabili siano presenti

### Il frontend non si connette al backend?

1. **Apri la Console del Browser** (F12)

2. **Cerca errori CORS:**
   ```
   Access to XMLHttpRequest blocked by CORS policy
   ```

3. **Verifica che FRONTEND_URL sia corretto:**
   - Dashboard → gravelmatch-backend → Environment
   - `FRONTEND_URL` deve essere `https://gravelmatch-frontend.onrender.com`

4. **Riavvia il backend:**
   - Dashboard → gravelmatch-backend → Manual Deploy → "Deploy Latest Commit"

### Le immagini non si caricano?

1. **Verifica credenziali Cloudinary:**
   - Dashboard → gravelmatch-backend → Environment
   - Controlla `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

2. **Controlla i logs del backend:**
   - Cerca errori durante l'upload

3. **Verifica limiti Cloudinary:**
   - Free tier: 25 GB storage, 25 GB bandwidth/mese

---

## 📞 Hai Problemi?

Se qualcosa non funziona:

1. ✅ Controlla questa guida passo-passo
2. 📝 Leggi i logs su Render Dashboard
3. 🔍 Cerca l'errore specifico
4. 💬 Chiedi aiuto con il messaggio di errore specifico

---

## 🎊 Congratulazioni!

Hai deployato con successo **GravelMatch**! 🚴‍♂️🎉

Condividi l'URL con gli amici e inizia a trovare compagni di pedalata!

---

**Happy Gravel Riding! 🚴‍♂️🚴‍♀️**
