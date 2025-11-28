# Funzionalità CardMarket Integrate 🎴

Questo documento descrive tutte le funzionalità ispirate a CardMarket che sono state integrate nell'applicazione Pokemon Price Tracker.

## 📋 Panoramica

L'applicazione ora include funzionalità professionali per il tracking dei prezzi delle carte Pokemon, ispirate alla struttura e alle funzionalità di CardMarket, il principale marketplace europeo per carte collezionabili.

## ✨ Nuove Funzionalità

### 1. **Condizioni della Carta** 💎
- **Near Mint (NM)** - Carta in condizioni quasi perfette
- **Excellent (EX)** - Carta in ottime condizioni
- **Good (GD)** - Carta in buone condizioni
- **Light Played (LP)** - Carta con lievi segni di usura
- **Played (PL)** - Carta con evidenti segni di usura
- **Poor (PO)** - Carta in cattive condizioni

Ogni prodotto può specificare la condizione, e i prezzi possono essere tracciati per condizione specifica.

### 2. **Lingua ed Edizione** 🌍
- **Lingua**: Italiano, Inglese, Giapponese, Francese, Tedesco, Spagnolo, ecc.
- **Edizione**: 1st Edition, Unlimited, Shadowless, Reverse Holo, ecc.

Traccia varianti linguistiche ed edizioni speciali per valorizzazioni accurate.

### 3. **Watchlist / Preferiti** ⭐
- Aggiungi prodotti alla watchlist per monitoraggio rapido
- Accesso dedicato dalla navbar
- Visualizzazione prezzi e trend in tempo reale
- Indicatori visivi per prodotti con alert attivi

**Come usare:**
- Clicca l'icona stella ⭐ nella pagina prodotto
- Visita `/watchlist` per vedere tutti i prodotti seguiti

### 4. **Price Alerts** 🔔
- Imposta soglie di prezzo personalizzate
- Alert "below" - notifica quando il prezzo scende sotto la soglia
- Alert "above" - notifica quando il prezzo sale sopra la soglia
- Gestione multipla alerts per prodotto

**API Endpoints:**
```
POST /api/products/:id/alerts
GET /api/products/:id/alerts
DELETE /api/products/alerts/:alertId
```

### 5. **Trend Prezzi** 📈📉
- Calcolo automatico del trend confrontando ultimi due prezzi
- Indicatori visivi:
  - **↑** Verde = Prezzo in aumento
  - **↓** Rosso = Prezzo in diminuzione
  - **—** Grigio = Prezzo stabile

Visibile in:
- Lista prodotti
- Watchlist
- Dettaglio prodotto

### 6. **Note Personali** 📝
- Aggiungi note personali a ogni prodotto
- Ricorda dettagli importanti (stato confezione, provenienza, ecc.)
- Modificabili in qualsiasi momento

**API Endpoints:**
```
POST /api/products/:id/note
GET /api/products/:id/note
DELETE /api/products/:id/note
```

### 7. **Valore Collezione** 💰
- Calcolo automatico del valore totale
- Basato su quantità posseduta × prezzo corrente
- Dashboard dedicata con:
  - Valore totale in €
  - Numero totale carte possedute

**Esempio:**
```
Valore Totale: €2,450.00
Carte Possedute: 87
```

### 8. **Quantità Posseduta** 📦
- Traccia quante copie possiedi di ogni prodotto
- Usato per calcolare valore collezione
- Utile per gestione inventario

### 9. **Export CSV** 📊
- Esporta l'intera collezione in formato CSV
- Include tutti i campi:
  - ID, Nome, Categoria
  - Set, Rarità, Numero
  - Condizione, Lingua, Edizione
  - Quantità posseduta
  - Prezzo corrente e trend
  - Link esterni

**File generato:** `pokemon-collection-YYYY-MM-DD.csv`

### 10. **Filtri Avanzati** 🔍
Supporto backend per filtraggio su:
- Range di prezzo
- Trend (solo in aumento/diminuzione)
- Condizione specifica
- Lingua
- Presenza di alert
- Prodotti in watchlist

## 🗄️ Schema Database Aggiornato

### Tabella `products`
```sql
- condition TEXT (Near Mint, Excellent, ecc.)
- language TEXT (Italiano, Inglese, ecc.)
- edition TEXT (1st Edition, Unlimited, ecc.)
- is_watched INTEGER (0/1)
- owned_quantity INTEGER (default 0)
```

### Tabella `price_history`
```sql
- condition TEXT (condizione al momento del prezzo)
```

### Nuova Tabella `price_alerts`
```sql
CREATE TABLE price_alerts (
  id INTEGER PRIMARY KEY,
  product_id INTEGER,
  target_price REAL,
  alert_type TEXT (below/above),
  is_active INTEGER,
  created_at DATETIME
)
```

### Nuova Tabella `user_notes`
```sql
CREATE TABLE user_notes (
  id INTEGER PRIMARY KEY,
  product_id INTEGER,
  note TEXT,
  created_at DATETIME,
  updated_at DATETIME
)
```

## 🔌 Nuove API

### Watchlist
- `POST /api/products/:id/watchlist` - Toggle watchlist
- `GET /api/products/watchlist/all` - Tutti i prodotti in watchlist

### Price Alerts
- `POST /api/products/:id/alerts` - Crea alert
- `GET /api/products/:id/alerts` - Lista alerts prodotto
- `DELETE /api/products/alerts/:alertId` - Elimina alert

### Notes
- `POST /api/products/:id/note` - Salva/aggiorna nota
- `GET /api/products/:id/note` - Leggi nota
- `DELETE /api/products/:id/note` - Elimina nota

### Collection
- `GET /api/products/collection/value` - Valore totale collezione

## 🎨 Nuovi Componenti Frontend

### `PriceTrend.tsx`
Componente per visualizzare indicatori di trend con icone colorate.

```tsx
<PriceTrend trend="up" size="lg" />
```

### `CollectionDashboard.tsx`
Dashboard con valore totale collezione e statistiche.

### `Watchlist.tsx`
Pagina dedicata per visualizzare prodotti in watchlist.

### `exportCSV.ts`
Utility per esportare dati in formato CSV.

```tsx
import { exportToCSV } from './utils/exportCSV';
exportToCSV(products);
```

## 🚀 Come Usare le Nuove Funzionalità

### Aggiungere un Prodotto con Dettagli Completi
1. Vai su "Aggiungi Prodotto"
2. Compila i campi base (nome, categoria, set)
3. Specifica:
   - Condizione (es. Near Mint)
   - Lingua (es. Italiano)
   - Edizione (es. 1st Edition)
   - Quantità posseduta
4. Aggiungi prezzo iniziale
5. Salva

### Monitorare un Prodotto
1. Apri il prodotto
2. Clicca sulla stella ⭐ per aggiungerlo alla watchlist
3. Imposta un price alert con soglia desiderata
4. Aggiungi note personali se necessario
5. Accedi rapidamente dalla sezione Watchlist

### Esportare la Collezione
1. Vai alla lista prodotti
2. Clicca "Esporta CSV" (quando implementato nell'UI)
3. Scarica il file con tutti i dati

### Vedere il Valore Totale
1. La dashboard mostra automaticamente:
   - Valore totale basato su prezzi correnti
   - Numero totale carte nella collezione
2. Aggiorna automaticamente quando modifichi quantità

## 📱 Navigazione Aggiornata

La navbar ora include:
- **Prodotti** - Lista completa
- **⭐ Watchlist** - Prodotti preferiti
- **+ Aggiungi** - Nuovo prodotto

## 🎯 Vantaggi Rispetto a Prima

### Prima:
- Tracking base dei prezzi
- Solo campi essenziali
- Nessun sistema di alert
- Nessuna organizzazione collezione

### Ora (Con Features CardMarket):
- ✅ Tracking professionale con condizioni
- ✅ Watchlist per monitoraggio rapido
- ✅ Alert automatici sui prezzi
- ✅ Calcolo valore collezione
- ✅ Note personali
- ✅ Trend visivi immediati
- ✅ Export dati completo
- ✅ Gestione inventario con quantità

## 🔮 Prossimi Sviluppi Possibili

1. **Notifiche Email** per price alerts
2. **Grafici comparativi** tra condizioni diverse
3. **Scanner codice a barre** per aggiunta rapida
4. **Integrazione API CardMarket** per prezzi automatici
5. **Statistiche avanzate** (ROI, volatilità, ecc.)
6. **Wishlist** separata da collezione posseduta
7. **Trade calculator** per scambi equi
8. **Market insights** con prezzi medi mercato

## 💡 Best Practices

1. **Sempre specificare la condizione** - influenza molto il valore
2. **Usa price alerts** per occasioni d'acquisto
3. **Aggiorna regolarmente le quantità** per valore corretto
4. **Aggiungi note** per dettagli importanti
5. **Esporta periodicamente** per backup dati
6. **Monitora i trend** per timing vendite/acquisti

## 📚 Riferimenti

- [CardMarket](https://www.cardmarket.com/it/Pokemon) - Ispirazione per features
- Database SQLite per storage efficiente
- React + TypeScript per UI type-safe
- REST API con Express per backend scalabile

---

**Sviluppato con ❤️ per i collezionisti Pokemon**
