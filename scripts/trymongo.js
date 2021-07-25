
const {MongoClient} = require('mongodb');
const url = 'mongodb://localhost/issuetracker';
require('dotenv').config();
const url = process.env.DB_URL || 'mongodb://localhost/issuetracker'

function testWithCallbacks(callback){
    console.log('\n--- with call back tests---');
    const client = new MongoClient(url,{useUnifiedTopology: true} );
    client.connect((connErr, client)=>{
                if(connErr){
                callback(connErr);
                return;
                      }
      
        console.log('Connected to MongoDB url', url );
        const db = client.db();
        const collection = db.collection('employees');
        const employee = {id:1, name:'A. Callback', age:23};
        collection.insertOne(employee, (insertErr, result)=>{
            if(insertErr){
                client.close();
                callback(insertErr);
                return;
                        }
            
            console.log('Result of Insert:\n', result.insertedId);
            collection.find({_id:result.insertedId})
            .toArray((findErr, docs)=>{
                if(findErr){
                client.close();
                callback(findErr);
                return;
                            }
                console.log('Result of find:\n', docs);
                client.close();
                callback();
                                        }
                    )
                                                            }
                                )

  })}

testWithCallbacks(function(err){
    if(err){
        console.log(err);
    }
} )