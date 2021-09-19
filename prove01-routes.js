const { strict } = require('assert');
const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        //prefer to do each thing on it's own line for readability
        res.write('<html>');
        res.write('<head><title>Welcome Traveler</title></head>');
        res.write('<body>');
        res.write('<h1>Welcome Traveler</h1>');
        res.write('<h3>Would you like to add a user?</h3>');
        res.write('<form action="/create-user" method="POST">');
        res.write('<input type="text" name="user">');
        res.write('<button type="submit">Add User</button></form></body></html>');
        return res.end();
    }
    if (url === '/create-user' && method === 'POST') {
        const raw = [];
        req.on('data', chunk => {
            raw.push(chunk);
        });
        return req.on('end', () => {
            const parsedData = Buffer.concat(raw).toString();
            const user = parsedData.split('='[1]).toString();
            let cleanUser = user.split('+')[0] + ' ' + user.split('+')[1];
            console.log(cleanUser);
            const logger = fs.createWriteStream('users.txt', {
                flags: 'a'
            })
            logger.write(cleanUser + '\r\n');
            res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
        });
    }
    if (url === '/users') {
        const listOfUsers = [];
        const lister = [];
        res.write('<html>');
        res.write('<head><title>List of Users</title></head>');
        res.write('<body><h1>List of Users</h1><ul>');
        
        fs.readFile('./users.txt', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return
            }

            for (let i = 0; i < data.split('user=').length; i++) {
                listOfUsers.push(data.split('user=')[i]);
            } 

        for (let j = 1; j < listOfUsers.length; j++) {
            res.write('<li>' + listOfUsers[j] + '</li>');
        }
        res.write('</ul></body></html>');
        return res.end();
        });
    }
};

module.exports.handler = requestHandler;