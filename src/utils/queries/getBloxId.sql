DELIMITER $$

CREATE PROCEDURE getBloxId(
    IN dynamic_id_in VARCHAR(255)
)
BEGIN
    SELECT blox_id
    FROM users
    WHERE dynamic_id = dynamic_id_in;
END$$

DELIMITER ;