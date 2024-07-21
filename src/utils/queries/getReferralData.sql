DELIMITER $$

CREATE PROCEDURE getReferralData(
    IN blox_id_in VARCHAR(255)
)
BEGIN
    SELECT *
    FROM referrals
    WHERE blox_id = blox_id_in;
END$$

DELIMITER ;