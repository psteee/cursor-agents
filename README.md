# Cursor Agents

Un progetto per interagire con gli agenti di Cursor utilizzando Bun e TypeScript.

## 📋 Descrizione

Questo progetto fornisce un'interfaccia per eseguire e interagire con gli agenti di Cursor tramite la CLI. Utilizza Bun come runtime e TypeScript per la tipizzazione.

## 🚀 Tecnologie Utilizzate

- **Bun** - Runtime JavaScript/TypeScript ad alte prestazioni
- **TypeScript** - Linguaggio di programmazione tipizzato
- **Cursor Agent CLI** - Strumento per interagire con gli agenti di Cursor

## 📁 Struttura del Progetto

```
cursor-agents/
├── index.ts          # File principale che esegue cursor-agent
├── package.json      # Configurazione del progetto e dipendenze
├── tsconfig.json     # Configurazione TypeScript
├── hello.py          # File di esempio Python
├── NOTES.md          # Note e shortcut utili
└── CLAUDE.md         # Regole e convenzioni per lo sviluppo
```

## 🛠️ Installazione

1. Assicurati di avere Bun installato sul tuo sistema:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. Installa le dipendenze:
   ```bash
   bun install
   ```

## 💻 Utilizzo

Esegui il file principale con Bun:

```bash
bun index.ts
```

Il progetto esegue il comando `cursor-agent` con il modello `composer-1` e stampa l'output.

## 📝 Script Principale

Il file `index.ts` contiene il codice principale che:

- Esegue il comando `cursor-agent` con il modello specificato
- Gestisce l'output dello stdout
- Stampa il risultato sulla console

```typescript
const child = Bun.spawn(["cursor-agent", "--model", "composer-1", "--print", 
    "Per favore creami un readme.md e riempilo con i dettagli di questo progetto"])

const result = await child.stdout.text();

console.log(result);
```

## ⚙️ Configurazione

### TypeScript

Il progetto utilizza una configurazione TypeScript moderna con:
- Target ESNext
- Supporto JSX React
- Modalità strict abilitata
- Module resolution bundler

### Bun

Il progetto è configurato per utilizzare Bun come runtime principale. Vedi `CLAUDE.md` per le convenzioni e le best practices.

## 📚 Note Aggiuntive

- Vedi `NOTES.md` per shortcut e comandi utili
- Vedi `CLAUDE.md` per le regole di sviluppo e convenzioni del progetto

## 📄 Licenza

Progetto privato.

## 🤝 Contribuire

Questo è un progetto privato. Per contribuire, contatta il maintainer del progetto.
