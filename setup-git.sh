#!/bin/bash
# Git setup script for Linux/Mac
# Futtasd le ezt a scriptet, hogy előkészítsd a projektet GitHub-ra való feltöltéshez

echo "🚀 Git inicializálása..."

# Git inicializálása
if [ ! -d .git ]; then
    git init
    echo "✅ Git repository inicializálva"
else
    echo "ℹ️  Git repository már létezik"
fi

# Összes fájl hozzáadása
echo "📦 Fájlok hozzáadása..."
git add .

# Commit létrehozása
echo "💾 Commit létrehozása..."
git commit -m "Initial commit: Takács website"

echo ""
echo "✅ Kész! Most add hozzá a GitHub remote-ot:"
echo ""
echo "git remote add origin https://github.com/USERNAME/REPO-NAME.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""
echo "Vagy használd a GitHub Desktop alkalmazást a könnyebb feltöltéshez!"

