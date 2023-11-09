import { Firestore } from '@google-cloud/firestore';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default class FirestoreClient {
    constructor() {
        this.firestore = new Firestore({
            projectId: 'ardent-stacker-400902',
            keyFilename: path.join(__dirname, './uploadKey.json')
        })  
    }

    async save(collection, data) {
        const docRef = this.firestore.collection(collection).doc(data.key)
        await docRef.set(data)
    }

    async saveSubCollection(rootCol, rootDocName, subCol, subColData) {
        const docRef = this.firestore.collection(rootCol).doc(rootDocName).collection(subCol).data(subColData.docName)
        await docRef.set(subColData)
    }

    async saveByPath(path, data) {
        const docRef = this.firestore.doc(path)
        await docRef.set(data)
    }

    async getByPath(path) {
        const docRef = this.firestore.doc(path)
        const response = await docRef.get()
        return response
    }

    async getCollection(colName) {
        const colRef = this.firestore.collection('usernames').doc(colName).collection('firstQuestions');
        const collections = await colRef.get()
        // collections.forEach(doc => {
        //     console.log(doc.id, '=>', doc.data());          
        //   });
          
        // const f = (await colRef.get())
        // console.log('here')
        // f.forEach(doc => {
        //     console.log(doc.id, '=>', doc.data());
        //   });
        console.log('here')
        return collections
    }
}

// export default FirestoreClient;