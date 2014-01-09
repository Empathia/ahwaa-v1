Class(Ahwaa.UI, 'ChatRoomsList').inherits(Ahwaa.UI.Widget).includes(ChatHelpers)({
    prototype : {

        collection: [],
        activityCounter : 0,
        roomsCounter : 0,

        init : function init(attributes) {
            var _this = this;
            Ahwaa.UI.Widget.prototype.init.apply(this, [attributes]);

            Ahwaa.Collection.Rooms = this.collection;

            this.element.show();

            this.$mainContent       = this.element.find('.room-chat-list__body');
            this.$list              = $('.room-chat-list__list');
            this.$header            = $('.room-chat-list__header');
            this.$createNewChatBtn  = $('.create-new-chatroom-button');
            this.$bubble            = this.element.find('.notification-badge');
            this.$roomsCounter      = $('.total-room-chats');
            this.$noRooms           = this.element.find('.no-rooms-messages');

            this.is_mod             = this.$list.length && this.$list[0].getAttribute('data-mod') === "true" ? true : false;

            this.activityCounter = parseInt(this.$bubble.text(), 10);
            if (this.activityCounter > 0) {
                this.$bubble.addClass('on');
            }

            this.appendChild(
                new Ahwaa.UI.ChatRoomUsersList({
                    name : '$usersList'
                })
            ).render(this.$mainContent);

            this.appendChild(
                new Ahwaa.UI.OverlayMessage({
                    name        : '$reconnecting',
                    showLoader  : true,
                    title       : "Hold on",
                    message     : "We're reconnecting to the server"
                })
            ).render(this.element);

            if (this.is_mod) {
                this.appendChild(
                    new Ahwaa.UI.ChatRoomsInviteForm({
                        name: 'inviteForm'
                    })
                ).render(this.$mainContent);

                this.appendChild(
                    new Ahwaa.UI.CreateChatRoomForm({
                        name    : 'createChatRoomForm'
                    })
                ).render(this.$mainContent);
            }

            // caching chatRooms based on DOM rendered items
            this.getUIRoomItems().each(function(i, el) {
                var id              = parseInt(el.getAttribute('data-id'), 10),
                    title           = el.getAttribute('data-title').trim(),
                    is_mod          = el.getAttribute('data-is-moderator') === "true" ? true : false,
                    is_host         = el.getAttribute('data-is-host') === "true" ? true : false,
                    host_id         = parseInt(el.getAttribute('data-host-id'), 10),
                    is_permanent    = el.getAttribute('data-is-permanent') === "true" ? true : false,
                    is_private      = el.getAttribute('data-is-private') === "true" ? true : false,
                    listRef         = $(el);

                var chat = new Ahwaa.UI.ChatRoom({
                        id              : id,
                        name            : title.toLowerCase().replace(/\s/g, '_'),
                        label           : title,
                        listRef         : listRef,
                        chatList        : _this,
                        is_mod          : is_mod,
                        is_host         : is_host,
                        host_id         : host_id,
                        is_permanent    : is_permanent,
                        is_private      : is_private
                    });

                _this.collection.push(chat);
            });

            this.updateChatRoomsCounter();
            this.bindings();
        },

        activityUpdate : function activityUpdate(sign) {
            if (sign === "+") this.activityCounter += 1;
            if (sign === "-") this.activityCounter -= 1;

            if (this.activityCounter > 0) {
                this.$bubble.addClass('on');
            } else {
                this.$bubble.removeClass('on');
            }

            this.$bubble.text(this.activityCounter);
        },

        updateChatRoomsCounter : function updateChatRoomsCounter() {
            var total = this.collection.length;
            this.$roomsCounter.text(total);
            (total === 0) ? this.$noRooms.show() : this.$noRooms.hide();
        },

        bindings : function bindings() {
            var _this = this;

            this.$header.bind({
                click : function chatListHeaderClick(event) {
                    event.preventDefault();
                    if (_this.activated === true) {
                        _this.deactivate();
                        _this.parent.parent.storage.values.listStatus.open = false;
                    } else {
                        _this.activate();
                        _this.parent.parent.storage.values.listStatus.open = true;
                    }
                    _this.parent.parent.storage.save();
                },
                mouseover : function chatListHeaderEnter(ev) {
                    _this.$header.addClass('hover');
                },
                mouseout : function chatListHeaderOut(ev) {
                    _this.$header.removeClass('hover');
                }
            });

            this.$createNewChatBtn.bind({
                click : function newChatCLick(ev) {
                    ev.stopPropagation();

                    if (_this.parent.verifyDisclosure()) {
                        if (_this.activated === false) {
                            _this.activate();
                        }
                        _this.createChatRoomForm.toggle();
                    }
                },
                mouseover : function newChatEnter(ev) {
                    ev.stopPropagation();
                },
                mouseout : function newChatOut(ev) {
                    ev.stopPropagation();
                }
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

        createNewChat : function createNewChat(data, is_invite) {
            var _this   = this,
                is_host = data.user.id === Ahwaa.Model.User.id,
                is_mod  = is_host || Ahwaa.Model.User.is_mod;

            var listItem = $('<li class="new"/>').attr({
                'data-id'   : data.id,
                'data-title': data.name,
                'data-is-moderator' : is_mod,
                'data-host-id'      : data.user.id,
                'data-is-host'      : is_host
            }).append('\
                <div class="title">' + data.name + '</div>\
                <div class="info">\
                    <div class="info__user-count">\
                        <i class="chat-icon chat-icon--user with-counter" data-count="0"></i>\
                    </div>\
                </div>\
                ');

            if (is_invite === true) {
                listItem.find('.info').prepend('\
                    <div class="info__invitation">\
                        <i data-invitation-id="' + data.id + '"\
                            class="chat-icon chat-icon--invitation-list effekt-tooltip unread"\
                            data-tooltip-text="You were invited by ' + data.user.name + '" data-position="top"></i>\
                    </div>');

                this.activityUpdate('+');
            }

            if (data.is_private === true) {
                listItem.find('.title').append('<span class="room-chat-list__list--label"> [Private]</span>');
            }

            if (is_mod) {
                listItem.find('.info').prepend('\
                    <div class="chat__admin-actions">\
                        <i class="chat__admin-actions--toggler chat-icon chat-icon--settings-list effekt-tooltip" data-tooltip-text="Admin Actions" data-position="top"></i>\
                        <div class="dropdown">\
                            <ul>\
                                <li class="admin-shut-down" data-room-id="' + data.id + '">Shutdown Room</li>\
                            </ul>\
                        </div>\
                    </div>');
            }

            if (is_host) {
                listItem.find('.info .admin-shut-down').after('<li class="admin-invite-users">Invite Users</li>');
            }

            this.$list[0].scrollTop = 0;
            this.$list.prepend(listItem);

            listItem.one('mouseover.notice', function() {
                listItem.removeClass('new');
            });

            this.collection.push(
                new Ahwaa.UI.ChatRoom({
                    id              : data.id,
                    name            : data.name.toString().toLowerCase().replace(/\s/g, '_'),
                    label           : data.name,
                    listRef         : $(listItem),
                    chatList        : _this,
                    is_mod          : is_mod,
                    is_host         : is_host,
                    host_id         : data.user.id,
                    is_permanent    : false,
                    is_private      : data.is_private
                })
            );

            if (is_host === true) {
                // auto join for the room creator
                Ahwaa.UI.ChatRoom.dispatch('join:room', this.collection[this.collection.length - 1]);
            }

            this.updateChatRoomsCounter();
        },

        showConnectionMessage : function showConnectionMessage() {
            this.$reconnecting.show();
        },
        hideConnectionMessage : function hideConnectionMessage() {
            this.$reconnecting.hide();
        },

        getUIRoomItems : function getUIRoomItems() {
            return this.$list.find('> li');
        }
    }
});
