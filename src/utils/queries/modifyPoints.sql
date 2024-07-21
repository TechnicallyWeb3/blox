DELIMITER $$

CREATE PROCEDURE modifyPoints(
    IN blox_id_in VARCHAR(255),
    IN amount_in INT,
    IN issuer_in VARCHAR(255),
    IN reason_in TEXT
)
BEGIN
    -- Check if the issuer exists
    IF EXISTS (SELECT 1 FROM users WHERE blox_id = issuer_in) THEN
        -- Insert the new points record
        INSERT INTO points (blox_id, amount, issuer, reason) 
        VALUES (blox_id_in, amount_in, issuer_in, reason_in);

        -- Update the total points in the users table
        UPDATE users
        SET total_points = total_points + amount_in
        WHERE blox_id = blox_id_in;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Issuer does not exist';
    END IF;
END$$

DELIMITER ;