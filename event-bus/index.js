import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(express.json());
app.use(cors());

app.post('/events', (req, res) => {
    const event = req.body;
    console.log('in event bus')
    //previouschats
    axios.post('http://previouschats:4001/events', event).catch((err) => {
        console.log(err.message);
    });
    //users
    axios.post('http://users:4002/events', event).catch((err) => {
        console.log(err.message);
    });
    //documentUpload
    axios.post('http://documentUpload:4004/events', event).catch((err) => {
        console.log(err.message);
    });


    res.send("OK");
});

app.post('/response', (req, res) => {
    console.log(req.body.message)
    res.status(200).send('Hello, I am an AI')
});

app.listen(4000, () => {
    console.log('Listening on 4000');
  });
  