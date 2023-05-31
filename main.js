const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
//khai báo view, public,...
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.resolve('./public')))

//kết nối database
const mongoose = require('mongoose');
const DBPATH = 'mongodb://localhost:27017/vidientu'
mongoose.connect(DBPATH);

//các route
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

//run server
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 4000

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))