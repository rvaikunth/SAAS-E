import express from 'express';
import cors from 'cors';
import axios from 'axios';

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

app.post('/authenticateUser', (req, res) => {
    const {type, data} = req.body;

    const userName = data.username;
    const password = data.password;
    console.log(userName)
    console.log(password)
    
    if(credentials[userName] && credentials[userName] === password){
        res.status(200).send({
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