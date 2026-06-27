# BotJS — Bot Discord complet

Bot Discord en JavaScript (discord.js v14) avec les commandes slash les plus utilisées :
modération, utilitaires, fun, infos et musique.

## Installation

```bash
npm install
cp .env.example .env
```

Renseigne dans `.env` :
- `DISCORD_TOKEN` : le token de ton bot (portail développeur Discord)
- `CLIENT_ID` : l'ID de l'application
- `GUILD_ID` : (optionnel) l'ID d'un serveur pour déployer les commandes plus rapidement en dev

## Déploiement des commandes slash

```bash
npm run deploy
```

## Lancement du bot

```bash
npm start
```

## Commandes disponibles

### Modération
- `/kick` `/ban` `/unban` `/timeout` `/untimeout` `/clear` `/warn` `/warnings`

### Utilitaire
- `/ping` `/help` `/userinfo` `/serverinfo` `/avatar` `/poll` `/remind`

### Fun
- `/8ball` `/coinflip` `/dice` `/meme` `/rps`

### Info
- `/botinfo`

### Musique
- `/play` `/pause` `/resume` `/skip` `/stop` `/queue`

## Permissions requises sur le portail Discord

Active les intents **Server Members** et **Message Content** dans l'onglet "Bot"
de ton application, et invite le bot avec les permissions : Gérer les messages,
Expulser des membres, Bannir des membres, Modérer les membres, Se connecter/parler
en vocal.
