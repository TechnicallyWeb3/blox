-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS blox_db;

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