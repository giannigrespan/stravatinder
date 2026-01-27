#!/bin/bash

# Script interattivo per configurare GravelMatch
echo "🚀 Setup Interattivo di GravelMatch"
echo "===================================="
echo ""

# Genera SECRET_KEY
echo "📝 Generazione SECRET_KEY sicura..."
SECRET_KEY=$(openssl rand -hex 32)
echo "✅ SECRET_KEY generata!"
echo ""

# MongoDB
echo "🍃 Configurazione MongoDB Atlas"
echo "--------------------------------"
read -p "Inserisci la tua MongoDB Connection String: " MONGO_URL
read -p "Nome del database [gravelmatch]: " DB_NAME
DB_NAME=${DB_NAME:-gravelmatch}
echo ""

# Cloudinary
echo "☁️  Configurazione Cloudinary"
echo "----------------------------"
read -p "Cloud Name: " CLOUDINARY_CLOUD_NAME
read -p "API Key: " CLOUDINARY_API_KEY
read -sp "API Secret: " CLOUDINARY_API_SECRET
echo ""
echo ""

# Emergent (opzionale)
echo "🤖 Configurazione Emergent AI (opzionale)"
echo "----------------------------------------"
read -p "Emergent LLM Key (lascia vuoto per saltare): " EMERGENT_LLM_KEY
echo ""

# Crea backend/.env
echo "📝 Creazione file backend/.env..."
cat > ../backend/.env << EOF
# MongoDB Configuration
MONGO_URL=${MONGO_URL}
DB_NAME=${DB_NAME}

# JWT Secret Key
SECRET_KEY=${SECRET_KEY}

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}

# Emergent AI Integration (optional)
EMERGENT_LLM_KEY=${EMERGENT_LLM_KEY}
EOF

echo "✅ File backend/.env creato!"
echo ""

# Chiedi URL backend per frontend
echo "🌐 Configurazione Frontend"
echo "-------------------------"
echo "Per il test locale, usa: http://localhost:8001"
echo "Per il deploy, inserisci l'URL del tuo backend (es: https://gravelmatch-backend.onrender.com)"
read -p "Backend URL [http://localhost:8001]: " BACKEND_URL
BACKEND_URL=${BACKEND_URL:-http://localhost:8001}

# Crea frontend/.env
cat > ../frontend/.env << EOF
REACT_APP_BACKEND_URL=${BACKEND_URL}
EOF

echo "✅ File frontend/.env creato!"
echo ""

# Riepilogo
echo "🎉 Configurazione Completata!"
echo "============================="
echo ""
echo "📁 File creati:"
echo "  - backend/.env"
echo "  - frontend/.env"
echo ""
echo "🔐 Credenziali configurate:"
echo "  ✅ MongoDB: ${DB_NAME} su Atlas"
echo "  ✅ Cloudinary: ${CLOUDINARY_CLOUD_NAME}"
echo "  ✅ JWT Secret Key: Generata"
if [ ! -z "$EMERGENT_LLM_KEY" ]; then
    echo "  ✅ Emergent AI: Configurata"
fi
echo ""
echo "🚀 Prossimi Passi:"
echo ""
echo "Per testare in locale:"
echo "  cd /home/user/stravatinder"
echo "  docker-compose up --build"
echo ""
echo "Per deployare su Render:"
echo "  1. Vai su render.com"
echo "  2. Segui la guida in DEPLOYMENT_GUIDE.md"
echo "  3. Copia le variabili da backend/.env"
echo ""
echo "✨ Buon deploy!"
