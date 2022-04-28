const mongoose = require('mongoose');
const express = require('express')
const app = express()
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path');
require('dotenv').config()


app.use(cors())

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to database successfully');
}).catch((err) => {
    console.log('ERROR : unable to connect to database',err.message);
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({useTempFiles: true}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use('/cv', express.static(path.join(__dirname, 'public/cv')));
app.use('/images/avatars', express.static(path.join(__dirname, 'public/images/avatars')));
app.use('/images/projects', express.static(path.join(__dirname, 'public/images/projects')));
app.use('/images/clients', express.static(path.join(__dirname, 'public/images/clients')));

app.use("/technology/",require("./routes/technology-router"))
app.use("/user",require("./routes/user-router"))
app.use("/certificate",require("./routes/certificat-router"))
app.use("/client",require("./routes/client-router"))
app.use("/project",require("./routes/project-router"))
app.use("/mission",require("./routes/mission-router"))
app.use("/training",require("./routes/training-router"))
app.use("/quiz",require("./routes/quiz-router"))


module.exports=app;



