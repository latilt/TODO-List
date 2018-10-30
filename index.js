const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.send("Hello World");
})

const port = process.env.PORT || 4000;
app.listen(port);

console.log(`todo-list server listening on ${port}`);