import express from 'express';
import cors from 'cors';
import axios from 'axios';
import multer from 'multer';
import { createRequire } from "module";
import FirestoreClient from './firesStoreClient.js';

const require = createRequire(import.meta.url);
const {google} = require('googleapis');
const {Storage} = require('@google-cloud/storage');
const fs = require('fs')
const path = require('path')

const app = express();

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: function(req, file, callback){
        const extension = file.originalname.split(".").pop()
        callback(null, `${file.fieldname}-${Date.now()}.${extension}`)
    }
})

const upload = multer({storage:storage})
const googleStorage = new Storage({
    projectId: 'ardent-stacker-400902',
    keyFilename: 'uploadKey.json'
});

let fsc = new FirestoreClient();
const bucket = googleStorage.bucket('saasse_file_storage')

app.post('/events', async (req, res) => {
    const {type, data} = req.body;
    console.log('here')
    if(type === 'newDocUpload') {
        const userName = data.userName
        const files = data.fileNames
        // console.log(files)
        console.log('here2')

        for(let i = 0; i < files.length; ++i){
            const fileName = files[i]
            const path = `usernames/${userName}/documentUploads/${fileName}`
            const value = {
                docName: fileName,
                fileName: fileName
            }
            await fsc.saveByPath(path, value).then((e) =>{
                console.log('here3')
            })
        }
        console.log('here4')

        // const path = `usernames/${userName}/documentUploads/${firstQuestion}`
    }
    res.status(200).send();
})

app.post('/uploadCloud', upload.array('files'), async (req, res) => {
    // console.log(req.files)
    //uploading file to google cloud bucket
    for(let i = 0; i < req.files.length; ++i){
        const file = req.files[i]
        const bucketName = 'saasse_file_storage'
        const filePath = file.path;
        console.log(file.originalname)
        try{
            const options = {
                destination: file.originalname
            };
            await googleStorage.bucket(bucketName).upload(filePath, options);
            console.log(`${filePath} uploaded to ${bucketName}`);
        } catch(error) {
            console.log(error)
        }
    }
    res.status(200).send()
})

app.post('/uploadDoc', upload.array('files') ,async (req, res) => {
    // const formData = req.body.formData
    try{
        const auth = new google.auth.GoogleAuth({
            keyFile:"uploadKey.json",
            scopes:["https://www.googleapis.com/auth/drive"],
        })
        const drive = google.drive({
            version: 'v3',
            auth
        })

        const uploadedFiles = []
        for(let i = 0; i < req.files.length; ++i){
            const file = req.files[i]
            const response = await drive.files.create({
                requestBody:{
                    name: file.originalname,
                    mimeType: file.mimeType,
                    parents: ['1WMORUNm-Mfq4kz8bzeEWCS_urosFKeuP'],
                    supportsAllDrives: true,
                },
                media: {
                    body: fs.createReadStream(file.path)
                }
            })
            uploadedFiles.push(response.data)
        }
        res.status(200).send({files: uploadedFiles})
    }
    catch(error){
        console.log(error)
    }
})

app.put('/docNames', async (req, res) => {
    const userName = req.body.userName
    console.log(userName)
    const data = await fsc.getCollection(userName)
    let docNames = []
    data.forEach(doc =>{
        docNames.push(doc.id)
    });
    res.status(200).send(docNames)
});

//10:30
app.listen((process.env.PORT || 4004), () => {
    console.log('Listening on 4004');
  });
