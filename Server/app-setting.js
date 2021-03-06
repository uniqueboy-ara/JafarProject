module.exports = {
    portNo: 4000,
    db: {
        mongo: { 
            main: {
                name: 'NeginDB',
                address: 'localhost:27017'
            },
            log: {
                name: 'NeginDB_log',
                address: 'localhost:27017' 
            }
        },
        sqlConfig: {
            driver: 'mssql',
            config: {
                user: 'sa',
                password: '8854po',
                server: '172.24.17.15',
                database: 'NeginDb',
                pool: {
                    max: 10,
                    min: 0,
                    idleTimeoutMillis: 60000
                }
            }
        }
    },
    jwtExpireTime: 3000,
    tokenHashKey: '8c10%$#f9be0b053082',
    requiresAuth: true,
    jwtSecret: "9057c4f0-b57e-4320-9a7e-c028bc3e54cb"
}
