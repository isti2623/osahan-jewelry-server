const express = require('express')
const app = express()
const cors = require('cors');
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

        //add Order
        app.post("/orders", (req, res) => {

            orderCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
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