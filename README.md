![#Invictus Bier Systeem](https://raw.githubusercontent.com/ODDInvictus/ibs3/main/static/ibs_logo_v2.png)

Invictus Bier Systeem is _het_ websysteem voor O.D.D. Invictus.

## Ontwikkelen

Om te beginnen met ontwikkelen moet je eerst de repository clonen met

```console
git clone git@github.com:ODDInvictus/ibs3.git
```

_als dit niet lukt moet je even je SSH keys instellen op GitHub_

Daarna moet je een .env maken, dit kan door de .env.example te kopieren en te hernoemen. Deze moet je nog wel even invullen. Zie hiervoor het kopje [Environment Variables](#environment-variables)

Als laatst moet je de database client genereren en dependencies installeren.

```console
npm install
npx prisma generate
cd backend; npm install
```

Hierna moet je je database opzetten, zie kopje [Database](#database)

Daarna kan je de development server starten met `npm run dev`

## Database

IBS3 gebruikt 3 databases, MariaDB, MongoDB en Redis.

### MariaDB

Om MariaDB lokaal te draaien moet je even een kopie van de productie database maken, en dan kan je aan de slag.
Er is ook een gehoste development database, vraag Niels hierna.

### Redis en mongo

Redis en mongo zijn niet verplicht, je kan ze uitschakelen met de volgende environment variables:

```
DISABLE_MONGO=true
DISABLE_REDIS=true
```

Redis is makkelijk lokaal te draaien in docker.

```console
docker run -d -p 6379:6379 --name redis redis
```

Zelfde geldt voor Mongo

```console
docker run -d -p 27017:27017 --name mongo mongo
```

## Tasks

IBS3 is in staat om dingen op de achtergrond te draaien, buiten een request om. Dit is nice voor dingen die (redelijk) wat tijd kosten, zoals emails versturen. Hiervoor gebruiken we een express/node-cron backend. Deze start in development automatisch op als je `npm run dev` doet.

### Cronjobs

Een cronjob is een functie die elke x tijd draait. Zo'n functie kan je maken in `/backend/index.ts`.

```ts
//            crontab    , functie
cron.schedule('1 * * * *', syncLDAPUsers)
// Deze functie wordt elk hele uur uitgevoerd (10:00, 11:00, 12:00) etc
```

Om te helpen met het maken van een crontab kan je [crontab guru](https://crontab.guru/) gebruiken

## Maluspunten

Maluspunten kan worden uitgeschakeld met een environment variable:

```
PUBLIC_MALUSPUNTEN_ENABLED=true
```

## Environment Variables

| Sleutel                      | Waarde                                                                                | Voorbeeld                                             |
| ---------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| DATABASE_URL                 | MySQL connection string                                                               | mysql://ibs3:password@mariadb:3306/ibs3?schema=public |
| IBS_CLIENT_ID                | Client ID in Authentik                                                                | ibs                                                   |
| IBS_CLIENT_SECRET            | Client Secret in Authentik                                                            | bjdsbjadshbjsbjsdbjabdhwvdksd                         |
| IBS_ISSUER                   | Issuer url vanuit Authentik                                                           | https://auth.example.com/application/o/ibs/           |
| AUTHENTIK_BASE_URL           | Base URL van Authentik                                                                | https://auth.example.com                              |
| AUTHENTIK_GROUP_NAME         | Naam van de groep met alle IBS gebruikers                                             | ibs3_users                                            |
| AUTHENTIK_TOKEN              | Access token van service account                                                      | aaasDJKASJDHSAJKHDLOIJASHDIABDSKJASJKDJKAS            |
| ORIGIN                       | URL waar deze app gevonden kan worden                                                 | https://ibs.example.com                               |
| DISCORD_NOTIFICATION_WEBHOOK | Webhook URL voor discord kanaal waar errors in gepost worden                          | https://discord.com/api/webhooks/server/key           |
| BACKEND_PORT                 | Poort waarop de backend draait                                                        | 3001                                                  |
| UPLOAD_FOLDER                | Map op de schijf waar uploads opgeslagen worden                                       | ./static/upload                                       |
| PUBLIC_UPLOAD_URL            | URL waar de uploads gevonden kunnen worden                                            | /upload/                                              |
| BACKEND_URL                  | URL waar de backend op te vinden is                                                   | http://localhost:3000                                 |
| UPLOAD_FOLDER                | Pad waar foto's naar geupload worden                                                  | ./upload                                              |
| PUBLIC_UPLOAD_URL            | Oude url naar de static server                                                        | http://localhost:8000                                 |
| STATIC_FOLDER                | Waar static files gevonden kunnen worden                                              | ./static                                              |
| IMAGE_CACHE_TIME             | Hoelang een image in de cache blijft                                                  | 86400                                                 |
| QUOTE_API_URL                | Url naar de quote api                                                                 | ...                                                   |
| QUOTE_API_TOKEN              | API Token voor de quote api                                                           | ...                                                   |
| PUBLIC_SPOTIFY_CLIENT_ID     | Client id voor spotify                                                                | ...                                                   |
| SPOTIFY_CLIENT_SECRET        | Client secret voor spotify                                                            | ...                                                   |
| PUBLIC_SPOITFY_REDIRECT_URI  | Redirect uri voor spotify, alles van spotify is alleen nodig voor de playlist feature | http://localhost:5173/playlist/callback               |
| DISABLE_REDIS                | Schakel redis uit, jobs en cache werkt niet meer                                      | true                                                  |
| DISABLE_MONGO                | Schakel mongodb uit, bestanden uploaden en fotos werken niet meer                     | true                                                  |
| PUBLIC_MALUSPUNTEN_ENABLED   | Schakelt maluspunten in (in het menu)                                                 | true                                                  |
