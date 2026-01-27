#!/bin/bash

echo "🧪 Test Configurazione GravelMatch"
echo "=================================="
echo ""

cd /home/user/stravatinder/backend

# Test MongoDB
echo "🍃 Test connessione MongoDB..."
python3 << 'EOF'
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
mongo_url = os.getenv('MONGO_URL')

if not mongo_url or 'YOUR_PASSWORD' in mongo_url:
    print("❌ MONGO_URL non configurata! Modifica backend/.env")
    exit(1)

try:
    client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
    client.server_info()
    print("✅ MongoDB connesso correttamente!")
    print(f"   Database disponibili: {client.list_database_names()[:3]}...")
except Exception as e:
    print(f"❌ Errore MongoDB: {e}")
    print("   Controlla username, password e Network Access su Atlas")
    exit(1)
EOF

if [ $? -ne 0 ]; then
    exit 1
fi

echo ""

# Test Cloudinary
echo "☁️  Test configurazione Cloudinary..."
python3 << 'EOF'
import cloudinary
from dotenv import load_dotenv
import os

load_dotenv()
cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
api_key = os.getenv('CLOUDINARY_API_KEY')
api_secret = os.getenv('CLOUDINARY_API_SECRET')

if not cloud_name or cloud_name == 'your-cloud-name':
    print("❌ Cloudinary non configurato! Modifica backend/.env")
    exit(1)

try:
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret
    )
    print("✅ Cloudinary configurato correttamente!")
    print(f"   Cloud Name: {cloud_name}")
except Exception as e:
    print(f"❌ Errore Cloudinary: {e}")
    exit(1)
EOF

if [ $? -ne 0 ]; then
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Tutti i test passati! Sei pronto per:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🐳 Test locale con Docker:"
echo "   cd /home/user/stravatinder"
echo "   docker-compose up --build"
echo ""
echo "🚀 Deploy su Render:"
echo "   Segui QUICK_START.md per istruzioni complete"
echo ""
