const {MongoClient} = require('mongodb');
const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';
const port = process.env.API_SERVER_PORT || 3000;
let db;

async function getNextSequence(name){
    const result = await db.collection('counters').findOneAndUpdate(
        {_id:name},
        {$inc:{current:1}},
        {returnOriginal:false },
    );
    return result.value.current;
}

async function connectToDb(){
    const client = new MongoClient(url,{useUnifiedTopology:true} );
    await client.connect();
    console.log('Connected to MongoDB at', port);
    db = client.db();
}

function getDatabase(){
    return db;
}

module.exports ={getNextSequence, connectToDb, getDatabase}