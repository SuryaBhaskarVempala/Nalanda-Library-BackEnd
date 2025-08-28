const mongoose = require("mongoose");
const logger = require("../Utils/logger");


//DataBase Connection : 
function connection(url){
    mongoose.connect(url)
        .then(() => {
            logger.info('Connected to MongoDB');
        })
        .catch((err) => {
            logger.error('Error connecting to MongoDB:');
        });
}

module.exports = connection;
