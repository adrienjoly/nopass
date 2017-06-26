var http = require('http');
var connect = require('connect');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var Server = require('./Server.js');
var Db = require('../lib/db-memory');

var methods = new Server(new Db());

var PORT = process.env.PORT || 8080;

var app = connect();
app.use(serveStatic('../public', {'index': ['index.html']})); // Serve public files
app.use(bodyParser.urlencoded({ extended: false })); // -> req.body
app.use(bodyParser.json({ type: '*/*', strict: false })); // -> req.body

/*
app.use(function allowCrossDomain(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }
});
*/

// Prepare socket.io server for public/log.html
var httpServer = http.createServer(app)

// /tweet is a POST API endpoint for users to connect and send messages
app.use('/flow', function (req, response, next) {
  console.log(req.method, req.url, req.body);
  methods.createFlow(req.body, (err, res) =>
    response.end(JSON.stringify(err ? { error: err } : { ok: res || 'OK' })));
});

// Listen for HTTP/HTTPS conncections on port 3000
httpServer.listen(PORT);
console.log('Server running on port', PORT, '...');
