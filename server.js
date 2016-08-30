var http = require('http'),
    url = require('url'),
    server = http.createServer(),
    port = process.env.PORT || 8080,
    pype = require('pype-stack'),
    klocka = require('klocka'),
    kork = require('kork')(1000),
    cors = require('./lib/cors'),
    echoJS = require('./apis/echo'),
    synonymer = require('./apis/synonymer'),
    errorHandler = function(err, req, res){
      console.error(err);
      res.statusCode = 500;
      res.end();
    },
    finalHandler = function(req, res) {
      res.statusCode = 200;
      res.end(req.data);
    };

server.on('request', function(req, res){
  var path = url.parse(req.url).pathname;
  
  // echoJS
  if (req.method === 'GET' && path === '/echoJS') {
    pype(null, [klocka, cors, kork, echoJS, finalHandler], errorHandler)(req, res);
    
    // synonymer.se
  } else if (req.method === 'GET' && path === '/synonymer') {
    pype(null, [klocka, cors, synonymer, finalHandler], errorHandler)(req, res);
    
  } else {
    // wrong url
    res.statusCode = 404;
    res.end();
  }
});

server.listen(port, function(){
  console.log('Server running..');
});