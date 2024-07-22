DELIMITER $$

CREATE PROCEDURE setReferralCode(
    IN blox_id_in VARCHAR(255),
    IN referral_code_in VARCHAR(255),
    IN code_active_in BOOLEAN
)
BEGIN
    -- Check if the user exists
    IF EXISTS (SELECT 1 FROM users WHERE blox_id = blox_id_in) THEN
        -- Check if the referral code already exists
        IF NOT EXISTS (SELECT 1 FROM codes WHERE referral_code = referral_code_in) THEN
            -- Insert the new referral code
            INSERT INTO codes (referral_code, blox_id, code_active) 
            VALUES (referral_code_in, blox_id_in, code_active_in);
        ELSE
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Referral code already exists';
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not exist';
    END IF;
END$$

DELIMITER ;
