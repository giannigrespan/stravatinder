#!/bin/bash

# Script per generare una SECRET_KEY sicura
echo "🔐 Generazione SECRET_KEY per JWT"
echo "================================="
echo ""

SECRET_KEY=$(openssl rand -hex 32)

echo "La tua SECRET_KEY è:"
echo ""
echo "$SECRET_KEY"
echo ""
echo "Copia questa chiave e usala nella variabile SECRET_KEY del backend/.env"
echo ""
