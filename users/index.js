import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(express.json());
app.use(cors());

const credentials = {
    '123': '123',
    'abc': 'abc'
}

app.post('/events', (req, res) => {

})

app.post('/authenticateUser', (req, res) => {
    const {data} = req.body;

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

app.listen(4002, () => {
    console.log('Listening on 4002');
  });