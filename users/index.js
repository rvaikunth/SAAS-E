import express from 'express';
import cors from 'cors';
import axios from 'axios';
import FirestoreClient from './firesStoreClient.js';

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.json());
app.use(cors());

const credentials = {
    'lorcan': 'lorcan',
    'kalyan': 'kalyan',
    "rhidam": "rhidam"
}

app.post('/events', (req, res) => {

})

let fsc = new FirestoreClient();

app.post('/authenticateUser', async (req, res) => {
    const {type, data} = req.body;

    const userName = data.username;
    const password = data.password;
    const collection = await fsc.getCollection(userName);
    let rPassword;
    collection.forEach(doc => {
            // console.log(doc.id, '=>', doc.data().password); 
            rPassword = doc.data().password;         
          });
    // console.log(userName)
    // console.log("password")
    // console.log(rPassword)
    
    if(rPassword === password){
        res.status(200).send({
            //can add more here to give an actual token/username
            token: userName
        });
    }
    else {
        res.status(403).send({
            'message': 'Incorrect Credentials'
        })
    }
})

app.listen(process.env.PORT || 4002, () => {
    console.log('Listening on 4002');
  });