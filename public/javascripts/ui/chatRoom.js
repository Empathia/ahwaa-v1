Class(Ahwaa.UI, 'ChatRoom').inherits(Ahwaa.UI.Widget)({
    elementClass: 'chat-widget',
    html: '\
        <div class="chat__window">\
            <header class="chat__header">\
                <h3 class="chat__header--title chat-widget__title">Chat Title</h3>\
                <div class="chat__header--options">\
                    <i class="chat__header--close chat-widget__leave chat-icon chat-icon--close-header effekt-tooltip" data-tooltip-text="Leave Conversation" data-position="top"></i>\
                </div>\
            </header>\
            <div class="chat-widget__list custom-scrollbars small-avatars"></div>\
            <footer>\
                <form class="chat-widget__form">\
                    <textarea class="chat-widget__input text-input-styled custom-scrollbars" placeholder="Enter your message here" rows="1"></textarea>\
                    <button class="chat-widget__submit btn btn-clean">Send</button>\
                </form>\
            </footer>\
            <div class="chat-widget__layer-blocker"></div>\
            <span class="notification-badge">0</span>\
        </div>\
    ',
    prototype : {

        is_mod              : false,
        is_host             : false,
        host_id             : null,

        activityCounter     : 0,
        textareaAddedLines  : 0,

        toLinks : function URLtoLink (text) {
            var re = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(\:\d+)?(\/\S*)?)/ig;
            return text.replace(re, function ( match, p1 ) {
                var protocol = /:\/\//.test(match) ? '' : 'http://';
                if ( parseInt(match, 10) )
                    return match;
                return "<a href='" + protocol + '' +  match + "' target='_blank'>" + match + "</a>"
            });
        },

        sanitize : function sanitize (html, whitelist) {
            whitelist = whitelist || {'font': ['color'], 'strong': [], 'b': [], 'i': []};
            var _this = this,
                output = $('<div>'+html+'</div>');
            output.find('*').each(function() {
                var allowedAttrs = whitelist[this.nodeName.toLowerCase()];
                if ( !allowedAttrs ) {
                    $(this).remove();
                } else {
                    _this.trimAttributes(this, allowedAttrs);
                }
            });
            return output.html();
        },

        trimAttributes : function trimAttributes (node, allowedAttrs) {
            $.each(node.attributes, function () {
              var attrName = this.name;
              if ( $.inArray(attrName, allowedAttrs) == -1 ) {
                $(node).removeAttr(attrName)
              }
            });
        },

        init : function init(attributes) {
            Ahwaa.UI.Widget.prototype.init.apply(this, [attributes]);
            var _this       = this;

            this.prefix     = '.' + this.constructor.elementClass;

            this.$header    = this.element.find('.chat__header');
            this.$title     = this.element.find(this.prefix + '__title');
            this.$options   = this.$header.find('.chat__header--options');
            this.$list      = this.element.find(this.prefix + '__list');
            this.$form      = this.element.find(this.prefix + '__form');
            this.$input     = this.element.find(this.prefix + '__input');
            this.$submit    = this.element.find(this.prefix + '__submit');
            this.$leave     = this.element.find(this.prefix + '__leave');
            this.$blocker   = this.element.find(this.prefix + '__layer-blocker');
            this.$bubble    = this.element.find('.notification-badge');

            this.$title[0].title = this.label;
            this.$title[0].textContent = this.label;

            if (!this.is_host) this.is_host = this.isHostOf(Ahwaa.Model.User.id, this.id);

            this.appendChild(
                new Ahwaa.UI.OverlayMessage({
                    name        : '$reconnecting',
                    showLoader  : true,
                    title       : "Hold on",
                    message     : "We're reconnecting to the server"
                })
            ).render(this.element);

            this.appendChild(
                new Ahwaa.UI.ChatRoomUsersList({
                    name    : '$usersList',
                    room_id : this.id
                })
            ).render(this.element);

            if (this.is_mod || this.is_host) {
                if (this.is_mod) this.addModeratorOptions();
                if (this.is_host) this.addHostOptions();
            } else {
                this.$headerOnlineUsers = $('\
                    <div class="info__user-count effekt-tooltip" data-tooltip-text="View Online Users" data-position="top">\
                        <i class="chat-icon chat-icon--user-lighter with-counter" data-count="0"></i>\
                    </div>\
                ');
                this.$headerCounter = this.$headerOnlineUsers.find('.chat-icon--user-lighter');

                this.$options.prepend(this.$headerOnlineUsers);
                this.$headerOnlineUsers.bind({
                    click : function onlineUsersClick(ev) {
                        ev.stopPropagation();
                        _this.$usersList.show();
                    },
                    mouseover : function onlineUsersEnter(ev) {
                        ev.stopPropagation();
                    },
                    mouseout : function onlineUsersOut(ev) {
                        ev.stopPropagation();
                    }
                });
            }

            this.bindings();
            this.bindingsListRefence();
        },

        resetBubbleCounter: function resetBubbleCounter() {
            this.activityCounter = 0;
            this.$bubble.removeClass('on').text(this.activityCounter);
        },

        updateBubble : function updateBubble() {
            if (this.activated === false) {
                this.activityCounter += 1;
                this.$bubble.addClass('on').text(this.activityCounter);
            }
        },

        addModeratorOptions : function addModeratorOptions() {
            var _this = this;

            this.$options.prepend('\
                    <div class="chat__admin-actions">\
                        <i class="chat__admin-actions--toggler chat-icon chat-icon--settings-header effekt-tooltip" data-tooltip-text="Admin Actions" data-position="top"></i>\
                        <div class="dropdown">\
                            <ul>\
                                <li class="chat-widget__shutdown">Shutdown Room</li>\
                                <li class="chat-widget__view-user-list">View Users in Room</li>\
                            </ul>\
                        </div>\
                    </div>');

            this.$adminOptions      = this.$options.find('.chat__admin-actions .chat__admin-actions--toggler');
            this.optionsToggler     = new Toggler(this.$adminOptions, this.$adminOptions.next('.dropdown'));
            this.$optionsViewList   = this.$options.find(this.prefix + '__view-user-list');
            this.$optionsShutdown   = this.element.find(this.prefix + '__shutdown');

            this.$optionsViewList.bind('click', function(ev) {
                ev.stopPropagation();
                _this.optionsToggler.hide();
                _this.$usersList.show();
            });

            this.$optionsShutdown.bind({
                click : function(ev) {
                    ev.stopPropagation();
                    var totalUsers = _this.getTotalUser();
                    new Ahwaa.UI.Confirm({
                        title   : 'Close room',
                        message : '<p><b>Are you sure you want to close this chat room?</b></p>\
                                   <p>There ' + Ahwaa.utils.pluralize(totalUsers, "is/are") + '\
                                   ' + totalUsers + '\
                                    ' + Ahwaa.utils.pluralize(totalUsers, 'user/users') + '\
                                   still chatting in it.</p>',
                        cancelButton : {
                            text : 'No, Don\'t Close Room'
                        },
                        okButton : {
                            text : 'Yes, Close Room',
                            callback : function() {
                                _this.optionsToggler.hide();
                                _this.constructor.dispatch('shutdown:room', {
                                    id: _this.id
                                });
                            }
                        }
                    }).render($('body'));
                }
            });
        },

        addHostOptions : function addHostOptions() {
            var _this = this;

            this.appendChild(
                new Ahwaa.UI.ChatRoomsInviteForm({
                    name        : '$inviteForm',
                    room_name   : _this.label,
                    room_id     : _this.id
                })
            ).render(this.element);

            this.$optionsInvite = $('<li class="chat-widget__invite-users">Invite Users</li>');
            this.$options.find('.chat-widget__shutdown').after(this.$optionsInvite);

            this.$optionsInvite.bind({
                click: function(ev) {
                    ev.stopPropagation();
                    _this.optionsToggler.hide();
                    _this.$inviteForm.show();
                }
            });
        },

        bindings : function bindings() {
            var _this = this;

            this.$header.bind({
                click: function(ev) {
                    ev.preventDefault();
                    _this.constructor.dispatch('chat:toggle:collapse', _this);
                },
                mouseover : function chatHeaderEnter(ev) {
                    _this.$header.addClass('hover');
                },
                mouseout : function chatHeaderOut(ev) {
                    _this.$header.removeClass('hover');
                }
            });

            this.$blocker.bind('click', function() {
                _this.constructor.dispatch('chat:toFront', _this);
            });

            this.$list.bind('DOMMouseScroll mousewheel', function(ev) {
                var $this = $(this),
                    scrollTop = this.scrollTop,
                    scrollHeight = this.scrollHeight,
                    height = $this.height(),
                    delta = (ev.type == 'DOMMouseScroll' ?
                        ev.originalEvent.detail * -40 :
                        ev.originalEvent.wheelDelta),
                    up = delta > 0;

                var prevent = function() {
                    ev.stopPropagation();
                    ev.preventDefault();
                    ev.returnValue = false;
                    return false;
                }

                if (!up && -delta > scrollHeight - height - scrollTop) {
                    // Scrolling down, but this will take us past the bottom.
                    $this.scrollTop(scrollHeight);
                    return prevent();
                } else if (up && delta > scrollTop) {
                    // Scrolling up, but this will take us past the top.
                    $this.scrollTop(0);
                    return prevent();
                }
            });
        },

        bindingsListRefence : function bindingsListRefence() {
            var _this = this;
            this.$chatList          = this.chatList;    // expect this item to be passed through widget instantiation
            this.$chatListReference = this.listRef;     // expect this item to be passed through widget instantiation
            this.$cl_refcount       = this.$chatListReference.find('.chat-icon--user');
            this.$cl_options        = this.$chatListReference.find('.chat__admin-actions--toggler');
            this.$cl_shutdown       = this.$chatListReference.find('.admin-shut-down');
            this.$cl_invite         = this.$chatListReference.find('.admin-invite-users');
            this.$cl_showList       = this.$chatListReference.find('.info__user-count');
            this.$cl_invitation     = this.$chatListReference.find('.chat-icon--invitation-list');

            this.$cl_refcount[0].setAttribute('data-count', 0);

            this.$cl_options.bind('click', function(ev) {
                if (_this.$chatList.parent.verifyDisclosure()) {
                    return true;
                }

                ev.preventDefault();
                ev.stopImmediatePropagation();
                return false;
            });

            var adminToggler = new Toggler(this.$cl_options, this.$cl_options.next('.dropdown'));

            this.$chatListReference.bind('click', function(ev) {
                if (_this.$chatList.parent.verifyDisclosure()) {
                    _this.constructor.dispatch('join:room', _this);
                    _this.markAsRead();
                }
            });

            this.$cl_shutdown.bind('click', function(ev) {
                ev.stopPropagation();

                if (_this.$chatList.parent.verifyDisclosure()) {
                    var room_id = $(this).data('room-id'),
                        totalUsers = _this.getTotalUser();

                    new Ahwaa.UI.Confirm({
                        title   : 'Close room',
                        message : '<p><b>Are you sure you want to close this chat room?</b></p>\
                                   <p>There are ' + totalUsers + ' users still chatting in it.</p>',
                        cancelButton : {
                            text : 'No, Don\'t Close Room'
                        },
                        okButton : {
                            text : 'Yes, Close Room',
                            callback : function() {
                                adminToggler.hide();
                                _this.constructor.dispatch('shutdown:room', {
                                    id: room_id
                                });
                            }
                        }
                    }).render($('body'));
                }
            });

            this.$cl_invite.bind('click', function(ev) {
                ev.stopPropagation();

                if (_this.$chatList.parent.verifyDisclosure()) {
                    adminToggler.hide();

                    var room    = $(this).parents('li'),
                        roomID  = room.data('id'),
                        roomTitle = room.data('title');

                    _this.$chatList.inviteForm.show()
                        .updateId(roomID)
                        .updateLabel(["<b>Invite to Room:</b> <i>", roomTitle, "</i>"].join(' '), roomTitle);
                }
            });

            this.$cl_showList.bind('click', function(ev) {
                ev.stopPropagation();
                if (_this.$chatList.parent.verifyDisclosure()) {
                    _this.$chatList.$usersList.room_id = _this.id;
                    _this.$chatList.$usersList.update(_this.$usersList.users).show();
                }
            });

            if (this.$cl_invitation.hasClass('unread')) {
                this.$cl_invitation.one('mouseover', function () {
                    _this.markAsRead();
                });
            }

            this.$chatListReference.find('.effekt-tooltip').bind('mouseover', function(ev) {
                ev.preventDefault();
                var self        = $(this),
                    listPos     = self.parents('ul').offset().top,
                    itemPos     = self.parents('li').offset().top,
                    itemOffset  = itemPos - listPos;
                this.setAttribute('data-position', (itemOffset < 30) ? 'bottom' : 'top');
            });
        },

        bindEvents: function bindEvents() {
            var _this = this;

            this.$input.bind('keydown', function(ev) {
                if (ev.ctrlKey && (ev.keyCode == 13)) {
                    _this.checkAutoGrow();
                    return;
                }

                if (ev.keyCode === 13) {
                    _this.$form.submit();
                    ev.preventDefault();
                }

                _this.checkAutoGrow();
            });

            this.$submit.bind('click', function() {
                _this.$form.submit();
            });

            this.$form.bind('submit', function(ev) {
                var message = _this.$input.val();

                _this.$input[0].style.height = "";
                _this.$list[0].style.height = "";
                _this.textareaAddedLines = 0;

                if (message.trim().length) {
                    _this.sendMessage(_this.id, message);
                }

                _this.$input[0].value = "";
                return false;
            });

            this.$leave.bind({
                click: function(ev) {
                    ev.stopPropagation();
                    _this.constructor.dispatch('leave:room', _this);
                    _this.deleteIfEmpty();
                },
                mouseover : function chatLeaveEnter(ev) {
                    ev.stopPropagation();
                },
                mouseout : function chatLeaveOut(ev) {
                    ev.stopPropagation();
                }
            });
        },

        deleteIfEmpty : function deleteIfEmpty() {
            var _this = this;
            this.chatList.parent.parent.socket.emit('get:totalUsers', this.id, function(total) {
                console.log(_this.name, 'online users: ', total)
                if (total === 0) _this.constructor.dispatch('delete:room', _this);
            });
        },

        checkAutoGrow : function checkAutoGrow() {
            if (this.$input[0].scrollHeight !== this.$input[0].clientHeight) {
                var paddings = parseInt(this.$input.css('paddingTop'), 10) + parseInt(this.$input.css('paddingBottom'), 10);
                if (this.textareaAddedLines === 2) return;
                this.textareaAddedLines += 1;
                this.$input.height(this.$input[0].scrollHeight + paddings);
                this.$list.height(this.$list.height() - paddings - 11);
            }
        },

        loadMessage : function loadMessage(data) {
            var template;
            if (data.type === 'user') {
                template = '\
                    <div class="message-row">\
                        <div class="chat--avatar avatar ' + data.userdata.level + '">\
                            <img src="' + data.userdata.avatar + '"/>\
                            <span></span>\
                        </div>\
                        <div class="message-text-wrapper">\
                            <p class="username">' + data.userdata.name +'</p>\
                            <p class="message">'+ data.message + '</p>\
                        </div>\
                    </div>';
            } else {
                template = '\
                    <div class="system-message">\
                        <i class="chat-icon chat-icon--user"></i>\
                        <span class="message">' + data.message + '</span>\
                    </div>';
            }

            this.$list[0].innerHTML += template;
            this.scrollDown();
        },

        sendMessage : function sendMessage(roomid, message) {
            this.constructor.dispatch('new:message', {
                id      : roomid,
                message : message
            });
        },

        addMessage : function addMessage(data) {
            var _this = this,
                message = data.message;

            message = this.toLinks(message).replace(/\n/g, '<br/>');
            message = this.sanitize(message, {
                'a': ['href', 'target'],
                'br': []
            });

            this.$list[0].innerHTML += '\
                <div class="message-row">\
                    <div class="chat--avatar avatar ' + data.userdata.level + '">\
                        <img src="' + data.userdata.avatar + '"/>\
                        <span></span>\
                    </div>\
                    <div class="message-text-wrapper">\
                        <p class="username">' + data.userdata.name +'</p>\
                        <p class="message">'+ message + '</p>\
                    </div>\
                </div>';

            // if (
            //     (this.is_host || this.is_mod) //&&
            //     // (data.userdata.name === window.current_user.name)
            // ) {
            //     var items = this.$list[0].querySelectorAll('.message-row');
            //     var itemsLength = items.length;
            //     var last = items[itemsLength - 1].querySelector('.username');

            //     if (this.is_host) {
            //         last.innerHTML += ' <span class="room-chat-list__list--label">[host]</span>';
            //         data.userdata.is_host = true;
            //     } else if (this.is_mod) {
            //         last.innerHTML += ' <span class="room-chat-list__list--label">[moderator]</span>';
            //         data.userdata.is_mod = true;
            //     }
            // }

            this.parent.parent.storage.find('id', _this.id, function(result) {
                result.messages.push({type: 'user', userdata: data.userdata, message: message});
            }).save();

            this.scrollDown();
            this.updateBubble();
            message = null;
        },

        addSystemMessage : function addSystemMessage(data, type) {
            if (type === "join") {
                var message = data.userdata.name + " has joined the room! :)";
                this.$list[0].innerHTML += '\
                    <div class="system-message">\
                        <i class="chat-icon chat-icon--user"></i>\
                        <span class="message">' + message + '</span>\
                    </div>';
            }

            if (type === "leave") {
                var message = data.userdata.name + " has left the room. :(";
                this.$list[0].innerHTML += '\
                    <div class="system-message">\
                        <i class="chat-icon chat-icon--user"></i>\
                        <span class="message">' + message + '</span>\
                    </div>';
            }

            if (type === "blocked") {
                var message = data.userdata.name + " has been bloked from the room. :(";
                this.$list[0].innerHTML += '\
                    <div class="system-message">\
                        <i class="chat-icon chat-icon--user"></i>\
                        <span class="message">' + message + '</span>\
                    </div>';
            }

            this.parent.parent.storage.find('id', this.id, function(result) {
                if (result) result.messages.push({type: 'sys', userdata: data.userdata, message: message});
            }).save();

            this.updateBubble();
            this.scrollDown();
            message = null;
        },

        scrollDown : function scrollDown() {
            this.$list[0].scrollTop = this.$list[0].scrollHeight;
        },

        getTotalUser : function getTotalUser() {
            return parseInt(this.$cl_refcount[0].getAttribute('data-count'), 10);
        },

        updateCounter : function updateCounter(total) {
            this.$cl_refcount[0].setAttribute('data-count', total);
            if (this.$headerCounter) this.$headerCounter[0].setAttribute('data-count', total);

            // if it gets empty, delete it
            // if (total === 0) {
            //     this.constructor.dispatch('delete:room', this);
            // }
        },

        forceReconnection : function forceReconnection() {
            this.constructor.dispatch('rejoin:room', this);
        },

        markAsUnread : function markAsUnread(data) {
            var _this = this;
            if (this.$cl_invitation.length > 0) {
                this.$cl_invitation.addClass('unread');
            } else {
                var markup = '\
                    <div class="info__invitation">\
                        <i data-invitation-id="' + this.id + '" class="chat-icon chat-icon--invitation-list effekt-tooltip unread" data-tooltip-text="You were invited by ' + data.name + '" data-position="bottom"></i>\
                    </div>';
                this.$chatListReference.find('.info__user-count').before(markup);
                this.$cl_invitation = this.$chatListReference.find('.chat-icon--invitation-list');
            }

            this.$cl_invitation.one('mouseover', function() {
                _this.markAsRead();
            });

            this.$chatList.activityUpdate('+');
        },

        markAsRead : function markAsRead() {
            var _this = this;
            if (this.$cl_invitation.hasClass('unread')) {
                $.ajax({
                    url  : "/chat_rooms/mark_as_read",
                    type : "POST",
                    data : {
                        id : _this.$cl_invitation.data('invitation-id')
                    },
                    success : function(){
                        _this.$cl_invitation.removeClass('unread');
                        _this.$chatList.activityUpdate('-');
                    },
                    error : function(){
                        console.log('Error trying to mark as read');
                    }
                });
            }
        },

        showConnectionMessage : function showConnectionMessage() {
            this.$reconnecting.show();
        },

        hideConnectionMessage : function hideConnectionMessage() {
            this.$reconnecting.hide();
        },

        unbind : function unbind() {
            this.$list.empty();
            this.$input.unbind('keydown');
            this.$submit.unbind('click');
            this.$leave.unbind('click');
        }
    }
});
