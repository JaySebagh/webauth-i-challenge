const express = require('express');
const server = express();
const userRouter = require('./routers/users-router.js')
const session = require('express-session');
const sessionConfig = require('./auth/session-config.js')

server.use(express.json());
server.use(session(sessionConfig));
server.use('/api', userRouter)

server.get('/', (req, res) => {
    res.send('Beep Boop, server alive.')
})

module.exports = server;