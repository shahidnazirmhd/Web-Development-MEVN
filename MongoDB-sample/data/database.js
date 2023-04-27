const mongodb=require("mongodb");
const mongoClient=mongodb.MongoClient;

let database;

async function connect() {
    //const client = await mongoClient.connect("mongodb://localhost:27017");
    const client = await mongoClient.connect("mongodb://127.0.0.1:27017");
    database = client.db("blogdb");
}

function getDb() {
    if (!database) {
        throw {message: "Database connection not established"};
    }
    return database;
    
}

module.exports = {
    connectToDb: connect,
    getDb: getDb
};