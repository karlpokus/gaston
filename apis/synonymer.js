var http = require('http'),
    url = require('url'),
    cheerio = require('cheerio'),
    crazyStringEncoder = function(str) {
      return str.split('').map(function(char){
        var blacklist = {
          'å': '%E5',
          'ä': '%E4',
          'ö': '%F6'
        };
        if (char in blacklist) {
          return blacklist[char];
        } else {
          return char;
        }
      }).join('');
    };

module.exports = function(req, res, next) {
  var q = url.parse(req.url, true).query,
      base = 'http://www.synonymer.se/?query=',
      html = '';
  
  if (q.s) {
    var endpoint = base + crazyStringEncoder(q.s);

    http.get(endpoint, function(res){
      res.on('error', next)
        .on('data', function(chunk){
          html += chunk;
      }).on('end', function(){
        
        if (html !== '') {  
          var $ = cheerio.load(html),
              header = $('.leftArea #middlebanner .boxHeader h2').text(),
              noResults = 'Inga synonymer hittades för din sökning',
              synonyms = $('.leftArea #middlebanner .boxContent a').map(function(){
                return $(this).text();
              }).get();

          if (header !== noResults && synonyms.length > 0) {
            req.data = JSON.stringify({s: q.s, n: synonyms.length, data: synonyms});
          } else {
            req.data = JSON.stringify({s: q.s, n: 0, data: ''});
          }
          return next();
          
        } else {
          return next('No data returned from api');
        }        
      });
      
    }).on('error', next);
    
  } else {
    return next('No query found on url');
  }
}