# Invictus Bier Systeem 3

Huts

## Ontwikkelen

Om te beginnen met ontwikkelen moet je eerst de repository clonen met
```console
git clone git@github.com:ODDInvictus/ibs3.git
```

Daarna moet je een .env maken, dit kan door de .env.example te kopieren en te hernoemen. Deze moet je nog wel even invullen. Zie hiervoor het kopje Environment Variables

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

TODO lol