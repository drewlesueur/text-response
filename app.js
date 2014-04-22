var http = require('http');
var url = require('url')
var fs = require("fs")
var _ = require("underscore")

var listeners = {}
http.createServer(function (req, res) {
  var url_parts = url.parse(req.url, true);
  console.log(url_parts)
  var query = url_parts.query;
  var pathname = url_parts.pathname
  if (pathname == "/text") { // from twilio
    res.writeHead(200, {'Content-Type': 'text/plain'});
    _.each(listeners, function (res2, id) {
      console.log("writing " + query.Body)
      res2.write("data: " + query.Body + "\n\n") 
    })
    res.end(); // you could send a message back   
  } else if (url_parts.path == '/results') {
    var id = _.uniqueId("listener")
    res.__my_id = id
    listeners[id] = res
    res.on('close', function () {
      delete listeners[id] 
    }) 
    res.writeHead(200, {'Content-Type': 'text/event-stream'});
  } else if (url_parts.path == "/"){
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile("./index.html", function (err, text) {
      res.end(text.toString()) 
    }) 
  } else {
    res.end()
  }
  //res.end(JSON.stringify(query));
}).listen(1616);
console.log('Server running at http://1616.drewles.com/');

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});
