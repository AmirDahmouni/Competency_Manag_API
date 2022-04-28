const http = require('http');
const app = require('./app')
const server = http.createServer(app)
const io = require('socket.io')(server);
const ConnectedUsers = [];

const Redis=require("redis")
const client=Redis.createClient()

const port=process.env.PORT || 5000
server.listen(port,()=>{
    console.log(`Server started at http://localhost:${port}`);
})