const express = require('express');
const server = express();
const userRouter = require('./routers/users-router.js')

server.use(express.json());
server.use('/api', userRouter)

server.get('/', (req, res) => {
    res.send('Beep Boop, server alive.')
})

module.exports = server;