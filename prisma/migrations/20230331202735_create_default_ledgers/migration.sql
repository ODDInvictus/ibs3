-- This is an empty migration.
INSERT IGNORE INTO `Ledger` (`id`, `name`, `description`)
VALUES (4500, 'Inkomsten verkoop generiek', 'Verkoop van iets (persoon -> Invictus)'),
       (4501, 'Inkomsten verkoop bier', 'Verkoop van bier (persoon -> Invictus)'),
       (4502, 'Inkomsten verkoop frituur', 'Verkoop van frituur (persoon -> Invictus)'),
       (3100, 'Uitgaven declaratie generiek', 'Declaratie generiek (Invictus -> persoon)'),
       (3101, 'Uitgaven declaratie bier', 'Declaratie voor bier (Invictus -> persoon)'),
       (3102, 'Uitgaven declaratie frituur', 'Declaratie frituur (Invictus -> persoon)');
