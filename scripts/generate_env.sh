#!/bin/bash

# Script semplificato - Genera template .env che puoi poi modificare

echo "🚀 Generazione Template .env per GravelMatch"
echo "============================================="
echo ""

# Genera SECRET_KEY
SECRET_KEY=$(openssl rand -hex 32)

# Directory di lavoro
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Crea backend/.env
echo "📝 Creazione $PROJECT_DIR/backend/.env..."
cat > "$PROJECT_DIR/backend/.env" << EOF
# MongoDB Configuration
# Ottieni da MongoDB Atlas -> Connect -> Connect your application
MONGO_URL=mongodb+srv://gravelmatch_user:YOUR_PASSWORD@gym-wizard.xxxxx.mongodb.net/gravelmatch?retryWrites=true&w=majority
DB_NAME=gravelmatch

# JWT Secret Key (già generata automaticamente)
SECRET_KEY=$SECRET_KEY

# Cloudinary Configuration
# Ottieni da https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Emergent AI Integration (optional)
# Lascia vuoto se non usi le funzionalità AI
EMERGENT_LLM_KEY=
EOF

echo "✅ File backend/.env creato!"
echo ""

# Crea frontend/.env
echo "📝 Creazione $PROJECT_DIR/frontend/.env..."
cat > "$PROJECT_DIR/frontend/.env" << EOF
# Backend URL
# Per test locale: http://localhost:8001
# Per deploy: https://your-backend-url.onrender.com
REACT_APP_BACKEND_URL=http://localhost:8001
EOF

echo "✅ File frontend/.env creato!"
echo ""

# Mostra cosa fare dopo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Template .env creati con successo!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ SECRET_KEY già generata e configurata automaticamente"
echo ""
echo "📝 PROSSIMI PASSI:"
echo ""
echo "1. Modifica backend/.env e sostituisci:"
echo "   - MONGO_URL con la tua connection string da MongoDB Atlas"
echo "   - CLOUDINARY_* con le tue credenziali da Cloudinary"
echo ""
echo "2. (Opzionale) Modifica frontend/.env se vuoi testare contro un backend remoto"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 GUIDE PER OTTENERE LE CREDENZIALI:"
echo ""
echo "🍃 MongoDB Atlas:"
echo "   1. Vai su cloud.mongodb.com"
echo "   2. Database Access -> Add Database User"
echo "      - Username: gravelmatch_user"
echo "      - Password: [genera e salva]"
echo "   3. Network Access -> Add IP Address -> Allow from Anywhere"
echo "   4. Database -> Connect -> Connect your application"
echo "   5. Copia la connection string e sostituisci <password>"
echo ""
echo "☁️  Cloudinary:"
echo "   1. Vai su cloudinary.com/users/register/free"
echo "   2. Dopo il login, vai su Dashboard"
echo "   3. Copia: Cloud Name, API Key, API Secret"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 DOPO AVER CONFIGURATO:"
echo ""
echo "Test locale:"
echo "  cd $PROJECT_DIR"
echo "  docker-compose up --build"
echo ""
echo "Deploy su Render:"
echo "  Leggi QUICK_START.md per istruzioni complete"
echo ""
