const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const db = require('./models');
db.sequelize
    .sync()
    .then(() => {
      console.log('DB 연결 성공');
    })
    .catch((e) => {
      throw new Error('DB 연결 실패: '+e);
    });

app.get('/api/todolists', (req, res) => {
    db.List.findAll().then(list => {
        res.json(list);
    })
})
app.post('/api/todolists', (req, res) => {
    const data = req.body;
    db.List.create(data)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
})
app.put('/api/todolists/:id', (req, res) => {
    const id= req.params.id;
    const data = req.body;
    db.List.update(data, {where: {id}})
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
})
app.delete('/api/todolists/:id', (req, res) => {
    const id = req.params.id;
    db.List.destroy({where: {id}})
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
})
app.get('*', (req, res) => {
    res.send("Hello World");
})

const port = process.env.PORT || 4000;
app.listen(port);

console.log(`todo-list server listening on ${port}`);