const express = require('express')
const path = require('path');
const bodyParser = require("body-parser");
const app = express()
const port = 3000
const file = require('fs');
const basedir = "./html/"


app.use('/static', express.static('assets'))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, basedir+'index.html'));
})

app.get('/guestbook', (req, res) => {
    var file = require('./data.json');
    res.sendFile(path.join(__dirname, basedir+'guestbook.html'));
})

app.get('/newmessage', (req, res) => {
    res.sendFile(path.join(__dirname, basedir+'newmessage.html'));
})

app.post('/ajaxmessage', (req, res) => {
    data = req.body
    console.log(data.name)
    if(data.name === " " && data.country === " " && data.message === " ") {
        res.send({
            success: false,
            reason: "values not set"
        })
    } else {
        console.log(data.name, data.country, data.message);
        res.send({
            success: true
        })
    }
    //res.sendStatus(200);
});

//Serve json file this way so we can more easily control it in the future.
app.get('/api/json', (req, res) => {
    var file = require('./data.json');
    res.send(file)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})