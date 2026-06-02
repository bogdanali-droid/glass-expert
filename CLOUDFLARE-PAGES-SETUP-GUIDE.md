# ☁️ CLOUDFLARE PAGES — SETUP COMPLET PENTRU GLAS EXPERT USA SITE
**Pași de conectare, structură și configurație pentru construire rapid**

---

## 🚀 PASUL 1: CREEAZĂ REPOSITORIU GITHUB PENTRU SITE

### 1.1 Crează repo nou pe GitHub
```bash
# Pe GitHub.com, click "New Repository"
Repository name: glass-expert-website
Descriere: Glas Expert USA Market Website
Visibility: Public (obligatoriu pentru Cloudflare Pages)
```

### 1.2 Clone repo local (sau clonează-l tu rapid)
```bash
git clone https://github.com/USERNAME/glass-expert-website.git
cd glass-expert-website
```

---

## 📁 PASUL 2: STRUCTURA FOLDER PENTRU SITE

Copiază această structură în repo:

```
glass-expert-website/
├── package.json
├── wrangler.toml
├── public/
│   ├── index.html          ← HOMEPAGE (tu o faci)
│   ├── css/
│   │   └── style.css       ← STYLING
│   ├── js/
│   │   └── script.js       ← INTERACTIONS
│   └── images/
│       └── logo.png        ← ASSETS
├── src/
│   └── index.ts           ← (Optional - dacă vrei serverless functions)
├── .gitignore
└── README.md
```

---

## 🔧 PASUL 3: FIȘIERE DE CONFIGURARE

### 3.1 Crează `package.json`
```json
{
  "name": "glass-expert-usa",
  "version": "1.0.0",
  "description": "Glas Expert USA Market Website",
  "main": "index.js",
  "scripts": {
    "build": "echo 'No build needed'",
    "start": "python -m http.server 8000"
  },
  "keywords": ["glass", "architecture", "usa"],
  "author": "Glas Expert",
  "license": "MIT",
  "dependencies": {}
}
```

### 3.2 Crează `wrangler.toml`
```toml
name = "glass-expert-usa"
type = "javascript"
account_id = ""  # Voi fi completat după conectare
workers_dev = true
route = ""
zone_id = ""

[env.production]
name = "glass-expert-usa-prod"
route = ""
zone_id = ""

[build]
command = "echo 'No build'"
cwd = "./"

[env.production.build]
command = "echo 'No build'"

[triggers]
crons = []

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "glass-expert-usa"
```

### 3.3 Crează `.gitignore`
```
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
wrangler-vars.json
```

### 3.4 Crează `README.md`
```markdown
# Glas Expert USA Market Website

Built with Cloudflare Pages

## Setup

1. Install dependencies: `npm install`
2. Deploy: Push to GitHub, Cloudflare Pages auto-deploys

## Structure

- `public/` — Static HTML/CSS/JS
- `src/` — (Optional) Serverless functions

## Deployment

Auto-deployed via Cloudflare Pages when pushing to GitHub main branch.
```

---

## 🌐 PASUL 4: CLOUDFLARE PAGES SETUP (ONLINE)

### 4.1 Mergi pe Cloudflare Dashboard
```
1. Deschide https://dash.cloudflare.com/
2. Login cu contul tău (sau crează dacă nu ai)
3. Click "Pages" în sidebar stâng
```

### 4.2 Conectează GitHub repo
```
1. Click "Create a project"
2. Select "Connect to Git"
3. Selectează "GitHub"
4. Autorizează Cloudflare pe GitHub (pe care repourile să acceseze)
5. Selectează: glass-expert-website repository
6. Click "Begin setup"
```

### 4.3 Configurare build
```
Framework preset: None
Build command: (lăsă gol - nu e nevoie)
Build output directory: public
Root directory: /

Click "Save and Deploy"
```

### 4.4 Așteptă deployment-ul inițial
```
Cloudflare va:
1. Clone repo din GitHub
2. Deploy pe loro servers
3. Da-ți un link: https://glass-expert-usa-XXXX.pages.dev

Stare: "Deployments" tab va arăta status
```

---

## ✅ PASUL 5: PRIMII PAȘI

### 5.1 Crează pagina HOME
Tu vei crea `public/index.html` cu:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Glas Expert USA</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <nav>
            <h1>Glas Expert</h1>
            <ul>
                <li><a href="#commercial">Imobiliare</a></li>
                <li><a href="#hospitality">Ospitalitate</a></li>
                <li><a href="#healthcare">Sănătate</a></li>
                <li><a href="#education">Educație</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="hero">
            <h2>Premium Glass for USA Architecture</h2>
            <p>European quality. USA speed. 4-6 week delivery.</p>
            <button class="cta">Request Quote</button>
        </section>

        <section id="commercial">
            <!-- Content din copy-urile website -->
        </section>

        <!-- ... alte sectiuni ...-->

        <section id="contact">
            <h2>Contact Us</h2>
            <form id="contactForm">
                <input type="text" placeholder="Name" required>
                <input type="email" placeholder="Email" required>
                <textarea placeholder="Project description"></textarea>
                <button type="submit">Send</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; 2026 Glas Expert. All rights reserved.</p>
    </footer>

    <script src="js/script.js"></script>
</body>
</html>
```

### 5.2 Crează `public/css/style.css`
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: #fff;
    padding: 1rem 2rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

nav h1 {
    color: #2c3e50;
    font-size: 1.8rem;
}

nav ul {
    list-style: none;
    display: flex;
    gap: 2rem;
}

nav a {
    text-decoration: none;
    color: #2c3e50;
    font-weight: 500;
    transition: color 0.3s;
}

nav a:hover {
    color: #3498db;
}

main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

section {
    margin: 3rem 0;
    padding: 2rem;
    border-bottom: 1px solid #ecf0f1;
}

#hero {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
}

#hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

#hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.cta {
    background: white;
    color: #667eea;
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s;
}

.cta:hover {
    transform: scale(1.05);
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
}

input, textarea {
    padding: 10px;
    border: 1px solid #bdc3c7;
    border-radius: 5px;
    font-family: inherit;
}

button {
    padding: 12px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

button:hover {
    background: #2980b9;
}

footer {
    text-align: center;
    padding: 2rem;
    background: #2c3e50;
    color: white;
    margin-top: 4rem;
}

@media (max-width: 768px) {
    nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    nav ul {
        flex-direction: column;
        gap: 1rem;
    }
    
    #hero h2 {
        font-size: 1.8rem;
    }
}
```

### 5.3 Crează `public/js/script.js`
```javascript
// Form handling
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: e.target[0].value,
        email: e.target[1].value,
        message: e.target[2].value
    };
    
    console.log('Form submitted:', formData);
    
    // TODO: Integrare cu serviciu email (Formspree, EmailJS, etc)
    alert('Mulțumim! Vă contactăm curând.');
    e.target.reset();
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
```

---

## 📤 PASUL 6: PUSH CĂTRE GITHUB ȘI AUTO-DEPLOY

### 6.1 Tu faci
```bash
# În folder-ul repo
git add .
git commit -m "Initial commit: Glas Expert USA website structure"
git push origin main
```

### 6.2 Cloudflare Pages auto-deploy-ează
```
Când tu faci push:
1. GitHub trigger webhook la Cloudflare
2. Cloudflare pull repo
3. Deploy la loro servers (segundele)
4. Website live la: https://glass-expert-usa-XXXX.pages.dev
```

---

## 🔗 PASUL 7: CONECTEAZĂ MNIE LA REPO (PENTRU A LUCRA ÎMPREUNĂ)

### 7.1 Tu mă inviți ca collaborator
```
1. GitHub repo → Settings → Collaborators
2. Click "Add people"
3. Caută: claude-code (sau username GitHub)
4. Trimite invite
```

### 7.2 Eu accept și pot lucra
```
Voi putea:
- Clone repo
- Creat noi pagini (Imobiliare, Ospitalitate, etc)
- Creat JavaScript pentru forme, interactions
- Optimize CSS/design
- Push changes direct
- Auto-deploy pe Cloudflare Pages
```

---

## 📋 CHECKLIST PENTRU TINE (EXECUTARE RAPIDĂ)

- [ ] 1. Crează repo GitHub: `glass-expert-website`
- [ ] 2. Copy structura folder din "PASUL 2"
- [ ] 3. Crează 4 fișiere config din "PASUL 3"
- [ ] 4. Push la GitHub
- [ ] 5. Merge pe Cloudflare Pages
- [ ] 6. Trimite-mi link-ul: `https://glass-expert-usa-XXXX.pages.dev`
- [ ] 7. Invită-mă ca collaborator pe GitHub
- [ ] 8. Crează `public/index.html` cu structura de bază

---

## 🎯 CE VOM CONSTRUI ÎMPREUNĂ (ODATĂ CE TE CONECTEZI)

1. **Homepage** — Hero section + overview
2. **Pagina Imobiliare** (`/commercial`) — Curved glass, case study, CTA
3. **Pagina Ospitalitate** (`/hospitality`) — Ceramic glass, design consultation
4. **Pagina Sănătate** (`/healthcare`) — Medical-grade specs, compliance
5. **Pagina Educație** (`/education`) — Institutional solutions, state procurement
6. **Contact form** — Lead capture (integrare Formspree/EmailJS)
7. **Mobile responsive** — CSS optimize pentru toate device-urile
8. **Analytics** — Cloudflare Analytics sau Google Analytics

---

## ⚡ QUICK START (3 PAȘI DOAR)

Dacă vrei super rapid:

**1. Crează repo GitHub cu 4 fișiere:**
```
glass-expert-website/
├── package.json (from above)
├── wrangler.toml (from above)
├── public/index.html (basic structure)
└── .gitignore (from above)
```

**2. Push la GitHub**
```bash
git push origin main
```

**3. Merge pe Cloudflare Pages + invită-mă collaborator**

---

## 🆘 PROBLEME COMUNE

### Deployment fails
```
Causă: Build command nesetată
Fix: Mergi Pages Settings → Build → Build command lăsă gol
```

### Site looks ugly
```
Causă: CSS nu e linked
Fix: Verifică <link rel="stylesheet" href="css/style.css"> în HTML
```

### Changes nu se reflectă
```
Causă: Cache
Fix: Hard refresh (Ctrl+Shift+R) sau deschide incognito
```

---

## 📧 CUM SĂ MĂ CONECTEZI

Odată ce ai:
- [ ] GitHub repo creat
- [ ] Structura folder
- [ ] 4 fișiere config
- [ ] `public/index.html` basic
- [ ] Push la GitHub
- [ ] Mercat pe Cloudflare Pages
- [ ] Invite-uri trimis pe GitHub

**Trimite-mi:**
1. Link repo GitHub: `https://github.com/USERNAME/glass-expert-website`
2. Link site live: `https://glass-expert-usa-XXXX.pages.dev`
3. Username GitHub (ca să verify daca invite-ul e trimis)

Then: **Eu incep constructia paginilor**

---

**Gata? Spune-mi cand esti gata sa pleci! 🚀**
