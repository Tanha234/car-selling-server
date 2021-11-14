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
        const ordersCollection=database.collection('orders');
        const reviewCollection=database.collection('review');
        const userCollection=database.collection('user');
        app.post('/user',async(req,res)=>{

            
            const user=req.body;
            
            console.log("hit the post ",user)

            const resul= await userCollection.insertOne(user);
               console.log(resul)
             res.json('resul')

        
    })
    app.get('/user',async(req,res)=>{
        const curso=userCollection.find({});
        const resultt= await curso.toArray();
        res.send(resultt);
    })
    app.put('/user', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    });

    app.put('/user/admin', async (req, res) => {
        const user = req.body;
        console.log('put',user)
      
       
         
                const filter = { email: user.email };
                const updateDoc = { $set: { role: 'admin' } };
                const result = await userCollection.updateOne(filter, updateDoc);
                res.json(result);
          

    })
    app.get('/user/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await userCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin });
    })


        app.post('/review',async(req,res)=>{

            
            const review=req.body;
            
            console.log("hit the post ",review)

            const resultt= await reviewCollection.insertOne(review);
               console.log(resultt)
             res.json('result')

        
    })
    app.get('/review',async(req,res)=>{
        const cursorss=reviewCollection.find({});
        const resultss= await cursorss.toArray();
        res.send(resultss);
    })

        app.post('/orders',async(req,res)=>{

            
                const order=req.body;
                
                console.log("hit the post ",order)
    
                const result= await ordersCollection.insertOne(order);
                   console.log(result)
                 res.json(result)
    
            
        })
        app.get('/orders',async(req,res)=>{
            const cursors=ordersCollection.find({});
            const results= await cursors.toArray();
            res.send(results);
       

    })
    //     //delete api
        app.delete('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await ordersCollection.deleteOne(query)
            console.log("Deleting mens removed for forever",result)
            res.json(result)


        })
         

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