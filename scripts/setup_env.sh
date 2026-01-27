#!/bin/bash

# Script per configurare le variabili d'ambiente
echo "🚀 Setup Variabili d'Ambiente per GravelMatch"
echo "=============================================="
echo ""

# Backend .env
if [ ! -f backend/.env ]; then
    echo "📝 Creazione backend/.env..."
    cp backend/.env.example backend/.env

    # Genera SECRET_KEY
    SECRET_KEY=$(openssl rand -hex 32)
    sed -i "s/your-super-secret-jwt-key-here-change-in-production/$SECRET_KEY/" backend/.env

    echo "✅ File backend/.env creato!"
    echo "⚠️  IMPORTANTE: Modifica backend/.env con le tue credenziali:"
    echo "   - MONGO_URL"
    echo "   - CLOUDINARY credentials"
    echo "   - EMERGENT_LLM_KEY (opzionale)"
else
    echo "⚠️  backend/.env già esistente, saltato."
fi

echo ""

# Frontend .env
if [ ! -f frontend/.env ]; then
    echo "📝 Creazione frontend/.env..."
    cp frontend/.env.example frontend/.env
    echo "✅ File frontend/.env creato!"
    echo "⚠️  Modifica REACT_APP_BACKEND_URL se necessario"
else
    echo "⚠️  frontend/.env già esistente, saltato."
fi

echo ""
echo "✅ Setup completato!"
echo ""
echo "Prossimi passi:"
echo "1. Modifica backend/.env con le tue credenziali"
echo "2. (Opzionale) Modifica frontend/.env con l'URL del backend"
echo "3. Esegui: docker-compose up --build"
echo ""
