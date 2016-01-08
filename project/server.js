var net = require('net'),
    connected = [],
    args = process.argv.slice(2),
    host = args[0],
    port = args[1];
if (!host)
    host = "127.0.0.1";
if (!port)
    port = 3000;

function broadCast(data, sock) {
    connected.forEach(function (socket) {
        if (sock == socket)
            return;
        try {
            socket.write(data);
        } catch (e) {
        }
    });
}

function getNames() {
    return connected.map(function (socket) {
        return socket.name;
    }).join(", ");
}

var server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        if (socket.name === undefined) {
            connected.push(socket);
            socket.name = data.toString();
            socket.write("connected : " + getNames() + "\r\n\r\n");
            console.log(socket.name + " connected");
            broadCast("new Member " + socket.name + " connected\r\n", socket);
            return;
        }
        console.log("echo : " + data.toString());
        broadCast("echo : " + data, socket);
    });

    socket.on('close', function () {
        connected.splice(connected.indexOf(socket), 1);
        console.log(socket.name + " disconnected");
        broadCast("Member " + socket.name + " disconnected\r\n", socket);
    });

});

server.listen(port, host);
console.log("waiting for client...");
