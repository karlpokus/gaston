var http = require('http'),
    server = http.createServer(),
    port = process.env.PORT || 8080,
    pype = require('pype-stack'),
    klocka = require('klocka'),
    kork = require('./lib/kork').init(2500),
    echoJS = require('./apis/echo'),
    errorHandler = function(err, req, res){
      console.error(err);
      res.statusCode = 500;
      res.end('Sorry');
    };

server.on('request', function(req, res){
  
  // echoJS
  if (req.method === 'GET' && req.url === '/echoJS') {
    
    pype(null, [klocka, kork.limit.bind(kork), echoJS], errorHandler, function(req, res){      
      res.statusCode = 200;
      res.end(JSON.parse(req.data));
    })(req, res);
    
  } else {
    res.statusCode = 200;
    res.end('Nothing to see here.');
  }
});

server.listen(port, function(){
  console.log('Server running..');
});