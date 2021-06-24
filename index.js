const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 6030;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrs6y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const blogsCollection = client.db(`${process.env.DB_NAME}`).collection("blogs");

  
  app.get('/blogs', (req, res) =>{
    blogsCollection.find()
    .toArray((err, items) => {
        res.send(items);
    })
});

  app.post('/addBlogs', (req, res) => {
    const newBlog = req.body;
    blogsCollection.insertOne(newBlog)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
});

app.get('/blog/:id', (req, res) => {
  blogsCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, documents) => {
      res.send(documents[0]);
  })
});

app.delete('/deleteBlog/:id', (req, res)=>{
  const id = ObjectId(req.params.id);
  
  blogsCollection.findOneAndDelete({_id: id})
  .then(result => {
      res.send(result.deletedCount > 0);
  });
});
 
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})