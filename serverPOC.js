const mongo = require('./mongo');
const makeHierarchy = require('./hierarchy')
const express = require('express')
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/tree/:tree', async function (req, res) {
  const slug = req.params.tree;
console.log(slug)
  const db = mongo.getDB();
  try {
    const data = await db.collection('mvp').find({ tree: slug }).toArray();
    const hierarchy = makeHierarchy(data)
    res.json(hierarchy);
  } catch (e) {
    console.log('this did not work', e);
  }
})

mongo.connectToServer((err)=> {
  console.log(err)

  app.listen(8000, function () {
    console.log('Example app listening on port 3000!')
  })
})
