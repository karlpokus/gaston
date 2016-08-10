var http = require('http');

module.exports = function(req, res, next) {
  var url = 'http://www.echojs.com/api/getnews/latest/0/3',
      data = '';
  
  http.get(url, function(res){
    
    res.on('error', next)
      .on('data', function(chunk){
        data += chunk;
    }).on('end', function(){
      req.data = data;
      return next();
    });
      
  }).on('error', next);
}