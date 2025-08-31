# Pequedex

Pequedex é um app Expo/React Native que lista e gerencia Pokémon com CRUD completo. O backend é um Node.js/Express conectado a MySQL (Aiven) com TLS obrigatório.
As imagens dos Pokémon são manipuladas por URL (estática e animada) e, quando o usuário faz upload local, o backend envia o arquivo para um provedor de armazenamento de arquivos/imagens (ex.: Cloudinary/S3/UploadThing) e salva apenas as URLs no MySQL. Assim, os dados ficam disponíveis para qualquer usuário em qualquer dispositivo.

**API pública**: [https://pequedex.onrender.com](https://pequedex.onrender.com)

O app (Expo) consome a API via [`primeiro-app/apiUrl.js`](./primeiro-app/apiUrl.js).

## Sumário
- [Arquitetura](#arquitetura)
- [Pasta do projeto](#pasta-do-projeto)
- [Banco de Dados (Aiven MySQL)](#banco-de-dados-aiven-mysql)
- [Backend (pokemon-backend)](#backend-pokemon-backend)
  - [Variáveis de ambiente](#variáveis-de-ambiente)
  - [Rotas da API](#rotas-da-api)
  - [Modelo de dados](#modelo-de-dados)
  - [Seed e utilitários](#seed-e-utilitários)
- [Frontend (primeiro-app – Expo)](#frontend-primeiro-app--expo)
  - [Configuração de ícone e nome](#configuração-de-ícone-e-nome)
  - [Atualização por Pull-to-Refresh](#atualização-por-pull-to-refresh)
  - [Build do APK com EAS](#build-do-apk-com-eas)
- [Deploy](#deploy)
  - [Aiven (MySQL)](#aiven-mysql)
  - [Render (Backend)](#render-backend)
- [Testes rápidos](#testes-rápidos)
- [Solução de problemas](#solução-de-problemas)
- [Licença](#licença)

## Arquitetura
```
[ Expo / React Native (primeiro-app) ]
        |  HTTPS (CORS)
        v
[ Node.js / Express (pokemon-backend) ]  --TLS-->
        |  Grava/consulta
        v
[ Aiven MySQL (JSON + numéricos) ]

Uploads locais: App -> /api/upload -> (Cloudinary/S3) -> URL salva no MySQL
URLs diretas:  App envia as URLs -> MySQL
```

## Pasta do projeto
```
Pequedex/
├─ pokemon-backend/         # API Node.js/Express
│  ├─ server.js             # servidor + rotas CRUD
│  ├─ seedMysql.js          # popula o banco (PokeAPI -> MySQL)
│  ├─ fixJsonFields.js      # corrige/normaliza JSON no banco
│  ├─ pokemons.js           # utilidades
│  ├─ .env                  # credenciais (NÃO commitar)
│  └─ ca.pem                # certificado CA da Aiven (usado em DEV)
│
├─ primeiro-app/            # app Expo/React Native
│  ├─ App.js / Page6.js     # telas principais (lista + CRUD)
│  ├─ services/backend.js   # client da API
│  ├─ apiUrl.js             # BASE_URL da API (Render)
│  ├─ app.json              # config Expo (nome, ícones, pacote)
│  └─ assets/               # ícones e splash
│
└─ test-pequedex.ps1        # script de teste rápido da API/CRUD (PowerShell)
```

## Banco de Dados (Aiven MySQL)

Plano gratuito com 1 GB de armazenamento.

Conexão obrigatória com TLS (modo SSL = REQUIRED).

Use CA certificate da Aiven (`ca.pem`) em DEV; em produção no Render use Secret File para o CA e a env `DB_CA_FILE`.

Tabela principal:
```sql
CREATE TABLE IF NOT EXISTS pokemons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  types JSON NOT NULL,         -- ex: ["grass","poison"]
  stats JSON NOT NULL,         -- ex: {"hp":45,"attack":49,...}
  height DOUBLE,
  weight DOUBLE,
  abilities JSON NOT NULL,     -- ex: ["overgrow","chlorophyll"]
  sprites JSON NOT NULL        -- ex: {"frontDefault":"https://...png","animated":"https://...gif"}
);
```

Imagens: o banco guarda apenas URLs das imagens. Arquivos binários devem ir para um storage (Cloudinary/S3 etc.).

## Backend (pokemon-backend)

### Variáveis de ambiente
Crie `pokemon-backend/.env`:
```
# Aiven MySQL
DB_HOST=pequedex-db-xxxxxxx.g.aivencloud.com
DB_PORT=26258
DB_USER=avnadmin
DB_PASSWORD=**************
DB_NAME=defaultdb

# TLS
DB_CA_FILE=/etc/secrets/aiven-ca.pem   # ou use DB_CA_CERT com o conteúdo do PEM

# Server
PORT=3000
```

Em DEV local você pode apontar `DB_CA_FILE=./ca.pem`.
No Render, use Secret File (`/etc/secrets/aiven-ca.pem`) e configure `DB_CA_FILE` para esse caminho.

### Rotas da API
```
GET /api/pokemons        – lista todos
GET /api/pokemons/:id    – detalhe
POST /api/pokemons       – cria
PUT /api/pokemons/:id    – atualiza
DELETE /api/pokemons/:id – apaga
POST /api/upload         – opcional: recebe multipart/form-data (file) e devolve { url }
```

Payload de criação/edição:
```json
{
  "name": "Pikachu",
  "types": ["electric"],
  "stats": { "hp": 35, "attack": 55, "defense": 40, "speed": 90, "specialAttack": 50, "specialDefense": 50 },
  "height": 0.4,
  "weight": 6.0,
  "abilities": ["static", "lightning-rod"],
  "sprites": {
    "frontDefault": "https://.../pikachu.png",   // aparece na grade/lista
    "animated": "https://.../pikachu.gif"        // aparece nos detalhes
  }
}
```

O backend valida e converte os campos JSON para evitar erros como “is not valid JSON”.

### Modelo de dados
A API serializa/deserializa os campos JSON, então o app recebe objetos/arrays prontos.

### Seed e utilitários
```
node seedMysql.js      # importa Pokémon da PokeAPI e preenche a tabela
node fixJsonFields.js  # corrige registros com JSON inválido
```

Script de teste (PowerShell, na raiz do repo):
```
powershell -ExecutionPolicy Bypass -File .\test-pequedex.ps1 -BaseUrl "https://pequedex.onrender.com"
```

## Frontend (primeiro-app – Expo)

A URL da API fica em `primeiro-app/apiUrl.js`.

CRUD integrado via `services/backend.js`.

Suporte a:
- URLs de imagens (PNG/JPG para `frontDefault` e GIF para `animated`).
- Uploads locais (imagem estática ou GIF). O app chama `/api/upload` e salva a URL retornada na API.

### Configuração de ícone e nome
No `app.json`:
```json
{
  "expo": {
    "name": "Pokedex",
    "slug": "pokedex",
    "icon": "./assets/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.seuusuario.pokedex"
    },
    "ios": {
      "bundleIdentifier": "com.seuusuario.pokedex"
    }
  }
}
```
Dica: `icon.png` deve ter fundo transparente.

### Atualização por Pull-to-Refresh
A lista usa `FlatList` com `RefreshControl` e animação. Arraste de cima para baixo para recarregar os dados da API. Os cards exibem `sprites.frontDefault`; na modal de detalhes aparece `sprites.animated` (GIF) ou, se ausente, cai no estático.

### Build do APK com EAS
1. Instale e autentique-se:
   ```bash
   npm install -g eas-cli
   cd primeiro-app
   eas login
   eas build:configure
   ```
2. Gerar APK instalável:
   ```bash
   eas build -p android --profile apk
   ```
   O link de download aparece ao final do build. Para Play Store, use `--profile production` e envie o `.aab` com `eas submit`.

Se o APK não aparecer, verifique se o profile `apk` existe no `eas.json`.

## Deploy

### Aiven (MySQL)
Crie o serviço MySQL e copie: host, port, user, password, `defaultdb` e CA certificate.
Configure a env `DB_CA_FILE` (ou `DB_CA_CERT`) no backend.
`SSL mode REQUIRED`.

### Render (Backend)
1. Crie um novo Web Service e conecte ao repositório GitHub.
2. Build command: `npm install`
3. Start command: `node server.js`
4. Environment → Secret File: coloque o `aiven-ca.pem` em `/etc/secrets/aiven-ca.pem`.
5. Variáveis de ambiente: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_CA_FILE=/etc/secrets/aiven-ca.pem`, `PORT=3000`.
6. A URL pública será algo como `https://pequedex.onrender.com`.

Atenção: o free tier do Render sofre “spin down” por inatividade (primeira requisição pode demorar ~50s).

## Testes rápidos

Ping simples à API:
```bash
curl https://pequedex.onrender.com/api/pokemons/1
```

Script de teste (Windows/PowerShell, na raiz do repo):
```bash
powershell -ExecutionPolicy Bypass -File .\test-pequedex.ps1 -BaseUrl "https://pequedex.onrender.com"
```
Ele valida: URL do front, `GET`, `POST`, `PUT`, `DELETE` e imagens (`PNG/GIF`).

## Solução de problemas
- Verifique variáveis de ambiente e certificados TLS.
- Consulte logs do Render e do serviço Aiven para detalhes de erros.
- Certifique-se de que o backend está acessível via HTTPS.

## Licença
Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

