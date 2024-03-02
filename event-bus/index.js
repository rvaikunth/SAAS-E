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
    axios.post(process.env.REACT_APP_API_PC_ADDRESS + '/events', event).catch((err) => {
        console.log(err.message);
    });
    //users
    axios.post(process.env.REACT_APP_API_USERS_ADDRESS + '/events', event).catch((err) => {
        console.log(err.message);
    });
    //documentUpload
    axios.post(process.env.REACT_APP_API_DU_ADDRESS + '/events', event).catch((err) => {
        console.log(err.message);
    });


    res.send("OK");
});

app.post('/response', async (req, res) => {
    const response = await axios.post("http://104.155.188.137:8000/generate_text", {
      "input_text": req.body.input_text
    });
    console.log(response.data.generated_text)
    res.status(200).send(response.data.generated_text)
});

app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on 4000');
  });
  