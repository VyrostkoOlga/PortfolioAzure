var http = require('http');

function onRequest(request, response) {
  // request - http.IncomingMessage
  // response - http.ServerResponse
  console.log(request.url);
  response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  response.write('Всем привет !\n');
  response.end('Hello World !\n');
}

http.createServer( onRequest ).listen(8000);
// можно и по шагам:
// server = http.createServer();
// server.listen(8000);
// server.on("request", onRequest);

console.log('Server running at http://127.0.0.1:8000/');