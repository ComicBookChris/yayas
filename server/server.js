const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { readdirSync } = require("fs");
require('dotenv').config();


// var cors = require('cors')

// app.use(cors()) 

//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
.then(() => console.log('DB CONNECTED'))
.catch(err => console.log(`DB CONNECTION ERR ${err}`));

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb"}));
app.use(cors());// Use this after the variable declaration

//route middleware
readdirSync('./routes').map((r) => 
app.use("/api", require("./routes/" + r)));

//port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));