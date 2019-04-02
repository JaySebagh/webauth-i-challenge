const express = require('express');
const server = express();
const userRouter = require('./routers/users-router.js')
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const configuredKnex = require('./config.js');


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
    store: new KnexSessionStore({
        knex: configuredKnex,
        tablename: 'session',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 30, // delete expired session
    }),
}

server.use(express.json());
server.use(session(sessionConfig));
server.use('/api', userRouter)

server.get('/', (req, res) => {
    res.send('Beep Boop, server alive.')
})

module.exports = server;