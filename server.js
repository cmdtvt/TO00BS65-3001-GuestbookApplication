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
    if(data.name === " " && data.country === " " && data.message === " ") {
        res.send({
            success: false,
            reason: "unknown reason"
        })

    } else {

        file.readFile('./data.json', 'utf8' , (err, fileData) => {
            if (err) {
                console.error(err)
                res.send({
                    success: false,
                    reason: "Failed to read the file."
                })
                return
            } else {
                console.log("Readubg data!")

                //Convert loaded string into a json object
                const jsonf = JSON.parse(fileData);

                //Get date and remove extra things from it.
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

                //Add new data into the array
                jsonf.push({
                    id:jsonf.length,
                    username:data.name,
                    country:data.country,
                    message:data.message,
                    date:date
                })
                
                //Convert json object back into a string and save it.
                file.writeFile("./data.json", JSON.stringify(jsonf), function(err) {
                    console.log("Saving!")
                    if(err) {
                        res.send({
                            success: false,
                            reason: "Failed to save the file."
                        })
                        return console.log(err);
                    } else {
                        res.send({
                            success: true,
                            reason: "values not set"
                        })
                    }
                }); 
                
            }
        })
    }
});

//Serve json file this way so we can more easily control it in the future.
app.get('/api/json', (req, res) => {
    file.readFile('./data.json', 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        res.send(data)
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})