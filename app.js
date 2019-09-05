const http = require('http');
const fs = require("fs");

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html> <body><h1>Please input the details</h1></body></html>')
        res.write(`<form action='/message' method="POST" >
        <input type="text" name="message"/>
        <button type="submit">Submit</button>
    </form>`);
        return res.end();
    }
    if (req.url === '/message' && req.method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log('parsedBody', parsedBody.toString());
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.txt', message, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end()
            });
        });
    }
    console.log('xxx');
    res.write('<html> <body><h1>No request matched..returning to main page</h1></body></html>')
    res.end()
});

server.listen(3333);