DELIMITER $$

CREATE PROCEDURE addUser(
    IN dynamic_id_in VARCHAR(255),
    IN blox_id_in VARCHAR(255),
    IN referral_code_in VARCHAR(255)
)
BEGIN
    DECLARE referrer_blox_id VARCHAR(255);
    DECLARE referrers_referrer_blox_id VARCHAR(255);
    DECLARE current_blox_id VARCHAR(255);
    DECLARE current_points INT;

    -- Check if the user already exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE blox_id = blox_id_in) THEN
        -- Insert the new user into the users table
        INSERT INTO users (dynamic_id, blox_id) VALUES (dynamic_id_in, blox_id_in);

        -- Initialize the referral data
        INSERT INTO referrals (blox_id) VALUES (blox_id_in);

        -- If a referral code is provided
        IF referral_code_in IS NOT NULL THEN
            -- Get the referrer_blox_id from the codes table
            SELECT blox_id INTO referrer_blox_id 
            FROM codes 
            WHERE referral_code = referral_code_in AND code_active = TRUE;

            -- Update the referrer_id in the referrals table
            IF referrer_blox_id IS NOT NULL THEN
                UPDATE referrals 
                SET referrer_id = referrer_blox_id 
                WHERE blox_id = blox_id_in;

                -- Update the direct referrals of the referrer
                UPDATE referrals
                SET direct_referrals = direct_referrals + 1
                WHERE blox_id = referrer_blox_id;

                -- Points distribution
                SET current_blox_id = referrer_blox_id;
                SET current_points = 512;

                WHILE current_blox_id IS NOT NULL AND current_points >= 1 DO
                    -- Add points to the points table
                    INSERT INTO points (blox_id, amount, issuer, reason)
                    VALUES (current_blox_id, current_points, blox_id_in, 'Referral bonus');

                    -- Update the total points in the users table
                    UPDATE users
                    SET total_points = total_points + current_points
                    WHERE blox_id = current_blox_id;

                    -- Check if the current_blox_id has a referrer
                    SELECT referrer_id INTO referrers_referrer_blox_id
                    FROM referrals
                    WHERE blox_id = current_blox_id;

                    -- Update the indirect referrals of the referrer's referrer
                    IF referrers_referrer_blox_id IS NOT NULL THEN
                        UPDATE referrals
                        SET indirect_referrals = indirect_referrals + 1
                        WHERE blox_id = referrers_referrer_blox_id;
                    END IF;

                    -- Prepare for the next iteration
                    SET current_blox_id = referrers_referrer_blox_id;
                    SET current_points = FLOOR(current_points / 2);
                END WHILE;
            END IF;
        END IF;
    END IF;
END$$

DELIMITER ;