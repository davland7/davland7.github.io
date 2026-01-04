# Radio Browser

Un site web pour explorer et tester les stations de radio du monde entier via l'API [Radio Browser](https://www.radio-browser.info/).

## 🎯 Fonctionnalités

- 📡 Recherche de stations par **pays** ou par **genre musical**
- 🎵 Lecture en direct avec lecteur audio intégré
- 🔗 Intégration avec [RPlayer](http://rplayer.js.org/)
- 🌍 Support multilingue avec données de Radio Browser
- 🚀 Site statique généré avec Astro (Jamstack)

## 📚 Exemple de données API

Voici un exemple de station retournée par l'API Radio Browser :

```json
{
  "changeuuid": "995271ec-0ae5-4efd-844d-82aec16e7451",
  "stationuuid": "bf2c0f68-a97e-4f53-a453-e7a1c22254c0",
  "serveruuid": "a704b855-0a6d-4ecb-b184-bbfdb0951aa1",
  "name": "CHBW 94.5 \"Rewind Radio\" Rocky Mountain House, AB",
  "url": "https://stream.jpbgdigital.com/CHBW/HEAAC/48k/playlist.m3u8",
  "url_resolved": "https://stream.jpbgdigital.com/CHBW/HEAAC/48k/playlist.m3u8",
  "homepage": "https://945rewindradio.ca/",
  "favicon": "https://media.socastsrm.com/uploads/station/2596/site_header_logo-612e745083660.jpg",
  "tags": "80's,90's",
  "country": "Canada",
  "countrycode": "CA",
  "iso_3166_2": "",
  "state": "Alberta",
  "language": "english",
  "languagecodes": "en",
  "votes": 15,
  "codec": "AAC+",
  "bitrate": 48,
  "hls": 1,
  "lastcheckok": 1,
  "clickcount": 39,
  "clicktrend": -2
}
```

## 🛠️ Commandes

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder le site pour la production
npm run build

# Prévisualiser le build
npm run preview
```

## 📁 Structure du projet

```
src/
├── pages/
│   ├── index.md              # Accueil
│   └── [category]/
│       └── [...slug].astro   # Pages dynamiques (pays/genres/stations)
├── components/
│   └── StationCard.astro     # Carte de station
├── layouts/
│   └── Layout.astro          # Layout principal
├── lib/
│   ├── radioBrowser.ts       # API Radio Browser
│   ├── types.ts              # Types TypeScript
│   ├── utils.ts              # Utilitaires
│   └── content.ts            # Contenu statique
└── styles/
    └── global.css            # Styles globaux
```

## 🔗 API utilisée

- **Radio Browser API** : https://www.radio-browser.info/
- Endpoints utilisés :
  - `/countries` - Liste des pays
  - `/tags` - Liste des genres
  - `/stations/search` - Recherche de stations

## 📄 Licence

MIT
