require('dotenv').config();
const express = require('express');
const database = require('./database')
const installHandler = require('./api_handler')
const port = process.env.API_SERVER_PORT || 3000;
const {connectToDb} = database;
const app = express();
installHandler(app);


// app.use(express.static('public') );goes to ui server

(
    async function(){
        try{
        
            await connectToDb();
            app.listen(port, function(){
    console.log(`API server started at port ${port}`);
})
        }catch(err){
            console.log('ERROR:', err);
            
        }
    }
)();
