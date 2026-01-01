# GitHub Pages Deployment útmutató

## Automatikus GitHub Pages deployment

A projekt már be van állítva automatikus GitHub Pages deployment-re GitHub Actions használatával!

### 1. GitHub Repository létrehozása

1. Menj a https://github.com oldalra és jelentkezz be
2. Kattints a jobb felső sarokban a "+" ikonra → "New repository"
3. Nevezd el a repository-t (pl. `takacs-website`)
4. Válaszd a "Public" opciót (GitHub Pages ingyenes verzióhoz szükséges)
5. NE jelöld be az "Initialize with README" opciót
6. Kattints a "Create repository" gombra

### 2. Projekt feltöltése GitHub-ra

Nyisd meg a terminált a projekt mappájában és futtasd le:

```bash
# Git inicializálása (ha még nincs)
git init

# Összes fájl hozzáadása
git add .

# Első commit
git commit -m "Initial commit: Takács website"

# GitHub repository hozzáadása (cseréld ki a USERNAME-t és REPO-NAME-t)
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# Feltöltés
git branch -M main
git push -u origin main
```

### 3. GitHub Pages beállítása

1. Menj a repository oldalára a GitHub-on
2. Kattints a **Settings** fülre
3. A bal oldali menüben kattints a **Pages** opcióra
4. **Source** résznél válaszd: **"GitHub Actions"**
5. Kattints a **Save** gombra

### 4. Automatikus deployment

A GitHub Actions automatikusan elindul, amikor:
- Push-olsz a `main` branch-re
- Vagy manuálisan indítod a workflow-t (Actions fül → "Deploy to GitHub Pages" → "Run workflow")

Az első deployment 2-3 percet vesz igénybe.

### 5. Weboldal elérése

A deployment után a weboldal elérhető lesz:
**`https://USERNAME.github.io/REPO-NAME`**

Például: `https://yourusername.github.io/takacs-website`

### 6. Frissítések

Minden alkalommal, amikor push-olsz a `main` branch-re, a GitHub Actions automatikusan újra build-eli és deploy-olja a weboldalt.

## Manuális deployment (ha szükséges)

Ha valamiért nem működik az automatikus deployment:

```bash
# Build
npm run build

# A build output az 'out' mappában lesz
# Ezt a mappát töltsd fel a gh-pages branch-re
```

## Hibaelhárítás

- **404 hiba**: Várj 1-2 percet, mert a deployment időt vesz igénybe
- **Build hiba**: Ellenőrizd a GitHub Actions fülön a hibaüzeneteket
- **Nem frissül**: Ellenőrizd, hogy a Pages beállításokban "GitHub Actions" van-e kiválasztva

