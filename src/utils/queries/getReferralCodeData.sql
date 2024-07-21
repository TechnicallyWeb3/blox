DELIMITER $$

CREATE PROCEDURE getReferralCodeData(
    IN blox_id_in VARCHAR(255)
)
BEGIN
    SELECT *
    FROM codes
    WHERE blox_id = blox_id_in;
END$$

DELIMITER ;