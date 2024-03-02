import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { createRequire } from "module";
import { readFile, writeFile } from 'fs/promises';
import FirestoreClient from './firesStoreClient.js'
// const require = createRequire(import.meta.url);
// const FirestoreClient = require('./firesStoreClient')
const app = express();

app.use(express.json());
app.use(cors());

let fsc = new FirestoreClient();
// const burgerHut = {
//     docName: 'burgerhut',
//     location: 'LA'
// }

// const save = async() => {
//     await fsc.save('restraunts', burgerHut)
// }
// save();

const prevChatsFile = 'prevChats.json'
// // Google storage
// const bucketName = 'saasse_file_storage';

// // The ID of your GCS file
// const fileName = 'prevChats.json';

// // The path to which the file should be downloaded
// const destFileName = './prevChats.json';

// // Imports the Google Cloud client library
// const {Storage} = require('@google-cloud/storage');

// // Creates a client
// const storage = new Storage({
//     projectId: 'ardent-stacker-400902',
//     keyFilename: 'uploadKey.json'
// });

// async function downloadFile() {
//     // passing the options
//     const options = {
//         destination: destFileName,
//     };

//     // download object from Google Cloud Storage bucket
//     await storage.bucket(bucketName).file(fileName).download(options);

//     // [optional] a good log can help you in debugging
//     console.log(
//         "The object " + fileName +
//         " coming from bucket " +  bucketName +
//         " has been downloaded to " + destFileName
//     );
// }

// async function uploadFile() {
//     await storage.bucket(bucketName).file(fileName).delete()
//     console.log('deleted')
//     const options = {
//         destination: fileName,
//         preconditionOpts: {ifGenerationMatch: 0},
//     };
//     await storage.bucket(bucketName).upload(destFileName, options);
//     console.log('uploaded')

// }

let prevoiusChats = {}

async function reload() {
    try {
        const data = await readFile(prevChatsFile, { encoding: 'utf8' });

        prevoiusChats = JSON.parse(data);
    } catch (e) {
        prevoiusChats = {};
    }
}

async function savePreviousChats() {
    try {
      const data = JSON.stringify(prevoiusChats);

      await writeFile(prevChatsFile, data, { encoding: 'utf8' });
    } catch (err) {
      console.log(err);
    }
}

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    if(type === 'newChatLog'){
        // await reload();
        const userName = data.userName
        const firstQuestion = data.firstQuestion
        const chatLog = data.chatLog
        // console.log(data)
        // if(!prevoiusChats[userName]){
        //     prevoiusChats[userName] = {}
        // }
        // console.log(prevoiusChats)
        // prevoiusChats[userName][firstQuestion] = chatLog
        // await savePreviousChats();
        const path = `usernames/${userName}/firstQuestions/${firstQuestion}`
        // console.log('here')
        // console.log(path)
        const value = {
            docName: firstQuestion,
            chatLog: chatLog
        }
        // console.log('here2')
        await fsc.saveByPath(path, value).then((e) =>{
            console.log('here3')
        })
    }
    // console.log('here4')
    // console.log(prevoiusChats)
    res.status(200).send()
})

app.put('/chatLogs', async (req, res) => {
    const userName = req.body.userName
    // console.log(userName)
    const data = await fsc.getCollection(userName)
    let chats = {}
    data.forEach(doc => {
        chats[doc.id] = doc.data().chatLog
        // console.log(doc.id, '=>', doc.data());          
      });
    // console.log(chats)
    res.status(200).send(chats)
})

app.post('/test', async (req, res) => {
    await reload();
    await savePreviousChats();
    res.status(200).send();
})

app.listen(process.env.PORT || 4001, () => {
    console.log('Listening on 4001');
  });
