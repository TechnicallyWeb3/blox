-- Clear and create the database
DROP DATABASE IF EXISTS blox_db;
CREATE DATABASE blox_db;

-- Use the newly created or existing database
USE blox_db;

-- Create or update the users table
CREATE TABLE IF NOT EXISTS users (
    user_index INT AUTO_INCREMENT PRIMARY KEY,
    registered_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_date DATETIME ON UPDATE CURRENT_TIMESTAMP,
    blox_id VARCHAR(255) UNIQUE NOT NULL,
    dynamic_id VARCHAR(255) UNIQUE NOT NULL,
    total_points INT DEFAULT 0
);

-- Create or update the referrals table
CREATE TABLE IF NOT EXISTS referrals (
    blox_id VARCHAR(255) NOT NULL,
    referrer_id VARCHAR(255),
    direct_referrals INT UNSIGNED DEFAULT 0,
    indirect_referrals INT UNSIGNED DEFAULT 0,
    PRIMARY KEY (blox_id),
    FOREIGN KEY (blox_id) REFERENCES users(blox_id),
    FOREIGN KEY (referrer_id) REFERENCES users(blox_id)
);

-- Create or update the codes table
CREATE TABLE IF NOT EXISTS codes (
    referral_code VARCHAR(255) PRIMARY KEY,
    blox_id VARCHAR(255) NOT NULL,
    code_active BOOLEAN DEFAULT TRUE,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_date DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (blox_id) REFERENCES users(blox_id)
);

-- Create or update the points table
CREATE TABLE IF NOT EXISTS points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blox_id VARCHAR(255) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    amount INT NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    FOREIGN KEY (blox_id) REFERENCES users(blox_id),
    FOREIGN KEY (issuer) REFERENCES users(blox_id)
);

-- Procedure for adding users
-- CALL addUser(dynamicId, bloxId, referrerCode);
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

-- Procedure for setting a user's referral code
-- CALL setReferralCode(bloxId, referralCode, isActive);

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

-- Procedure for adding or removing points (negative numbers remove)
-- CALL modifyPoints(bloxId, pointsAmount:int, issuerId, reason);

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


-- CALL getReferralData('efac5eac-65e7-48f3-9bbd-296a300f295b')
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


-- CALL getReferralCodeData('efac5eac-65e7-48f3-9bbd-296a300f295b')
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


-- CALL getPointData('efac5eac-65e7-48f3-9bbd-296a300f295b')
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