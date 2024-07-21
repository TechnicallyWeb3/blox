DELIMITER $$

CREATE PROCEDURE getUserData(
    IN blox_id_in VARCHAR(255)
)
BEGIN
    SELECT *
    FROM users
    WHERE blox_id = blox_id_in;
END$$

DELIMITER ;