var net = require('net'),
    args = process.argv.slice(2),
    host = args[0],
    port = args[1],
    name = args[2],
    crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    key = 'network-final-project',
    client = new net.Socket();

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, key);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, key);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

client.connect(port, host, function () {
    console.log('My name is ' + name);
    console.log('Server Connected');
    client.write(name);
});

client.on('data', function (data) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    var result = data.toString();
    if (result.match("echo : "))
        result = decrypt(result.substr(7, result.length));
    process.stdout.write(result);
    process.stdout.write(name + " : ");
});

client.on('close', function () {
    console.log('Connection closed');
});

function wait(callback) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    var util = require('util');
    process.stdin.on('data', callback);
}

wait(function (data) {
    process.stdout.write(name + " : ");
    client.write(encrypt(name + " : " + data));
});