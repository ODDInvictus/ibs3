-- Collectie van alle oude custom migrations voor 1.0.0

-- Create a new FinancialPerson with TYPE = 'INVICTUS', id 0
INSERT INTO `FinancialPerson` (`id`, `type`, `name`) VALUES ('0', 'INVICTUS', 'Invictus');

-- Migration that makes the transaction table immutable

-- Prevent the transaction table from being updated
-- for all columns except the "settled" column
CREATE TRIGGER prevent_transaction_update
BEFORE UPDATE
ON `Transaction`
FOR EACH ROW 
BEGIN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transaction table is immutable';
END;

-- Add default ledgers
INSERT IGNORE INTO `Ledger` (`id`, `name`, `description`)
VALUES (4500, 'Inkomsten verkoop generiek', 'Verkoop van iets (persoon -> Invictus)'),
       (4501, 'Inkomsten verkoop bier', 'Verkoop van bier (persoon -> Invictus)'),
       (4502, 'Inkomsten verkoop frituur', 'Verkoop van frituur (persoon -> Invictus)'),
       (3100, 'Uitgaven declaratie generiek', 'Declaratie generiek (Invictus -> persoon)'),
       (3101, 'Uitgaven declaratie bier', 'Declaratie voor bier (Invictus -> persoon)'),
       (3102, 'Uitgaven declaratie frituur', 'Declaratie frituur (Invictus -> persoon)');

-- Migration that makes the transaction table immutable

-- Prevent a row in the Transadction table from being deleted
CREATE TRIGGER prevent_transaction_delete 
BEFORE DELETE 
ON `Transaction`
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transaction table is immutable';
END;