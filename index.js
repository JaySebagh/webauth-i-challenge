const server = require('./server.js')

const port = 4000;
server.listen(port, function() {
    console.log(`\n Server Running on port ${port}`)
})