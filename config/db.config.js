const config = {
    mongoDb: {
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
        url: process.env.MONGODB_URL,
        db: process.env.MONGODB_DB,
    },
    listPerPage: 10,
};
module.exports = config;
