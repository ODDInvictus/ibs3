# Invictus Bier Systeem 3

Invictus Bier Systeem is _het_ websysteem voor O.D.D. Invictus.

## Ontwikkelen

Om te beginnen met ontwikkelen moet je eerst de repository clonen met
```console
git clone git@github.com:ODDInvictus/ibs3.git
```
_als dit niet lukt moet je even je SSH keys instellen op GitHub_

Daarna moet je een .env maken, dit kan door de .env.example te kopieren en te hernoemen. Deze moet je nog wel even invullen. Zie hiervoor het kopje Environment Variables

Als laatst moet je de database client genereren.
```console
npx prisma generate
```

Daarna kan je de development server starten met `npm run dev`


## Tasks

IBS3 is in staat om dingen op de achtergrond te draaien, buiten een request om. Dit is nice voor dingen die (redelijk) wat tijd kosten, zoals emails versturen. Hiervoor gebruiken we een Quirrel server. Deze start in development automatisch op als je `npm run dev` doet. Je kan dan de QuirrelUI openen op `http://localhost:9181`. 

### Hoe maak ik een task aan?
Een task maken is erg simpel. Maak eerst in $lib/server/jobs een bestand aan in de juiste directory.

job.ts
```ts
import { Queue } from 'quirrel/sveltekit'

export const queue = Queue(
  // URL waar je deze methode kan vinden
  "jobs/notifications/discord",
  async (job, meta) => {
    // Job om uit te voeren
  },
)
```

Daarna maak je in src/jobs een +server.ts aan op hetzelfde adres die je net hebt gedefineerd

```ts
import { queue } from '$lib/server/jobs/discord';

export const POST = queue
```

Daarna kan je deze job uitvoeren door

```ts
import { queue } from '$lib/server/jobs/xx'

await queue.enqueue(jobData)
```

te doen.

Voor cronjobs kan je jobs/ldap/sync bekijken

## Production

  voer `quirrel ci` uit om de cronjobs te laten werken


## Environment Variables

|Sleutel|Waarde|Voorbeeld|
|-|-|-|
|DATABASE_URL|MySQL connection string|mysql://ibs3:password@mariadb:3306/ibs3?schema=public|
|IBS_CLIENT_ID|Client ID in Authentik|ibs|
|IBS_CLIENT_SECRET|Client Secret in Authentik|bjdsbjadshbjsbjsdbjabdhwvdksd|
|IBS_ISSUER|Issuer url vanuit Authentik|https://auth.example.com/application/o/ibs/|
|ORIGIN|URL waar deze app gevonden kan worden|https://ibs.example.com|
|QUIRREL_BASE_URL|Base url voor Quirrel (dit is hetzelfde als ORIGIN behalve als je iets hebt als jobs.example.com)|https://ibs.example.com|
|DISABLE_TELEMETRY|Zet Quirrel Telemetry uit (doe maar true)|true|
|DISCORD_NOTIFICATION_WEBHOOK|Webhook URL voor discord kanaal waar errors in gepost worden|https://discord.com/api/webhooks/server/key|
