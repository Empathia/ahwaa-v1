Class(Ahwaa.UI, 'ChatRoomsInviteForm').inherits(Ahwaa.UI.Widget)({
    html : '\
        <div class="panel-invite-room">\
            <p class="panel-invite-room__label"></p>\
            <form>\
                <input type="hidden" name="room_id">\
                <input type="text" class="panel-invite-room__input" name="invites">\
                <button type="submit" class="panel-invite-room__submit btn btn-clean">Done!</button>\
            </form>\
        </div>\
    ',
    prototype : {

        room_id: null,
        room_name: null,

        init : function init(attributes) {
            Ahwaa.UI.Widget.prototype.init.apply(this, [attributes]);
            var _this = this;

            this.$label = this.element.find('.panel-invite-room__label');
            this.$form  = this.element.find('form');
            this.$input = this.element.find('.panel-invite-room__input');
            this.$hidden = this.element.find('[type="hidden"]');
            this.$submit = this.element.find('[type="submit"]');

            this.$hidden.val(this.room_id);

            var tokenInputUL, $tokenInputUL, $tokeninput;
            this.$input.tokenInput("/users/user_search.json", {
                theme : "ahwaa",
                hintText: "Type a username to search",
                animateDropdown  : false,
                preventDuplicates: true,
                resultsFormatter : function(item) {
                    return '\
                        <li class="small-avatars search__results-row">\
                            <div class="chat--avatar avatar ' + item.level + '">\
                                <img src="' + item.avatar + '"/>\
                                <span></span>\
                            </div>\
                            <div class="results-text-wrapper">\
                                <p class="username">' + item.username + '</p>\
                            </div>\
                        </li>';
                },
                onReady : function() {
                    tokenInputUL    = _this.$input.parent().find('ul')[0];
                    $tokenInputUL   = $(tokenInputUL);
                    $tokeninput     = $tokenInputUL.find('input');

                    $tokeninput.bind({
                        focus: function() {
                            $tokenInputUL.addClass('focus');
                        },
                        blur: function() {
                            $tokenInputUL.removeClass('focus');
                        }
                    });
                }
            });

            this.bindings();
        },

        bindings : function bindings() {
            var _this = this;
            this.$submit.bind('click', function(ev) {
                ev.preventDefault();
                if (_this.validate()) {
                    _this.send();
                } else {
                    _this.hide();
                }
            });

            $(window).resize(function() {
                _this.hideSearchResults();
            });
            $(window).scroll(function() {
                _this.hideSearchResults();
            });
        },

        hideSearchResults : function() {
            $.each($('.token-input-input-token-ahwaa input'), function(k,v) {
                $(v).blur();
            });
        },

        validate : function validate() {
            if (this.$input.tokenInput('get').length <= 0) return false;
            return true;
        },

        updateId : function updateId(id) {
            this.$hidden.val(id);
            this.room_id = id;
            return this;
        },

        updateLabel : function updateLabel(text, name) {
            this.$label.html(text);
            this.room_name = name;
            return this;
        },

        send: function send() {
            var _this = this;

            $.ajax({
                url     : "/chat_rooms/create_invite",
                type    : "post",
                data    : _this.$form.serialize(),
                success : function(data) {
                    _this.constructor.dispatch('room:invite', {
                        id          : parseInt(_this.room_id, 10),
                        name        : _this.room_name,
                        label       : _this.room_name,
                        is_private  : data.is_private,
                        users       : _this.$input.tokenInput('get'),
                        user        : Ahwaa.Model.User
                    });

                    _this.hide();
                    _this.$input.val("");
                    _this.$input.tokenInput("clear");
                },
                error: function() {}
            });
        }
    }
});
