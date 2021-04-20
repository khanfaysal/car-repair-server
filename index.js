const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()

const port = process.env.PORT || 5055;
console.log(process.env.DB_USER);

app.get('/',(req, res) =>{
  res.send("hello world")
})

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brk1j.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err);
    const serviceCollection = client.db("carRepair").collection("servicebook");
    const feedbackCollection = client.db("carRepair").collection("userfeedback");
    const userOrderCollection = client.db("carRepair").collection("orders");
    console.log('database connected');

    // all car service books API database code (Role: Admin)
   app.get('/servicebook', (req, res) => {
    serviceCollection.find()
    .toArray((err, service) => {
      res.status(200).send(service)
    })
  })

  app.post('/addServiceInfo', (req, res) => {
      const newServiceInfo = req.body;
      console.log('adding service info', newServiceInfo)
      serviceCollection.insertOne(newServiceInfo)
    .then(result =>{
      console.log('inserted count',result.insertedCount)
      res.send(result.insertedCount > 0)
    });

    });

    // delete specific service API (Role : Admin)
    app.delete('/deleteService/:id', (req, res) => {
      const id = ObjectID(req.params.id);
      serviceCollection.deleteOne({_id: id})
      .then(result => {
        console.log(result);
      })
    })

    // testimonial user feedback API (Role : User)

    app.get('/userfeedback', (req, res) => {
      feedbackCollection.find()
      .toArray((err, feedback) => {
        res.status(200).send(feedback)
      })
    })

    app.post('/userFeedbackInfo', (req, res) => {
      const newUserFeedback = req.body;
      console.log('adding service info', newUserFeedback)
      feedbackCollection.insertOne(newUserFeedback)
    .then(result =>{
      console.log('inserted count',result.insertedCount)
      res.send(result.insertedCount > 0)
    });

    });

    //all order show API (Role : Admin)
    app.get('/orders', (req, res) => {
      userOrderCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
    })
    
    
    app.post('/addOrder', (req, res) => {
          const newOrder = req.body;
          console.log(newOrder)
          userOrderCollection.insertOne(newOrder)
        .then(result => {
          console.log(result)
          res.send(result.insertedCount > 0);
        })
    })

    // show specific order service API (Role : User)
    

});

app.listen(process.env.PORT || port);

