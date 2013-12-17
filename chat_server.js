var fs = require('fs');

var options = {
  key : fs.readFileSync('/data/nginx/apps/ssl/ahwaa_173_203_92_230_ssl.key'),
  cert: fs.readFileSync('/data/nginx/apps/ssl/ahwaa_173_203_92_230_ssl.crt')
  // ca: fs.readFileSync('/etc/ssl/ebscerts/bundle.crt')
};

var app = require('https').createServer(options),
    io  = require('socket.io').listen(app.listen(8080));

// io.configure(function () {
//     io.set("transports", ["xhr-polling"]);
//     io.set("polling duration", 10);
// });

var _users = {};

io.sockets.on('connection', function(client) {
    client.on('set:userdata', function(userdata, callback) {
        var new_user = false;
        if (_users[userdata.id] === undefined) {
            _users[userdata.id] = userdata;
            new_user = true;
        }

        client.set('userdata', userdata);
        callback(userdata, _users, new_user);
    });

    client.on('log_out', function(userdata, callback) {
        if (_users[userdata.id]) {
            delete _users[userdata.id];
        }
        callback();
    });

    client.on('join:room', function(room, callback) {
        client.get('userdata', function(err, userdata) {
            client.room = room.id;
            client.user = userdata;

            client.join(room.id);

            // extend response object
            room.userdata = userdata;
            room.total = io.sockets.clients(room.id).length;

            io.sockets.emit('room:update:counter', room);
            io.sockets.emit('room:update:userslist', room);
            client.broadcast.to(room.id).emit('room:joined', room);
            client.emit('me:joined', room);

            if (callback) callback(room);
        });
    });

    client.on('leave:room', function(room, callback) {
        client.get('userdata', function(err, userdata) {
            // extend response object
            room.userdata = userdata;

            io.sockets.emit('room:update:counter', room);
            io.sockets.emit('room:update:userslist', room);
            client.broadcast.to(room.id).emit('room:left', room);
            client.emit('me:left', room);

            client.leave(room.id);
            if (callback) callback(room);
        });
    });

    client.on('leave:by:reload', function(room, callback) {
        client.get('userdata', function(err, userdata) {
            room.userdata = userdata || room.user;
            client.broadcast.to(room.id).emit('room:left', room);
            // client.leave(room.id);
            if (callback) callback(room);
        });
    });

    client.on('send:message', function (data) {
        client.get('userdata', function(err, userdata) {
            data.userdata = userdata;
            io.sockets.in(data.id).emit('chat:message', data);
        });
    });

    client.on('new:room', function(data) {
        io.sockets.emit('room:new', data);
    });

    client.on('room:invite', function(data) {
        io.sockets.emit('invite:room', data);
    });

    client.on('shutdown:room', function(data, callback) {
        io.sockets.emit('room:shutdown', data);
        if (callback) callback(data);
    });

    client.on('block:user', function(data, callback) {
        io.sockets.in(data.roomid).emit('user:blocked', data);
        if (callback) callback(data);
    });

    client.on('get:room:users', function(roomID, callback) {
        var roster  = io.sockets.clients(roomID),
            users   = [];
        roster.forEach(function(cl) {
            users.push(cl.user);
        });
        if (callback) callback(users);
        users = null;
    });

    client.on('get:totalUsers', function(roomID, callback) {
        var total = io.sockets.clients(roomID).length;
        callback(total);
    });

    // excluding client : client.broadcast.to('room1').emit('fn', {}, {});
    // globally         : io.sockets.in('room1').emit('fn', {}, {});
    // itself           : client.send('wording')
});
