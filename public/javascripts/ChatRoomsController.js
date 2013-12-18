Class('ChatRoomsController').includes(CustomEventSupport, NodeSupport)({
    prototype : {

        socket  : null,
        url     : location.hostname,
        port    : '8080',
        connected: false,

        init : function() {
            var _this = this;

            if (typeof io === 'undefined') {
                throw('The remote server is not available. Please try again later.');
                return null;
            }

            this.storage = new Cripta('ChatRooms', {type: sessionStorage, values: []});

            if (window.current_user === null) {
                this.storage.remove();
                return null;
            }

            if (location.port === '') {
                // prod
                this.socket = io.connect(this.url);
            } else {
                // dev
                this.socket = io.connect(this.url + ':' + this.port);
            }

            Ahwaa.Model.User = new User({
                id          : window.current_user.id,
                name        : window.current_user.name,
                avatar      : window.current_user.user_avatar,
                level       : window.current_user.user_heart,
                is_mod      : window.current_user.is_mod,
                disclosure  : window.current_user.disclosure,
                in_rooms    : [],
                host_of     : []
            });

            _this.appendChild(
                new Ahwaa.UI.ChatRoomsUIManager({
                    name: 'CRUIM'
                })
            ).render( $('.page-wrapper ') );

            _this.CRUIM.activate();

            _this.bindings();
            _this.serverBinds();

            this.socket.on('connect', function() {
                _this.socket.emit('set:userdata', Ahwaa.Model.User, function(data, users, is_new) {
                    console.log('USERDATA SET: ', data.name);
                    console.log(users, 'is new: ', is_new)

                    if (!is_new) {
                        _this.CRUIM.checkStorage();
                    }

                    Ahwaa.Collection.Rooms.forEach(function(room) {
                        _this.socket.emit('get:totalUsers', room.id, function(total) {
                            room.updateCounter(total);
                            room.deleteIfEmpty();
                        });
                    });

                    Ahwaa.Collection.Rooms.forEach(function(room) {
                        _this.socket.emit('get:room:users', room.id, function(users) {
                            if (room.$usersList) {
                                room.$usersList.update(users);
                            }
                        });
                    });

                    _this.CRUIM.chatRoomsList.hideConnectionMessage();
                    Ahwaa.Collection.Rooms.forEach(function(room) {
                        room.hideConnectionMessage();
                    });
                });
            });

            this.socket.on('disconnect', function() {
                console.log('disconnect');
                _this.CRUIM.chatRoomsList.showConnectionMessage();
                _this.CRUIM.activeChatRooms.forEach(function(room) {
                    room.showConnectionMessage();
                });
            });

            this.socket.on('reconnect', function () {
                console.log('reconnect');
                _this.loadPreviousState();
            });
        },

        loadPreviousState : function loadPreviousState() {
            var _this                   = this,
                deactivatedRoomsCounter = 0,
                activaRoomsLength       = this.CRUIM.activeChatRooms.length;

            this.CRUIM.activeChatRooms.forEach(function(room) {
                _this.socket.emit('leave:room', {
                    id: room.id,
                    removeFromStorage: false
                }, function() {
                    deactivatedRoomsCounter += 1;
                    _this.CRUIM.removeChatRoom(room);
                    if (deactivatedRoomsCounter === activaRoomsLength) {
                        _this.CRUIM.checkStorage();
                    }
                });
            });
        },

        bindings : function() {
            var _this = this;

            $('.log-out').bind('click', function(ev) {
                _this.socket.emit('log_out', Ahwaa.Model.User, function(users) {
                    _this.CRUIM.activeChatRooms.forEach(function(room) {
                        _this.socket.emit('leave:room', {id: room.id}, function() {
                            _this.CRUIM.removeChatRoom(room);
                            room.$chatListReference.remove();
                            room.$chatList.updateChatRoomsCounter();
                            room.destroy();
                        });
                    });
                });
            });

            this.CRUIM.bind('check:before:join', function(ev, data) {
                console.log('checking ot join...');
                _this.socket.emit('join:room', {id : data.id}, function() {
                    console.log('%cjoined!', 'color: blue; font-weight: bold');
                    _this.CRUIM.addChat(data);
                });
            });

            this.CRUIM.bind('check:before:shutdown', function(ev, data) {
                $.ajax({
                    url     : "/chat_rooms/" + parseInt(data.id),
                    type    : "DELETE",
                    success : function(response) {
                        if (response === true) {
                            _this.socket.emit('shutdown:room', {id: data.id});
                            console.log('%cshutdown!', 'color: red; font-weight: bold');
                        }
                    },
                    error   : function(data) {
                        console.log('%cError: before:shutdoww', 'color: red; font-weight: bold', data);
                    }
                });
            });

            this.CRUIM.bind('check:before:blocking:user', function(ev, data) {
                $.ajax({
                    url     : "/chat_rooms/" + parseInt(data.roomid),
                    data    : {
                        user_id: data.userdata.id
                    },
                    type    : "PUT",
                    success : function(response, e) {
                        console.log('%c' + data.userdata.name + 'blocked!', 'color: red; font-weight: bold');
                        _this.socket.emit('block:user', data);
                    },
                    error   : function(e) {
                        console.log(e);
                    }
                });
            });

            Ahwaa.UI.ChatRoom.bind('delete:room', function(ev, data) {
                if (Ahwaa.Collection.Rooms.indexOf(data) >= 0) {
                    console.log('%c' + Ahwaa.Model.User.name + ' wants to delete ' + data.id, 'color: red; font-weight: bold');
                    $.ajax({
                        url     : "/chat_rooms/" + parseInt(data.id) + '/destroy_chat',
                        type    : "POST",
                        success : function(response) {
                            if (response === true) {
                                console.log('%cdeleted!', 'color: red; font-weight: bold');
                                _this.socket.emit('shutdown:room', {id: data.id});
                            }
                        },
                        error   : function(data) {
                            console.log('%cError: deleting', 'color: red; font-weight: bold', data);
                        }
                    });
                }
            });

            this.CRUIM.bind('leave:room', function(ev, data) {
                _this.socket.emit('leave:room', {id: data.id}, function() {
                    _this.CRUIM.removeChatRoom(data);
                });
            });

            Ahwaa.UI.ChatRoom.bind('new:message', function(ev, data) {
                _this.socket.emit('send:message', {id: data.id, message: data.message});
            });

            Ahwaa.UI.ChatRoomsInviteForm.bind('room:invite', function(ev, data) {
                _this.socket.emit('room:invite', data);
            });

            Ahwaa.UI.CreateChatRoomForm.bind('new:room', function(ev, data) {
                _this.socket.emit('new:room', data);
            });
        },

        serverBinds : function serverBinds() {
            var _this = this;

            this.socket.on('room:shutdown', function(data) {
                _this.CRUIM.chatRoomsList.collection.forEach(function(room, i) {
                    if (room.id === data.id) {
                        _this.socket.emit('leave:room', {id: data.id}, function() {
                            _this.CRUIM.removeChatRoom(room);
                            _this.CRUIM.chatRoomsList.collection.splice(i, 1);
                            room.listRef.remove();
                            room.$chatList.updateChatRoomsCounter();
                            room.destroy();
                        });
                    }
                });
            });

            this.socket.on('user:blocked', function(data) {
                _this.CRUIM.activeChatRooms.some(function(room) {
                    if (room.id === data.roomid) {
                        room.addSystemMessage(data, 'blocked');
                        if (data.userdata.id === Ahwaa.Model.User.id) {
                            _this.socket.emit('leave:room', {
                                id: data.roomid
                            }, function() {
                                _this.CRUIM.removeChatRoom(room);
                                room.$chatListReference.remove();
                                room.$chatList.updateChatRoomsCounter();
                                room.destroy();
                            });
                        }
                    }
                });
            });

            this.socket.on('room:joined', function(data) {
                console.log('%c' + data.userdata.name + ' connected to ----- ' + data.id, 'color: #008000; font-weight: bold');
                _this.CRUIM.activeChatRooms.some(function(room){
                    if (room.id === data.id) {
                        room.addSystemMessage(data, 'join');
                        _this.CRUIM.updateGlobalActivity();
                    }
                });
            });

            this.socket.on('room:update:counter', function(data) {
                _this.CRUIM.chatRoomsList.collection.forEach(function(room) {
                    if (room.id === data.id) {
                        _this.socket.emit('get:totalUsers', data.id, function(total) {
                            room.updateCounter(total);
                        });
                    }
                });
            });

            this.socket.on('room:update:userslist', function(data) {
                _this.CRUIM.chatRoomsList.collection.forEach(function(room) {
                    if (room.id === data.id) {
                        _this.socket.emit('get:room:users', room.id, function(users) {
                            if (room.$usersList) {
                                room.$usersList.update(users);
                                if (room.id === room.$chatList.$usersList.room_id) { // update chatList's userList too if visible
                                    if (room.$chatList.$usersList.isVisible())
                                        room.$chatList.$usersList.update(users);
                                }
                            }
                        });
                    }
                });
            });

            this.socket.on('room:left', function(data) {
                console.log('%c' + data.userdata.name + ' has leaved ------ ' + data.id, 'color: orange; font-weight: bold');
                _this.CRUIM.activeChatRooms.some(function(room){
                    if (room.id === data.id) {
                        room.addSystemMessage(data, 'leave');
                        _this.CRUIM.updateGlobalActivity();
                    }
                });
            });

            this.socket.on('chat:message', function(data) {
                console.log('%cmessage:sent:to ' + data.id + ' from ' + data.userdata.name, 'color: #09c; font-weight: bold');
                _this.CRUIM.activeChatRooms.some(function(room){
                    if (room.id === data.id) {
                        room.addMessage(data);
                        _this.CRUIM.updateGlobalActivity();
                    }
                });
            });

            this.socket.on('room:new', function(data) {
                console.log('%c' + Ahwaa.Model.User.name + ' created a new room ----- ' + data.name, 'color: blue; font-weight: bold');

                if (data.user.id === Ahwaa.Model.User.id) {
                    _this.CRUIM.chatRoomsList.createNewChat(data);
                    return false;
                }

                if (data.is_private) {
                    $.ajax({
                        url     : "/chat_rooms/is_user_allow",
                        type    : "post",
                        data    : {
                            user_id : Ahwaa.Model.User.id,
                            room_id : data.id
                        },
                        success : function(response) {
                            if (response) _this.CRUIM.chatRoomsList.createNewChat(data, true);
                            else console.warn('User not allowed to private room')
                        },
                        error: function(data) {console.log(data)}
                    });
                    return false;
                }

                // default
                _this.CRUIM.chatRoomsList.createNewChat(data);

                // check invitations
                var i = 0,
                    invationsLength = data.invited_users.length;
                for (i = 0; i < invationsLength; i += 1) {
                    if (data.invited_users[i].id === Ahwaa.Model.User.id) {
                        _this.CRUIM.chatRoomsList.collection[_this.CRUIM.chatRoomsList.collection.length - 1].markAsUnread(data.user);
                    }
                }
            });

            this.socket.on('invite:room', function(data) {
                data.users.forEach(function(user, i) {
                    if (user.id === Ahwaa.Model.User.id) {
                        var i = 0,
                            l = _this.CRUIM.chatRoomsList.collection.length,
                            rendered = false;

                        for (i = 0; i < l; i += 1) {
                            var room = _this.CRUIM.chatRoomsList.collection[i];
                            if (room.id === data.id) {
                                rendered = true;
                                room.markAsUnread(data.user);
                            }
                        }

                        if (rendered === false) _this.CRUIM.chatRoomsList.createNewChat(data, true);
                    }
                });
            });

            this.socket.on('me:joined', function(data) {
                Ahwaa.Collection.Rooms.forEach(function(room) {
                    if (data.id === room.id) {
                        _this.storage.find('id', room.id, function(result) {
                            if (!result) this.add({id: room.id, name: room.name, messages: []}).save();
                        });
                    }
                });
            });

            this.socket.on('me:left', function(data) {
                if (data.removeFromStorage === false) return false;

                _this.CRUIM.activeChatRooms.forEach(function(room) {
                    if (data.id === room.id) {
                        _this.storage.find('id', room.id, function(result) {
                            if (result) this.remove(result);
                        }).save();
                    }
                });
            });
        }
    }
});
