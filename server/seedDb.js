require('dotenv').config({path: './.env'}); 
const { MongoClient } = require('mongodb');
const dbClient = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

dbClient.connect()
db = dbClient.db(process.env.MONGODB_DB_NAME) // database name

const collections = ["users", "spaces", "docs", "blocks", "comments"]

collections.map((collection) => {
  db.createCollection(collection, (err, res) => {
    if (err) console.log("error:", err);
    console.log("Collection created:", collection);
  })
})
process.exit();