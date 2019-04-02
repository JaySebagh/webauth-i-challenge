const express = require('express');
const server = express();
const userRouter = require('./routers/users-router.js')
const session = require('express-session');

const sessionConfig = {
    name: 'monster',
    secret: 'react isnt real it cant hurt you',
    cookie: {
        maxAge: 1000 * 60 * 10 , // milliseconds
        secure: false, // use cookie over https
        httpOnly: true, // false = can JS access the cookie on the client
    },
    resave: false, // avoid recreating unchanged sessions
    saveUninitialized: false, // GDPR compliance
}

server.use(express.json());
server.use('/api', userRouter)
server.use(session(sessionConfig));

server.get('/', (req, res) => {
    res.send('Beep Boop, server alive.')
})

module.exports = server;