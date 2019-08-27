const http = require('http');
const app = require('./App');

//port 3000 or if not available other
const port = process.env.PORT || 3000;
//Server created
const server = http.createServer(app);

server.listen(port,console.log("App runs"));