# Git setup script for Windows PowerShell
# Futtasd le ezt a scriptet, hogy előkészítsd a projektet GitHub-ra való feltöltéshez

Write-Host "🚀 Git inicializálása..." -ForegroundColor Green

# Git inicializálása
if (-not (Test-Path .git)) {
    git init
    Write-Host "✅ Git repository inicializálva" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Git repository már létezik" -ForegroundColor Yellow
}

# Összes fájl hozzáadása
Write-Host "📦 Fájlok hozzáadása..." -ForegroundColor Green
git add .

# Commit létrehozása
Write-Host "💾 Commit létrehozása..." -ForegroundColor Green
git commit -m "Initial commit: Takács website"

Write-Host ""
Write-Host "✅ Kész! Most add hozzá a GitHub remote-ot:" -ForegroundColor Green
Write-Host ""
Write-Host "git remote add origin https://github.com/USERNAME/REPO-NAME.git" -ForegroundColor Cyan
Write-Host "git branch -M main" -ForegroundColor Cyan
Write-Host "git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "Vagy használd a GitHub Desktop alkalmazást a könnyebb feltöltéshez!" -ForegroundColor Yellow

