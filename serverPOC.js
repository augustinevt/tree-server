const mongo = require('./mongo');
const express = require('express')
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const makeHierarchy = (array) => {
  const reference = {};
  array.forEach((node) => {

    if(!reference[node.name]) {
      node.children = [];
      reference[node.name] = node
    }

    if( typeof reference[node.name].name === 'undefined') {
      const children = reference[node.name].children;
      reference[node.name] = node;
      reference[node.name].children = children;
    }

    const parent = node.parent ? node.parent : 'root';

    if (!reference[parent]) {
      reference[parent] = { children: [] }
    }

    reference[parent].children.push(node);
  });

  return reference['root'];

}

app.get('/', async function (req, res) {
  console.log('this has been got');
  const db = mongo.getDB();
  try {
    const foo = await db.collection('test').find().toArray();
    const hierarchy = makeHierarchy(foo)
    res.json({Choo: hierarchy});
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

// console.log(JSON.stringify(makeHierarchy(testNodes)));
