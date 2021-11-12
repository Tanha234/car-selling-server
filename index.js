const express=require('express');
const app=express();
require('dotenv').config()
const cors=require('cors'); 
const { query } = require('express');
const ObjectId=require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');

const port=process.env.PORT||7000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.btuqx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors())
app.use(express.json())

async function run(){
    try{
        client.connect();
        const database=client.db("cars-server");
        const carsCollection=database.collection('cars');

        app.post('/cars',async(req,res)=>{
            const car=req.body;
            
            console.log("hit the post ",car)

            const result= await carsCollection.insertOne(car);
               console.log(result)
             res.json(result)

        })
        app.get('/cars/:id',async(req,res)=>{

            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await carsCollection.findOne(query)
            console.log("This is updater ",id)
            res.send(result)
   
   
        })

        app.get('/cars',async(req,res)=>{
            const cursor=carsCollection.find({});
            const result= await cursor.toArray();
            res.send(result);
       

    })
}

    finally{
         // await client.close()

    }
}
run().catch(console.dir)



app.get('/',(req,res)=>{
    res.send("Hello world")
})
app.listen(port,(req,res)=>{
    console.log("hello hello",port)
})