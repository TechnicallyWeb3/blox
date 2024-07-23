import mysql from 'mysql2/promise';

// Create a connection to the database
export const getConnection = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1223Cale',
        database: 'blox_db',
    });
    return connection;
};