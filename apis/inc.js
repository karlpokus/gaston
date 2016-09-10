module.exports = function(req, res, next){
  var data = '';

  req
    .on('error', next)
    .on('data', function(chunk){
      data += chunk;
    })
    .on('end', function(){
      try {
        data = JSON.parse(data);
        data.cats++;
        req.data = JSON.stringify(data);
      } catch(e) {
        return next(e.message);
      }
    })
}
