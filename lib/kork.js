/*
kork - a crude rate limiter

API
kork.init(rate) -> sets new ts and applys rate limit in ms
kork.reset() -> sets/overwrites ts
kork.limit() -> checks ts

TODOs
- Figure out a way to not need to bind .limit in pype -> process.env?
*/

module.exports = {
  ts: 0,
  rate: 0,
  init: function(rate) { // allow 1 req/time (rate in ms)
    this.rate = rate;
    this.reset();
    return this;
  },
  reset: function() {
    var d = new Date();
    this.ts = d.getTime();
  },
  limit: function(req, res, next) {
    var d = new Date(),
        self = this;
    
    if (d.getTime() - this.ts > this.rate) { // reset && go ahead      
      this.reset();
      return next();
    } else { // wait && reset      
      setTimeout(function(){
        self.reset();
        return next();
      }, self.rate);
    }
  }
};