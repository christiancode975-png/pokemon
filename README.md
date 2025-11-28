# Pokemon Price Tracker ⚡

Applicazione web completa per monitorare i prezzi dei prodotti Pokemon (carte, booster box, collection box, ecc.) con grafici interattivi per l'andamento storico dei prezzi.

## Caratteristiche Principali

- 📊 **Grafici Interattivi**: Visualizza l'andamento dei prezzi con grafici personalizzabili (1, 5, 10, 20 anni)
- 💰 **Tracking Prezzi**: Monitora i prezzi dei tuoi prodotti Pokemon preferiti nel tempo
- 📈 **Statistiche Dettagliate**: Prezzi min/max/medio, variazioni percentuali e molto altro
- 🎴 **Gestione Prodotti**: Aggiungi carte, booster box, elite trainer box e altri prodotti
- 🔗 **Link Esterni**: Integrazione con CardMarket e altri marketplace
- 📱 **Responsive Design**: Interfaccia moderna e ottimizzata per tutti i dispositivi

## Tecnologie Utilizzate

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Recharts (grafici)
- React Router (navigazione)
- Axios (API calls)
- date-fns (gestione date)

### Backend
- Node.js + Express
- TypeScript
- SQLite (database)
- express-validator (validazione)

## Installazione

### Prerequisiti
- Node.js >= 18
- npm >= 9

### Setup

1. Clona il repository:
```bash
git clone <repository-url>
cd pokemon
```

2. Installa tutte le dipendenze:
```bash
npm run install:all
```

3. Configura le variabili d'ambiente per il backend:
```bash
cd backend
cp .env.example .env
```

## Avvio dell'Applicazione

### Modalità Sviluppo

Avvia sia frontend che backend contemporaneamente:
```bash
npm run dev
```

Questo avvierà:
- Frontend su http://localhost:3000
- Backend su http://localhost:3001

### Avvio Separato

Frontend:
```bash
npm run dev:frontend
```

Backend:
```bash
npm run dev:backend
```

### Modalità Produzione

1. Build dell'applicazione:
```bash
npm run build
```

2. Avvia il server:
```bash
npm start
```

## Struttura del Progetto

```
pokemon/
├── frontend/                 # Applicazione React
│   ├── src/
│   │   ├── components/      # Componenti riutilizzabili
│   │   │   ├── Layout.tsx
│   │   │   ├── PriceChart.tsx
│   │   │   └── StatisticsCard.tsx
│   │   ├── pages/           # Pagine principali
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   └── AddProduct.tsx
│   │   ├── api.ts           # Client API
│   │   ├── types.ts         # TypeScript types
│   │   └── App.tsx
│   └── package.json
│
├── backend/                  # API Server
│   ├── src/
│   │   ├── models/
│   │   │   └── Product.ts   # Model e query database
│   │   ├── routes/
│   │   │   └── products.ts  # Routes API
│   │   ├── database.ts      # Setup database
│   │   └── index.ts         # Entry point
│   └── package.json
│
└── package.json              # Root package
```

## API Endpoints

### Prodotti

- `GET /api/products` - Lista tutti i prodotti
- `GET /api/products/:id` - Dettagli prodotto
- `POST /api/products` - Crea nuovo prodotto
- `PUT /api/products/:id` - Aggiorna prodotto
- `DELETE /api/products/:id` - Elimina prodotto

### Prezzi

- `POST /api/products/:id/prices` - Aggiungi prezzo
- `GET /api/products/:id/prices` - Storico prezzi (con filtri data)
- `GET /api/products/:id/statistics` - Statistiche prezzi

## Utilizzo

### Aggiungere un Prodotto

1. Clicca su "Aggiungi Prodotto" nella navbar
2. Compila il form con i dettagli del prodotto:
   - Nome (obbligatorio)
   - Categoria (carte, booster box, ecc.)
   - Set, rarità, numero carta (opzionali)
   - Link a CardMarket o altri marketplace
   - Prezzo iniziale (opzionale)
3. Salva il prodotto

### Monitorare i Prezzi

1. Apri la pagina del prodotto
2. Visualizza le statistiche e il grafico dell'andamento
3. Aggiungi nuovi prezzi usando il form dedicato
4. Filtra l'andamento per periodo (1, 5, 10, 20 anni o tutto)

### Visualizzare i Grafici

I grafici mostrano:
- Andamento del prezzo nel tempo
- Linea temporale personalizzabile
- Tooltip con dettagli (data, prezzo, fonte)
- Colori Pokemon brand (rosso, blu, giallo)

## Database Schema

### Tabella `products`
- `id`: INTEGER PRIMARY KEY
- `name`: TEXT (nome prodotto)
- `category`: TEXT (categoria)
- `set_name`: TEXT (nome del set)
- `rarity`: TEXT (rarità)
- `card_number`: TEXT (numero carta)
- `image_url`: TEXT (URL immagine)
- `external_link`: TEXT (link esterno)
- `description`: TEXT (descrizione)
- `created_at`: DATETIME

### Tabella `price_history`
- `id`: INTEGER PRIMARY KEY
- `product_id`: INTEGER (FK to products)
- `price`: REAL (prezzo)
- `currency`: TEXT (valuta, default EUR)
- `source`: TEXT (fonte del prezzo)
- `recorded_at`: DATETIME

## Personalizzazione

### Colori Pokemon Brand
I colori principali sono definiti in `frontend/tailwind.config.js`:
- `pokemon-red`: #EE1515
- `pokemon-blue`: #0075BE
- `pokemon-yellow`: #FFCB05

### Aggiungere Nuove Categorie
Modifica l'array delle categorie in `frontend/src/pages/AddProduct.tsx`

## Troubleshooting

### Il backend non si avvia
- Verifica che la porta 3001 sia disponibile
- Controlla il file `.env` nella cartella backend

### Il frontend non carica i dati
- Verifica che il backend sia in esecuzione
- Controlla la console del browser per errori
- Verifica il proxy in `frontend/vite.config.ts`

### Errori di database
- Elimina il file `database.sqlite` e riavvia il backend
- Il database verrà ricreato automaticamente

## Licenza

Vedi file LICENSE per i dettagli.

## Supporto

Per problemi o suggerimenti, apri una issue nel repository GitHub.

---

Sviluppato con ❤️ per i fan di Pokemon e i collezionisti di carte 
