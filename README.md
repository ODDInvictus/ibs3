# Invictus Bier Systeem 3

Invictus Bier Systeem is _het_ websysteem voor O.D.D. Invictus.

## Ontwikkelen

Om te beginnen met ontwikkelen moet je eerst de repository clonen met
```console
git clone git@github.com:ODDInvictus/ibs3.git
```
_als dit niet lukt moet je even je SSH keys instellen op GitHub_

Daarna moet je een .env maken, dit kan door de .env.example te kopieren en te hernoemen. Deze moet je nog wel even invullen. Zie hiervoor het kopje [Environment Variables](#environment-variables)

Als laatst moet je de database client genereren.
```console
npx prisma generate
```

Daarna kan je de development server starten met `npm run dev`


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

## Production

Paar willekeurige notities voor draaien in production

### Jobs

* In je webserver configuratie moet je de backend beveiligen. Dit is omdat deze geen authenticatie laag heeft. Dit is erg simpel om te doen in nginx:
```
location /jobs {
  allow 192.168.0.0/16;
  deny any;
  proxy_pass route_naar_ibs3_backend;
}
```


## Environment Variables

|Sleutel|Waarde|Voorbeeld|
|-|-|-|
|DATABASE_URL|MySQL connection string|mysql://ibs3:password@mariadb:3306/ibs3?schema=public|
|IBS_CLIENT_ID|Client ID in Authentik|ibs|
|IBS_CLIENT_SECRET|Client Secret in Authentik|bjdsbjadshbjsbjsdbjabdhwvdksd|
|IBS_ISSUER|Issuer url vanuit Authentik|https://auth.example.com/application/o/ibs/|
|AUTHENTIK_BASE_URL|Base URL van Authentik|https://auth.example.com|
|AUTHENTIK_GROUP_NAME|Naam van de groep met alle IBS gebruikers|ibs3_users|
|AUTHENTIK_TOKEN|Access token van service account|aaasDJKASJDHSAJKHDLOIJASHDIABDSKJASJKDJKAS|
|ORIGIN|URL waar deze app gevonden kan worden|https://ibs.example.com|
|DISCORD_NOTIFICATION_WEBHOOK|Webhook URL voor discord kanaal waar errors in gepost worden|https://discord.com/api/webhooks/server/key|
