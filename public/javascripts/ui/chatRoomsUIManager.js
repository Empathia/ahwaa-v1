Class(Ahwaa.UI, 'ChatRoomsUIManager').inherits(Ahwaa.UI.Widget)({
    elementClass: 'chat-wrapper--widget',
    html: '\
        <div data-pageslide="closed">\
            <div class="chat__window chat-widget chat-widget__notifications visible">\
                <div class="chat__header">\
                    <h3 class="chat__header--title chat-widget__title">\
                        <span>0</span> active rooms\
                    </h3>\
                </div>\
                <span class="notification-badge">0</span>\
        </div>\
    ',

    prototype : {

        activeChatRooms: [],
        activityCounter: 0,

        init : function init(attributes) {
            var _this = this;
            Ahwaa.UI.Widget.prototype.init.apply(this, [attributes]);

            this.$chatsFeedback = this.element.find('.chat-widget__notifications');
            this.$activeRooms   = this.element.find('.chat__header--title span');
            this.$bubble        = this.element.find('.notification-badge');

            this.appendChild(
                new Ahwaa.UI.ChatRoomsList({
                    name: 'chatRoomsList',
                    element: $('.room-chat-list')
                })
            );
            this.chatRoomsList.activate();
            this.bindings();
        },

        bindings : function bindings() {
            var _this = this;

            Ahwaa.UI.ChatRoom.bind('join:room', function(ev, data) {
                var rendered = _this.activeChatRooms.some(function(el) {
                    return el === data;
                });

                if (rendered === false) {
                    console.log('%c' + Ahwaa.Model.User.name + ' wants to connected to ----- ' + data.id, 'color: blue; font-weight: bold');
                    _this.dispatch('check:before:join', data);
                    return true;
                }

                _this.setChatUpfront(data);
                console.warn('Cannot join, the user is already in the room! ' + data.id);
            });

            Ahwaa.UI.ChatRoom.bind('leave:room', function(ev, data) {
                console.log('%c' + Ahwaa.Model.User.name + ' wants to leave ----- ' + data.id, 'color: blue; font-weight: bold');
                _this.dispatch('leave:room', data);
            });

            Ahwaa.UI.ChatRoom.bind('shutdown:room', function(ev, data) {
                console.log('%c' + Ahwaa.Model.User.name + ' wants to shutdown ' + data.id, 'color: red; font-weight: bold');
                _this.dispatch('check:before:shutdown', data);
            });

            Ahwaa.UI.ChatRoom.bind('block:user', function(ev, data) {
                console.log('%c' + Ahwaa.Model.User.name + ' wants to block ' + data.userdata.name + ' from ' + data.roomid, 'color: #ff0000; font-weight: bold');
                _this.dispatch('check:before:blocking:user', data);
            });

            Ahwaa.UI.ChatRoom.bind('chat:toFront', function(ev, data) {
                _this.setChatUpfront(data);
            });

            Ahwaa.UI.ChatRoom.bind('chat:toggle:collapse', function(ev, data) {
                _this.toggleChats();
            });

            this.$chatsFeedback.bind('click', function() {
                _this.toggleChats();
            });
        },

        addChat : function addChat(roomChatInstance) {
            if (this.activeChatRooms.indexOf(roomChatInstance) < 0) {
                console.log('%c' + Ahwaa.Model.User.name + ' connected to ----- ' + roomChatInstance.id, 'color: green; font-weight: bold');
                this.activeChatRooms.push(roomChatInstance);
                this.appendChild(roomChatInstance).render(this.element);

                if (this.activated === false) {
                    this.toggleChats();
                }

                this.setChatUpfront(roomChatInstance);
                this.updateActiveRooms();

                roomChatInstance.inView();
                roomChatInstance.$chatListReference.addClass('active');
                roomChatInstance.bindEvents();
                return this;
            }
            console.log('chat already rendered');
        },

        removeChatRoom : function removeChatRoom(roomChatInstance) {
            if (this.activeChatRooms.indexOf(roomChatInstance) >= 0) {
                console.log('%c' + Ahwaa.Model.User.name + ' leaved ----- ' + roomChatInstance.id, 'color: #ff62bb; font-weight: bold');

                this.activeChatRooms.splice(this.activeChatRooms.indexOf(roomChatInstance), 1);
                this.removeChild(roomChatInstance);
                this.setChatUpfront(this.activeChatRooms[0]);
                this.updateActiveRooms();

                roomChatInstance.outView();
                roomChatInstance.element.detach();
                roomChatInstance.unbind();
                roomChatInstance.listRef.removeClass('active');
            }
        },

        verifyDisclosure : function verifyDisclosure() {

            if (Ahwaa.Model.User.disclosure === true) {
                return true;
            }

            new Ahwaa.UI.Confirm({
                cssClass    : 'accept-disclosure',
                title       : 'Just before you start!',
                message     : '\
                    <p>\
                    We need you to accept that you will not ask for \
                    nor disclose any personal information while you \
                    participate in Ahwaa chat rooms.\
                    </p>',
                showCloseButton : false,
                cancelButton : {
                    text : 'I Don\'t Accept'
                },
                okButton : {
                    text : 'I Accept',
                    callback : function() {
                        Ahwaa.Model.User.disclosure = true;
                        $.ajax({
                            url     : "/chat_rooms/chat_disclosure",
                            type    : "POST",
                            success : function(response) {
                                console.log('%cDisclosure::accepted', 'color: green; font-weight: bold');
                            },
                            error   : function(data) {
                                console.log('%cError: accept:disclosure:post', 'color: red; font-weight: bold', data);
                            }
                        });
                    }
                }
            }).render($('body'));

            return false;
        },

        updateActiveRooms : function updateActiveRooms() {
            this.$activeRooms.text(this.activeChatRooms.length);
        },

        updateGlobalActivity : function updateGlobalActivity() {
            $.titleAlert("New chat message!", {
                stopOnFocus:true,
                stopOnMouseMove: true,
                requireBlur: true
            });
            if (this.activated === false) {
                this.activityCounter += 1;
                this.$bubble.addClass('on').text(this.activityCounter);
            }
        },

        resetGlobalActivity : function resetGlobalActivity() {
            this.activityCounter = 0;
            this.$bubble.removeClass('on').text(this.activityCounter);
        },

        checkStorage : function checkStorage() {
            var _this = this,
                chatRoomsStorage = this.parent.storage.get();
            if (chatRoomsStorage) {
                this.chatRoomsList.collection.forEach(function(roomInstance, i) {
                    chatRoomsStorage.forEach(function(room, j) {
                        if (roomInstance.id === room.id) {
                            Ahwaa.UI.ChatRoom.dispatch('join:room', roomInstance);
                            room.messages.forEach(function(message, i) {
                                roomInstance.loadMessage(message);
                            });
                            var timer = window.setTimeout(function(){
                                roomInstance.scrollDown();
                                window.clearTimeout(timer);
                                timer = null;
                            }, 0);
                        }
                    });
                });
            } else {
                this.parent.storage.rewrite([]).save();
            }
        },

        toggleChats : function toggleChats() {
            this.activeChatRooms.forEach(function(chat, i){
                chat.element.toggleClass('collapse');
            });

            if (this.activeChatRooms[0].element.hasClass('collapse')) {
                this.deactivate();
                this.$chatsFeedback.delay(350).fadeIn(400);
            } else {
                this.activate();
                this.resetGlobalActivity();
                this.$chatsFeedback.hide();
            }
        },

        setChatUpfront : function setChatUpfront(chatRoom) {
            var chatsLength     = this.activeChatRooms.length,
                maxIndex        = chatsLength,
                reversedIndex   = maxIndex - 1,
                bottom          = 5,
                right           = 30;

            this.activeChatRooms.forEach(function(chat, i) {

                if (chat === chatRoom) {
                    chatRoom.resetBubbleCounter();
                    chatRoom.activate();
                    chat.element[0].style.zIndex = maxIndex;
                    chat.element[0].style[expCSSprefix.transform] = 'translate(0px, 0px)';
                    chatRoom.$input.focus();
                } else {
                    chat.deactivate();
                    chat.element[0].style.zIndex = reversedIndex;
                    chat.element[0].style[expCSSprefix.transform] = 'translate(-'+right+'px, '+bottom+'px)';

                    right += 30;
                    bottom += 5;
                    reversedIndex--;
                }
            });
        }
    }
});
