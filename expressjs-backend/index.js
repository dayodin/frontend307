const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const users = { 
  users_list :
  [
     { 
        id : 'xyz789',
        name : 'Charlie',
        job: 'Janitor',
     },
     {
        id : 'abc123', 
        name: 'Mac',
        job: 'Bouncer',
     },
     {
        id : 'ppp222', 
        name: 'Mac',
        job: 'Professor',
     }, 
     {
        id: 'yat999', 
        name: 'Dee',
        job: 'Aspring actress',
     },
     {
        id: 'zap555', 
        name: 'Dennis',
        job: 'Bartender',
     }
  ]
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined){
    let result = findUserByName(name);
    if (job != undefined) 
      result = result.filter( (user) => user['job'] === job);
    res.send(result);
  } 
  else
    res.send(users);
});

const findUserByName = (name) => { 
  return users['users_list'].filter( (user) => user['name'] === name); 
}

app.get('/users/:id', (req, res) => {
  const id = req.params['id']; //or req.params.id
  let result = findUserById(id);
  if (result === undefined || result.length == 0)
    res.status(404).send('Resource not found.');
  else {
    result = {users_list: result};
    res.send(result);
  }
});

app.delete('/users/:id', (req, res) => {
  // const id = req.query.id;
  const id = req.params['id'];
  let result = findUserById(id);
  if (result === undefined || result.length === 0)
    res.status(404).send('Resource not found.');
  else { 
    users['users_list'] = arrayRemove(users['users_list'], result[0]);
    res.status(204).send(users);
  }
});

function findUserById(id) {
  return users['users_list'].filter( (user) => user['id'] === id);
}

function arrayRemove(arr, value) { 
  return arr.filter(function(ele){ 
    return ele != value; 
  });
}

app.post('/users', (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = createId();
  if (addUser(userToAdd) === 201)
    res.status(201).send(userToAdd.id);
  else 
    res.status(404).end();
});

function addUser(user) {
  const arrLen = users['users_list'].length;
  users['users_list'].push(user);
  if (arrLen + 1 === users['users_list'].length)
    return 201;
  else 
    return 204;
}

function createId() {
  while (1) {
    let r = (Math.random() + 1).toString(36).substring(6);
    if ((users['users_list'].filter( (user) => user['id'] === r)).length === 0)
      return r;
  }
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});   