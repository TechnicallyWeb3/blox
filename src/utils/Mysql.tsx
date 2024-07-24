import mysql from 'mysql2/promise';

const dbConnectionInfo = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}

export async function addUser(userId: string, dynamicId: string, referralCode: string = "") {
    const connection = await mysql.createConnection(dbConnectionInfo);

    try {
        return await connection.execute('CALL addUser(?, ?, ?)', [userId, dynamicId, referralCode]);
    } catch(err) {
        console.error(err);
    } finally {
        connection.end();
    }
    
}

export async function setReferralCode(userId: string, referralCode: string, isActive: boolean = true) {
    const connection = await mysql.createConnection(dbConnectionInfo);

    try {
        return await connection.execute('CALL setReferralCode(?, ?, ?)', [userId, referralCode, isActive]);
    } catch(err) {
        console.error(err);
    } finally {
        connection.end();
    }
    
}

// export async function unsetReferralCode(userId: string, referralCode: string, isActive: boolean = false) {
//     const connection = await mysql.createConnection(dbConnectionInfo);

//     try {
//         return await connection.execute('CALL setReferralCode(?, ?, ?)', [userId, referralCode, isActive]);
//     } catch(err) {
//         console.error(err);
//     } finally {
//         connection.end();
//     }
    
// }

export async function  getUserData(userId: string) {
    const connection = await mysql.createConnection(dbConnectionInfo);

    try {
        return await connection.execute('CALL getUserData(?)', [userId]);
    } catch(err) {
        console.error(err);
    } finally {
        connection.end();
    }
    
}

export async function getReferralData(userId: string) {
    const connection = await mysql.createConnection(dbConnectionInfo);

    try {
        return await connection.execute('CALL getReferralData(?)', [userId]);
    } catch(err) {
        console.error(err);
    } finally {
        connection.end();
    }
    
}

export async function getReferralCodeData(userId: string) {
    const connection = await mysql.createConnection(dbConnectionInfo);

    try {
        return await connection.execute('CALL getReferralCodeData(?)', [userId]);
    } catch(err) {
        console.error(err);
    } finally {
        connection.end();
    }
    
}

export async function getPointData(userId: string) {
    const connection = await mysql.createConnection(dbConnectionInfo);

    try {
        return await connection.execute('CALL getPointData(?)', [userId]);
    } catch(err) {
        console.error(err);
    } finally {
        connection.end();
    }
    
}