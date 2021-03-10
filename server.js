var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/back/index.html');
});

let users = {};
io.on('connection', (socket) => {
    console.log('a user' + socket.id + ' connected');
    users[socket.id] = {};
    //分发加入聊天室提示
    socket.on('join', (msg) => {
        console.log(msg.username + '加入了聊天室');
        users[socket.id].username = msg.username;
        let notice = {
            event: 'join',
            data: {
                username: msg.username
            }
        }
        io.emit('message', notice);
    });

    //分发聊天信息
    socket.on('say', (msg) => {
        let message = {
            event: 'broadcast_say',
            data: {
                text: msg.text,
                username: msg.username
            }
        }
        io.emit('message', message);
    });

    //分发离开聊天室提示
    socket.on('disconnect', () => {
        console.log(users[socket.id].username + '离开了聊天室');
        let message = {
            event: 'broadcast_quit',
            data: {
                username: users[socket.id].username
            }
        }
        io.emit('message', message);
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});