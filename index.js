const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');
const port = 5002
app.use(cors())
app.use(bodyParser.json());
require('dotenv').config();

const pass = process.env.DB_PASS

const uri = `mongodb+srv://admin:${pass}@cluster0.nacyh.mongodb.net/mambo-books?retryWrites=true&w=majority`

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("mambo-books").collection("books");
  const collection1 = client.db("mambo-books").collection("orders");
  app.post('/addBook', (req, res) => {
    const newBook = req.body;
    console.log(newBook);
    collection.insertOne(newBook)
    .then(res => console.log(res.insertedCount))
    res.send(res.insertedCount > 0)
})

app.get('/books', (req, res) =>{
  collection.find({})
  .toArray((err, documents) => {
    res.send(documents);
  })
})

app.post('/placeOrder', (req, res) => {
  const newOrder = req.body;
  console.log(newOrder);
  collection1.insertOne(newOrder)
  .then(res => console.log(res.insertedCount))
  res.send(res.insertedCount>0)
})

app.get('/orderDetails/:email', (req, res) => {
  console.log(req.params.email);
  collection1.find({buyer: req.params.email})  
  .toArray((err, documents) => {
    res.send(documents);
  })
})
  // perform actions on the collection object
});



app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



