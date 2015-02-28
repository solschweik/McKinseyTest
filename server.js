var http = require('http'),
  url = require('url'),
  path = require('path'),
  fs = require('fs'),
  OAuth = require('oauth');
var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"},
  serveFile = function(req, res, uri) {
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function(exists) {
      if(!exists) {
        console.log("not exists: " + filename);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('404 Not Found\n');
        res.end();
        return;
      }
      var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
      res.writeHead(200, {'Content-Type': mimeType});

      var fileStream = fs.createReadStream(filename);
      fileStream.pipe(res);

    }); //end path.exists
  }, queryTwitter = function(resp, tag) {
    var oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      'fg2IAym9FEeyzBAGSRcGxVsxn', // app consumer key
      'nx1zKH4CSrjuP3GGVvG0PBXOq44WJBucOCI2daGBiYOm4HLnwY', // app secret
      '1.0A',
      null,
      'HMAC-SHA1'
    );
    oauth.get(
//  'https://api.twitter.com/1.1/trends/place.json?id=23424977',
      'https://api.twitter.com/1.1/search/tweets.json?q=%23' + tag + '&result_type=recent',
      '1888484792-L3f1amUXXnLkxEifKKGVzlMcGWsU53ixfPYeA52', //test user token
      '8f4Q6mdxoVVBaxND5vxGMmOVuZ9dH6ZJi2Nhb29spJiqH', //test user secret
      function (e, data, res){
        if (e) { console.error(e); return; }
        var res = JSON.parse(data);
        // console.log(require('util').inspect(data));
        if(!res || !res.statuses) return;
        res.statuses.forEach(function(s) {
          console.info('https://twitter.com/statuses/' + s.id_str);
        });
        resp.write(data);
        resp.end();
      });
  };

http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname,
    parts = uri.split('/');
  if(parts && parts.length) {
    var ndx = parts.indexOf('twits');
    if(ndx >= 0) {
      var tag = parts[ndx+1];
      console.info('Looking for tag: ', tag);
      if(!tag) return;
      queryTwitter(res, tag);
    } else {
      serveFile(req, res, uri);
    }
  }
}).listen(9999);