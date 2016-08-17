var http = require('http'),
    url = require('url'),
    isInt = function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n) && !/\./.test(n);
    };

module.exports = function(req, res, next) {
  var q = url.parse(req.url, true).query,
      echoJS = 'http://www.echojs.com/api/getnews/',
      data = '';
  
  if (q.t && q.t === 'top' || q.t === 'latest') {
    echoJS += q.t + '/';
  } else {
    echoJS += 'latest/';
  }
  
  echoJS += '0/';
  
  if (q.n && isInt(q.n) && +q.n < 30) {
    echoJS += q.n;
  } else {
    echoJS += '5';
  }
  
  http.get(echoJS, function(res){
    
    res.on('error', next)
      .on('data', function(chunk){
        data += chunk;
    }).on('end', function(){
      if (data !== '') {
        req.data = data;
        return next();
      } else {
        return next('No data from api');
      }      
    });
      
  }).on('error', next);
}