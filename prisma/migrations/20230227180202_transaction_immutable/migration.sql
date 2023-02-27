-- Migration that makes the transaction table immutable

-- Prevent the transaction table from being updated
-- for all columns except the "settled" column
CREATE TRIGGER prevent_transaction_update BEFORE UPDATE 
ON `Transaction`
FOR EACH ROW BEGIN
  SET NEW.id = OLD.id;
  SET NEW.ledgerId = OLD.ledgerId;
  SET NEW.description = OLD.description;
  SET NEW.createdAt = OLD.createdAt;
  SET NEW.price = OLD.price;
  SET NEW.fromId = OLD.fromId;
  SET NEW.toId = OLD.toId;
END
