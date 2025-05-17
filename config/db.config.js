const config = {
    db: {
        /* don't expose password or any sensitive info, done only for demo */
        host: process.env.DB_HOST,
        user: process.env.DB_USER, // Provide your user here
        password: process.env.DB_PASSWORD, // Provide your password here
        database: process.env.DB_NAME, // Provide your db name here
        connectTimeout: 60000,
    },
    mongoDb: {
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
        url: process.env.MONGODB_URL,
        db: process.env.MONGODB_DB
    },
    listPerPage: 10,
};
module.exports = config;