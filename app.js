const mongo = require('./mongo');
const makeHierarchy = require('./hierarchy');
const makeManifest = require('./makeManifest');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS, PUT")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json())

const currentCollection = 'august_2017';


app.get('/tree/:tree', async function (req, res) {
  const slug = req.params.tree;
  const db = mongo.getDB();
  try {
    const data = await db.collection(currentCollection).find({ tree: slug }).toArray();
    const newData = makeManifest(data);
    res.json(newData);
  } catch (e) {
    console.log('this did not work', e);
  }
})

app.get('/treeSettings/:username', async function (req, res) {
  const db = mongo.getDB();
  const username = req.params.username;
  try {
    const userSettings = await db.collection('users').find({ name: username }).toArray();
console.log(userSettings)
    res.json(userSettings);
  } catch (e) {
    console.log('this did not work', e);
  }
})

app.post('/tree', async function (req, res) {

const name = req.body.name;
console.log(name)
const db = mongo.getDB();

const newNode = {
  name: 'Root',
  path: '',
  summary: '',
  tree: name,
  version: 1,
}

try {
  const id = await db.collection(currentCollection).insertOne(newNode)
  const updatedTrees = await db.collection('users').update({name: "august_von_trapp"}, {$push: { trees: name }});
console.log('this is the id var')
  res.json({code: 200})
} catch(e) {
  console.log('this did not work at all...', e)
}
})

app.post('/createNode', async function (req, res){
  const db = mongo.getDB();
  try {
    const id = await db.collection(currentCollection).insertOne(req.body)
console.log('this is the id var')
    res.json({id: id.insertedId})
  } catch(e) {
    console.log('this did not work at all...', e)
  }
})

app.delete('/:id', async function (req, res){
  const db = mongo.getDB();
console.log('OBJECT ID', mongo.ObjectID())
  try {
    const id = await db.collection(currentCollection).deleteOne({ _id: mongo.ObjectID(req.params.id)})
console.log('this is the id var', id)
    res.json({success: 'yeah'})
  } catch(e) {
    console.log('this did not work at all...', e)
  }
});

app.put('/:id', async function (req, res){
  const db = mongo.getDB();
  const body = req.body;
  delete body['_id'];
console.log(body, '\n\n\n THIS IS THE PUT')

  try {
    const id = await db.collection(currentCollection).replaceOne({ _id: mongo.ObjectID(req.params.id)}, body);
console.log('this is the id var', id)
    res.json({success: 'yeah'})
  } catch(e) {
    console.log('this did not work at all...', e)
  }
});

mongo.connectToServer((err)=> {
  console.log(err)

  app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
  })
})
