const express = require('express')
const app = express()
require('dotenv').config()

const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));

//app.use(express.urlencoded({ extended: true}));

require('./routes/processsubmessages')(app);

app.get("/",(req,res) =>{
    res.send("Ha!")
})

app.listen(process.env.PORT, () =>{
    console.log("app is running on port",process.env.PORT)
})

