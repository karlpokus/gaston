var http = require('http'),
    server = http.createServer(),
    port = process.env.PORT || 8080,
    pype = require('pype-stack'),
    klocka = require('klocka'),
    kork = require('kork')(1000),
    cors = require('./lib/cors'),
    echoJS = require('./apis/echo'),
    errorHandler = function(err, req, res){
      console.error(err);
      res.statusCode = 500;
      res.end();
    };

server.on('request', function(req, res){
  
  // echoJS
  if (req.method === 'GET' && req.url === '/echoJS') {
    
    pype(null, [klocka, cors, kork, echoJS], errorHandler, function(req, res){      
      res.statusCode = 200;
      res.end(req.data);
    })(req, res);
    
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(port, function(){
  console.log('Server running..');
});