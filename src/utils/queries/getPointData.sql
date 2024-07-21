DELIMITER $$

CREATE PROCEDURE getPointData(
    IN blox_id_in VARCHAR(255)
)
BEGIN
    SELECT *
    FROM points
    WHERE blox_id = blox_id_in;
END$$

DELIMITER ;