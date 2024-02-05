# Testing!

Hier horen alle unit, e2e, etc. tests te staan.

## Draai de bende

Om de e2e tests te runnen, gebruiken we docker voor een mock database en mock redis etc.

_Run geen redis in de achtergrond, anders faalt het scriptje_

run dit zooitje met `npm test`

_Zit je op windows? Run dit dan in git bash of WSL met docker!_

## Folder structuur

Houd bij elke test zoveel mogelijk de url structuur aan!

Bijvoorbeeld:

- Alle tests voor authenticatie staan in het mapje auth.
- Tests voor streeplijsten (horen te) staan in (app)/financieel etc.
