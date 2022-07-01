const express = require('express')
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tq3xm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db('google-task').collection('tasks');


    app.post('/tasks', async (req, res) => {
      const tasks = req.body;
      const result = await taskCollection.insertOne(tasks)
      res.send(result);
    })

    app.get('/tasks', async (req, res) => {
      const query = req.query;
      const cursor = taskCollection.find(query)
      const result = await cursor.toArray()
      res.send(result.reverse())
    })

    app.get('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result)
    })


    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };


      const updateDoc = {
        $set: {
          tasksText: data.tasksText
        },
      };

      const result = await taskCollection.updateOne(filter, updateDoc, options);


      res.send(result)

    })



    console.log('mongodb connected')
  }
  finally {

  }

}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})