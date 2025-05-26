const mongoose = require('mongoose');

const config = require('../config/db.config');

const initMongoDB = async () => {
    try {
        const { user } = config.mongoDb;
        const pwd = config.mongoDb.password;
        const { url } = config.mongoDb;
        const { db } = config.mongoDb;

        await mongoose.connect(
            `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
        );
        console.log('Mongo connection successfully established!');
    } catch (e) {
        console.log('Error while setting up mongo connection', e);
        throw e;
    }
};

module.exports = initMongoDB;
