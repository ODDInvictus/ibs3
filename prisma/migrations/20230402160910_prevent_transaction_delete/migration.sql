-- Migration that makes the transaction table immutable

-- Prevent a row in the Transadction table from being deleted
CREATE TRIGGER prevent_transaction_delete 
BEFORE DELETE 
ON `Transaction`
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transaction table is immutable';
END;