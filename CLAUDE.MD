# CLAUDE.md — Projeto Biovetfarma

> Este arquivo é um briefing completo para que qualquer instância de Claude possa continuar este projeto sem perder contexto. Leia tudo antes de começar.

-----

## 🎯 O que estamos construindo

Uma **landing page de farmácia veterinária** inspirada no site [penelope-care.com](https://penelope-care.com), com:

1. **Landing page pública** — scroll com transição de cores entre seções, carrossel de produtos por categoria, animações ao rolar
1. **Painel admin** — login Firebase, CRUD de produtos (título, descrição, imagem, preço, link de checkout, categoria)

O cliente é a **Biovetfarma** — farmácia veterinária brasileira.

-----

## 📋 Decisões já tomadas

|Tema                  |Decisão                                                                          |
|----------------------|---------------------------------------------------------------------------------|
|Tipo de negócio       |Farmácia veterinária / medicamentos                                              |
|Autenticação admin    |Firebase Auth (e-mail + senha)                                                   |
|Banco de dados        |Firebase Firestore                                                               |
|Imagens dos produtos  |Firebase Storage                                                                 |
|Hospedagem            |VPS Linux do cliente (já pago, tem espaço)                                       |
|Stack frontend        |React (build estático servido pelo Nginx)                                        |
|Stack backend         |Node.js + Express (API leve no mesmo VPS)                                        |
|Processo manager      |PM2 (mantém Node rodando em background)                                          |
|Proxy reverso         |Nginx — serve `/` (React) e roteia `/api` → Node:3001                            |
|Checkout              |Link externo por produto (qualquer plataforma — ainda não escolhida pelo cliente)|
|Quantidade de produtos|10 a 30                                                                          |
|Pantone / cores       |**PENDENTE** — cliente vai entregar                                              |
|Logo                  |**PENDENTE** — cliente vai entregar                                              |

-----

## 🎨 Referência visual (penelope-care.com)

O cliente gravou o site e tirou 14 screenshots. As técnicas identificadas foram:

### 1. Scroll-driven color transition

O fundo muda de cor conforme o usuário rola a página. Cada seção tem uma cor diferente. Implementar com `IntersectionObserver` trocando classes, ou CSS `animation-timeline: scroll()`.

```js
// Exemplo com IntersectionObserver
const sections = document.querySelectorAll('[data-bg]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.body.style.backgroundColor = entry.target.dataset.bg;
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => observer.observe(s));
```

### 2. Text reveal com scroll

Texto aparece parcialmente em cinza claro e escurece ao entrar na viewport. Usar GSAP ScrollTrigger ou CSS + IntersectionObserver.

### 3. Pill badges animados

Selos coloridos em forma de pílula (`border-radius: 50px`) rotacionados com `transform: rotate(-15deg)`.

### 4. Produtos em círculo

Imagens dos produtos dentro de `border-radius: 50%` com fundo colorido por categoria.

### 5. Carrossel horizontal de produtos

Scroll horizontal snapping entre produtos. No Penelope, o carrossel é por categoria.

### 6. Menu hambúrguer em duas cores

O menu aberto tem duas seções de cores diferentes (ex: vinho em cima, laranja embaixo).

### 7. Navbar fixa pill

Botões de ação (carrinho, usuário, menu) em uma pílula branca flutuante: `position: fixed`, `border-radius: 50px`.

-----

## 🏗️ Arquitetura do projeto

### Infraestrutura no VPS

```
VPS Linux
├── Nginx (porta 80/443)
│   ├── / → /var/www/biovetfarma/dist  (React estático)
│   └── /api → localhost:3001          (Node/Express)
└── PM2
    └── server (Node:3001 rodando em background)
```

Configuração Nginx:

```nginx
server {
    listen 80;
    server_name biovetfarma.com.br;

    # Frontend React
    root /var/www/biovetfarma/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend Node
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Estrutura de pastas do repositório

```
biovetfarma/
├── frontend/                         # React app
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── firebase.js               # Config Firebase
│   │   ├── App.jsx                   # Router: / e /admin
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   └── Admin.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Navbar pill fixa
│   │   │   ├── Hero.jsx
│   │   │   ├── ScrollSection.jsx     # Wrapper com cor de fundo
│   │   │   ├── ProductCarousel.jsx   # Carrossel horizontal
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CategoryMenu.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── admin/
│   │   │       ├── LoginForm.jsx
│   │   │       ├── ProductList.jsx
│   │   │       ├── ProductForm.jsx
│   │   │       └── ImageUpload.jsx
│   │   └── styles/
│   │       └── globals.css
│   └── package.json
│
├── backend/                          # Node/Express API
│   ├── src/
│   │   ├── index.js                  # Entry point Express
│   │   ├── routes/
│   │   │   ├── webhooks.js           # Webhook de pagamento
│   │   │   └── notifications.js      # Trigger de e-mails
│   │   ├── services/
│   │   │   ├── mailer.js             # Nodemailer + SMTP
│   │   │   └── cache.js              # Cache simples de produtos
│   │   └── middleware/
│   │       └── rateLimiter.js        # Proteção contra força bruta
│   ├── .env                          # Variáveis de ambiente (não commitar)
│   └── package.json
│
├── CLAUDE.md
└── README.md
```

-----

## 🗂️ Estrutura de dados (Firestore)

### Coleção `products`

```json
{
  "id": "auto-gerado",
  "title": "Ivermectina 1%",
  "description": "Antiparasitário de amplo espectro para cães e gatos.",
  "price": "R$ 38,90",
  "badge": "10ml",
  "category": "antiparasitarios",
  "imageUrl": "https://firebasestorage.../produto.jpg",
  "checkoutUrl": "https://link-de-pagamento.com/produto",
  "active": true,
  "order": 1,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Coleção `categories`

```json
{
  "id": "antiparasitarios",
  "name": "Antiparasitários",
  "color": "#2E6B4F",
  "order": 1
}
```

-----

## 🔐 Firebase — configuração necessária

O frontend React é um build estático servido pelo Nginx. O backend Node complementa onde o Firebase tem limitação.

Firebase precisa ser configurado no [console.firebase.google.com](https://console.firebase.google.com):

1. Criar projeto
1. Ativar **Authentication** → Email/Password
1. Criar **Firestore** database
1. Ativar **Storage**
1. Copiar credenciais para `src/firebase.js`

```js
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

-----

## 🎨 Paleta de cores oficial (Manual da Marca)

|Variável CSS           |Hex      |Nome              |Uso                      |
|-----------------------|---------|------------------|-------------------------|
|`--color-turquesa`     |`#3CB3C0`|Turquesa principal|Hero, navbar, destaques  |
|`--color-turquesa-dark`|`#1A7175`|Turquesa escuro   |Hover, sombras, contraste|
|`--color-verde`        |`#84C165`|Verde principal   |Botões, badges, seções   |
|`--color-verde-medio`  |`#9FD983`|Verde médio       |Backgrounds de seção     |
|`--color-verde-claro`  |`#CFF9B9`|Verde claro       |Backgrounds suaves       |
|`--color-creme`        |`#FEFED3`|Amarelo creme     |Footer, seção neutra     |
|`--color-musgo`        |`#D6D37F`|Amarelo musgo     |Bordas, detalhes         |
|`--color-text`         |`#000000`|Preto             |Tipografia principal     |

### Scroll de cores por seção (proposta)

|Seção               |Cor de fundo           |
|--------------------|-----------------------|
|Hero                |`#3CB3C0` (turquesa)   |
|Sobre / diferenciais|`#CFF9B9` (verde claro)|
|Produtos            |`#9FD983` (verde médio)|
|Categorias          |`#84C165` (verde)      |
|Footer              |`#FEFED3` (creme)      |

-----

## 🖼️ Assets pendentes do cliente

- [ ] Logo Biovetfarma (PNG ou SVG, fundo transparente)
- [ ] Pantone / cores oficiais da identidade visual
- [ ] Imagens dos produtos (podem ser carregadas depois pelo admin)
- [ ] Texto da seção “Sobre” / diferenciais da empresa
- [ ] Endereço, telefone, redes sociais para o footer

-----

## 🖥️ Backend Node/Express — o que faz

|Recurso                      |Detalhe                                                                               |
|-----------------------------|--------------------------------------------------------------------------------------|
|`POST /api/webhook/pagamento`|Recebe confirmação de pagamento da plataforma escolhida (Mercado Pago, PagSeguro etc.)|
|`POST /api/notify/pedido`    |Dispara e-mail pro admin quando novo pedido chega                                     |
|`GET /api/produtos/cache`    |Retorna produtos cacheados — evita leitura excessiva no Firestore                     |
|Rate limiter                 |Express-rate-limit nas rotas do admin — bloqueia força bruta                          |

### Variáveis de ambiente do backend (`.env`)

```env
PORT=3001
SMTP_HOST=smtp.seuprovedor.com.br
SMTP_PORT=587
SMTP_USER=noreply@biovetfarma.com.br
SMTP_PASS=senha_do_email
ADMIN_EMAIL=admin@biovetfarma.com.br
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
```

### Deploy no VPS

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar o backend
cd /var/www/biovetfarma/backend
pm2 start src/index.js --name biovetfarma-api

# Salvar para reiniciar automaticamente
pm2 save
pm2 startup
```

-----

## 🔤 Tipografia oficial (Manual da Marca)

|Font           |Peso        |Uso               |
|---------------|------------|------------------|
|**Surt Family**|Bold / Black|Títulos, headlines|
|**Kurye**      |Regular     |Corpo, descrições |

Surt e Kurye não estão no Google Fonts. Se os arquivos .ttf/.woff2 não estiverem disponíveis, usar:

- Surt → **Nunito** (Bold/Black) — proporções similares, rounded
- Kurye → **Jost** ou **DM Sans** (Light/Regular)

## 🖼️ Logos disponíveis (3 versões — exportar do Manual_da_Marca.pdf)

|Versão               |Descrição                                                  |Quando usar              |
|---------------------|-----------------------------------------------------------|-------------------------|
|**Horizontal**       |Ícone + “BIOVETFARMA / Manipulação Veterinária” lado a lado|Navbar, header           |
|**Circular**         |Ícone central com texto em arco                            |Favicon, avatar, selos   |
|**Colorido s/ fundo**|Branco sobre verde `#84C165` ou turquesa `#3CB3C0`         |Banners, seções coloridas|

Ícone: cruz veterinária com gato + cão + passarinho, estilo cartoon flat.

## 🌐 Domínio e URLs

|Ambiente          |URL                                   |
|------------------|--------------------------------------|
|Produção (landing)|`https://www.biovetfarma.com.br`      |
|Admin             |`https://www.biovetfarma.com.br/admin`|
|API backend       |`https://www.biovetfarma.com.br/api`  |

SSL: configurar Let’s Encrypt via Certbot no VPS.

## 🖼️ Assets pendentes do cliente

- [ ] Logo em SVG ou PNG transparente (exportar do Manual_da_Marca.pdf)
- [ ] Confirmar disponibilidade das fontes Surt e Kurye para web (arquivos .woff2)
- [ ] Imagens dos produtos (podem ser carregadas depois pelo painel admin)
- [ ] Texto da seção “Sobre” / diferenciais da empresa
- [ ] Endereço, telefone, redes sociais para o footer

-----

## ✅ O que foi feito até agora

- [x] Briefing completo e decisões de arquitetura
- [x] Análise das técnicas visuais do site de referência (penelope-care.com)
- [x] Definição da stack (React + Firebase + Node/Express + PM2)
- [x] Estrutura de dados do Firestore
- [x] Arquitetura de infraestrutura no VPS (Nginx como proxy reverso)
- [x] Identidade visual extraída do Manual da Marca (cores, tipografia, logos)
- [x] Domínio definido: www.biovetfarma.com.br
- [x] Este CLAUDE.md

## 🔜 Próximos passos

1. Exportar logo em SVG/PNG do Manual_da_Marca.pdf
1. Criar projeto frontend: `npm create vite@latest frontend -- --template react`
1. Criar projeto backend: `npm init` + Express, Nodemailer, express-rate-limit
1. Implementar Landing.jsx com scroll de cores e carrossel
1. Implementar Admin.jsx com Firebase Auth + CRUD
1. Implementar rotas backend (webhook + mailer)
1. Configurar Nginx + SSL (Certbot) + PM2 no VPS e fazer deploy

-----

## 💬 Estilo de comunicação com o cliente

- Roberto é o cliente, fala português brasileiro
- Comunicação direta e prática
- Gosta de referências visuais (manda screenshots)
- Projeto é sério mas tom é descontraído

-----

## 🧠 Notas técnicas importantes

- O carrossel deve usar `scroll-snap-type: x mandatory` no container e `scroll-snap-align: start` nos cards
- A transição de cor do fundo deve ser suave: `transition: background-color 0.8s ease`
- O painel admin fica em `/admin` — sem link público visível no site
- Imagens dos produtos: aceitar JPG e PNG, redimensionar para max 800px antes de subir no Storage
- O checkout é um link externo simples (`window.open(url, '_blank')`) — sem integração de pagamento no frontend
- Produtos inativos (`active: false`) não aparecem na landing page mas ficam no admin
- O backend Node **não substitui o Firebase** — apenas complementa com webhook, email e cache
- Nunca commitar o `.env` do backend nem o `firebase-service-account.json` no repositório
- O `try_files $uri $uri/ /index.html` no Nginx é obrigatório para o React Router funcionar (evita 404 no F5)

-----

*Última atualização: identidade visual, tipografia, logos e domínio adicionados*
*Designer do site de referência: **Good Fellas Studio** (crédito no rodapé do penelope-care.com)*