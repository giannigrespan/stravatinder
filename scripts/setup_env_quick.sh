#!/bin/bash

# Setup rapido con parametri da riga di comando
# Uso: ./setup_env_quick.sh "mongodb://..." "cloud_name" "api_key" "api_secret"

echo "🚀 Setup Rapido GravelMatch"
echo "==========================="
echo ""

# Controlla se sono stati passati parametri
if [ $# -eq 0 ]; then
    echo "❌ Uso: $0 <MONGO_URL> <CLOUDINARY_CLOUD_NAME> <CLOUDINARY_API_KEY> <CLOUDINARY_API_SECRET> [BACKEND_URL]"
    echo ""
    echo "Esempio:"
    echo "  $0 \\"
    echo "    'mongodb+srv://user:pass@cluster.mongodb.net/gravelmatch' \\"
    echo "    'my-cloud-name' \\"
    echo "    '123456789012345' \\"
    echo "    'abcdefghijklmnopqrstuvwxyz123456' \\"
    echo "    'http://localhost:8001'"
    echo ""
    echo "💡 ALTERNATIVA: Usa generate_env.sh per creare template da modificare manualmente"
    echo "   ./generate_env.sh"
    exit 1
fi

# Parametri
MONGO_URL="$1"
CLOUDINARY_CLOUD_NAME="$2"
CLOUDINARY_API_KEY="$3"
CLOUDINARY_API_SECRET="$4"
BACKEND_URL="${5:-http://localhost:8001}"
EMERGENT_LLM_KEY="${6:-}"

# Genera SECRET_KEY
SECRET_KEY=$(openssl rand -hex 32)

# Directory di lavoro
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📝 Generazione SECRET_KEY..."
echo "✅ SECRET_KEY: $SECRET_KEY"
echo ""

# Crea backend/.env
echo "📝 Creazione backend/.env..."
cat > "$PROJECT_DIR/backend/.env" << EOF
# MongoDB Configuration
MONGO_URL=$MONGO_URL
DB_NAME=gravelmatch

# JWT Secret Key
SECRET_KEY=$SECRET_KEY

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET

# Emergent AI Integration (optional)
EMERGENT_LLM_KEY=$EMERGENT_LLM_KEY
EOF

echo "✅ backend/.env creato!"
echo ""

# Crea frontend/.env
echo "📝 Creazione frontend/.env..."
cat > "$PROJECT_DIR/frontend/.env" << EOF
REACT_APP_BACKEND_URL=$BACKEND_URL
EOF

echo "✅ frontend/.env creato!"
echo ""

# Riepilogo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Configurazione Completata!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ File configurati:"
echo "   - $PROJECT_DIR/backend/.env"
echo "   - $PROJECT_DIR/frontend/.env"
echo ""
echo "✅ Credenziali configurate:"
echo "   MongoDB: gravelmatch"
echo "   Cloudinary: $CLOUDINARY_CLOUD_NAME"
echo "   Backend URL: $BACKEND_URL"
echo ""
echo "🚀 Prossimi passi:"
echo ""
echo "Test locale:"
echo "  cd $PROJECT_DIR"
echo "  docker-compose up --build"
echo ""
echo "Deploy su Render:"
echo "  Copia le variabili da backend/.env nella dashboard Render"
echo "  Vedi QUICK_START.md per dettagli"
echo ""
