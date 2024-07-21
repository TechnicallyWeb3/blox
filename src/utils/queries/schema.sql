-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS blox_db;

-- Use the newly created or existing database
USE blox_db;

-- Create or update the users table
CREATE TABLE IF NOT EXISTS users (
    user_index INT AUTO_INCREMENT PRIMARY KEY,  -- Only one AUTO_INCREMENT column and it is defined as PRIMARY KEY
    registered_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    blox_id INT UNIQUE NOT NULL,  -- Removed AUTO_INCREMENT from this column
    dynamic_id VARCHAR(255) UNIQUE NOT NULL,
    total_points INT DEFAULT 0
);

-- Create or update the referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blox_id INT NOT NULL,
    referrer_id INT DEFAULT NULL,
    referral_code VARCHAR(255) DEFAULT NULL,
    direct_referrals INT UNSIGNED DEFAULT 0,
    indirect_referrals INT UNSIGNED DEFAULT 0,
    used TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL DEFAULT NULL,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (blox_id) REFERENCES users(blox_id),
    FOREIGN KEY (referrer_id) REFERENCES users(blox_id),
    KEY (blox_id),
    KEY (referrer_id)
);

-- Create or update the codes table
CREATE TABLE IF NOT EXISTS codes (
    referral_code VARCHAR(255) PRIMARY KEY,
    blox_id INT NOT NULL,
    code_active BOOLEAN DEFAULT TRUE,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (blox_id) REFERENCES users(blox_id)
);

-- Create or update the points table
CREATE TABLE IF NOT EXISTS points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blox_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    amount INT NOT NULL,
    issuer INT NOT NULL,
    reason TEXT NOT NULL,
    FOREIGN KEY (blox_id) REFERENCES users(blox_id),
    FOREIGN KEY (issuer) REFERENCES users(blox_id)
);