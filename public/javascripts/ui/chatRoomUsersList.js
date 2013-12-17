Class(Ahwaa.UI, 'ChatRoomUsersList').inherits(Ahwaa.UI.Widget).includes(ChatHelpers)({

    html: '\
        <div class="chat-widget__panel-users-list">\
            <header class="panel-users-list__header">\
                <i class="chat-icon chat-icon--user"></i>\
                <span class="panel-users-list-total">0</span> people chatting in the room\
                <button class="btn btn-clean panel-users-list--done">Done</button>\
            </header>\
            <div class="panel-users-list__list-wrapper">\
                <ul class="panel-users-list__list"></ul>\
            </div>\
        </div>\
    ',

    prototype : {

        users   : null,
        room_id : null,

        init : function init(attributes) {
            var _this = this;
            Ahwaa.UI.Widget.prototype.init.apply(this, [attributes]);
            this.$list  = this.element.find('.panel-users-list__list');
            this.$total = this.element.find('.panel-users-list-total');
            this.$done  = this.element.find('.panel-users-list--done');

            this.bindings();
        },

        bindings : function bindings() {
            var _this = this;
            this.$done.bind('click', function() {
                _this.hide();
            });
        },

        update : function update(data) {
            // Object {id: 21, name: "noel6", avatar: "/images/avatars/12-16_M_B_H4_F4.png", level: "silver-heart"}
            var _this = this;
            this.users = data;

            if (!data) {
                this.$total.text("0");
                this.$list.empty();
                return this;
            }

            var total   = data.length,
                frag    = document.createDocumentFragment(),
                i;

            this.$list.find('.chat-icon--user-block').unbind('click');
            this.$list.empty();

            for (i = 0; i < total; i += 1) {
                var row = document.createElement('li');
                row.className = "panel-users-list__item small-avatars";
                row.innerHTML = '\
                    <div class="chat--avatar avatar ' + data[i].level + '">\
                        <img src="' + data[i].avatar + '">\
                        <span></span>\
                    </div>\
                    <div class="info-wrapper">\
                        <div class="username">' + data[i].name + '</div>\
                    </div>\
                    ';

                if (
                    (this.isHostOf(Ahwaa.Model.User.id, this.room_id) || Ahwaa.Model.User.is_mod === true) &&
                    (data[i].name !== Ahwaa.Model.User.name) &&
                    (data[i].is_mod === false)
                ) {
                    var parent = row.querySelector('.info-wrapper');
                        block_wrapper   = document.createElement('div'),
                        block_anchor    = document.createElement('a'),
                        block_icon      = document.createElement('i');

                    block_wrapper.className = "block-user-wrapper";
                    block_anchor.setAttribute('data-userdata', JSON.stringify(data[i]));
                    block_icon.className = "chat-icon chat-icon--user-block";

                    block_anchor.appendChild(block_icon);
                    block_anchor.innerHTML += 'Block from room';
                    block_wrapper.appendChild(block_anchor);

                    parent.appendChild(block_wrapper);
                    block_icon = block_anchor = block_wrapper = parent = null;
                }

                frag.appendChild(row);
                row = null;
            }

            this.$list.append(frag);
            this.$total.text(total);

            this.$list.find('.block-user-wrapper a').bind('click', function blockUser(ev) {
                var user = JSON.parse(this.getAttribute('data-userdata'));
                console.log('%c' + Ahwaa.Model.User.name + 'wants to block ' + user.name, 'color: #09c; font-weight: bold');
                Ahwaa.UI.ChatRoom.dispatch('block:user', {
                    roomid  : _this.room_id,
                    userdata: user
                });
                user = null;
            });

            frag = null;
            return this;
        },
    },

    show : function show() {
        Ahwaa.UI.Widget.prototype.show.call(this);
        this.activate();
    },

    hide : function hide() {
        Ahwaa.UI.Widget.prototype.hide.call(this);
        this.deactivate();
    }
});
