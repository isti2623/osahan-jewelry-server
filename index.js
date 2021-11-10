const express = require('express')
const app = express()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sovrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('osahan-jewelry');
        const productsCollection = database.collection('products');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('review');
        const usersCollection = database.collection('users');
        //GET Products API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        //add product
        app.post("/addProducts", (req, res) => {

            productsCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
            });
        });

        //GET all Orders API
        app.get('/orders', async (req, res) => {
            const cursor = await orderCollection.find({});
            const events = await cursor.toArray();

            res.send(events);
        })

        //add Order
        app.post("/orders", (req, res) => {

            orderCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
            });
        });

        // delete manage all Order

        app.delete("/orders/:id", async (req, res) => {

            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        //update product
        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };

            orderCollection
                .updateOne(filter, {
                    $set: {
                        status: "Shipped"
                    },
                })
                .then((result) => {
                    res.send(result);
                    console.log(result);
                });

        });

        //add my orders

        app.get("/myOrders/:email", async (req, res) => {
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        // delete my Order

        app.delete("/myOrders/:id", async (req, res) => {

            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        //GET all Orders API
        app.get('/myOrders', async (req, res) => {
            const cursor = await orderCollection.find({});
            const events = await cursor.toArray();

            res.send(events);
        })

        //Post add Reviews
        app.post("/addReviews", (req, res) => {

            reviewCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
            });
        });

        //GET  Reviews API
        app.get('/addReviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const events = await cursor.toArray();

            res.send(events);
        })
        //POST User Data
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        //Admin Role Put
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        //Admin Email Search
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello osahan-jewelry')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})