Class(Ahwaa.UI, 'CreateChatRoomForm').inherits(Ahwaa.UI.Widget)({
    html: '\
        <div id="create-new-chatroom-form" class="form-wrapper">\
            <form class="">\
                <h3>Create a Room</h3>\
                <label class="input-text-wrapper">\
                    <p class="label-text">Give your room a name!</p>\
                    <input name="chat_room[label]" type="text" class="text-input-styled">\
                </label>\
                <label class="input-text-wrapper">\
                    <p class="label-text">Invite people to the room!</p>\
                    <input id="invites-input"name="chat_room[invites]" type="text">\
                </label>\
                <label class="input-checkbox-wrapper">\
                    <input name="chat_room[private]" type="checkbox" value="true">\
                    <p class="label-text">Make the room private</p>\
                </label>\
                <div class="disclaimer">\
                    <label class="input-checkbox-wrapper">\
                        <input type="checkbox" name="disclaimer-accept">\
                        <p class="label-text">I agree not to ask for nor disclose any personal information while I participate in this room.</p>\
                    </label>\
                </div>\
                <div class="actions_holder">\
                    <button type="submit" class="btn btn-info">Create!</button>\
                    <a href="#" class="create-new-chat__cancel-btn">Cancel</a>\
                </div>\
            </form>\
      </div>\
    ',
    prototype : {

        init : function init(attributes) {
            Ahwaa.UI.Widget.prototype.init.apply(this, [attributes]);
            var _this = this;

            this.$form      = this.element.find('form');
            this.$input     = this.element.find('input[name="chat_room[label]"]');
            this.$invites   = this.element.find('#invites-input');
            this.$checkbox  = this.element.find('input[name="chat_room[private]"]');
            this.$disclaimer= this.element.find('.disclaimer');
            this.$terms     = this.element.find('input[name="disclaimer-accept"]');
            this.$button    = this.element.find('button[type="submit"]');
            this.$cancel    = this.element.find('.create-new-chat__cancel-btn');

            this.appendChild(
                new Ahwaa.UI.OverlayMessage({
                    name        : 'sending',
                    showLoader  : true,
                    title       : "Hold on",
                    message     : "We're creating your room"
                })
            ).render(this.element);

            var tokenInputUL, $tokenInputUL, $tokeninput;
            this.$invites.tokenInput("/users/user_search.json", {
                theme               : "ahwaa",
                hintText            : "Type a username to search",
                animateDropdown     : false,
                preventDuplicates   : true,
                resultsFormatter    : function(item) {
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
                    tokenInputUL    = _this.$invites.parent().find('ul')[0];
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

        bindings: function bindings() {
            var _this = this;

            this.$cancel.bind('click', function(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                _this.hide();
                _this.resetForm();
            });

            this.$button.bind('click', function(ev) {
                ev.preventDefault();
                if (_this.validate()) {
                    _this.send();
                }
            });
        },

        validate : function validate() {
            this.$input.removeClass('error');
            this.$disclaimer.removeClass('error');

            if (this.$input.val().trim() === '') {
                this.$input.addClass('error');
                return false;
            }

            if (this.$terms[0].checked === false) {
                this.$disclaimer.addClass('error');
                return false;
            }

            return true;
        },

        send : function send() {
            var _this = this;
            this.sending.show();

            $.ajax({
                url     : "/chat_rooms",
                type    : "POST",
                data    : _this.$form.serialize(),
                success : function(data) {
                    var name        = _this.$input.val(),
                        is_private  = _this.$checkbox[0].checked;

                    _this.constructor.dispatch('new:room', {
                        id              : data.chat_room.id,
                        name            : name,
                        label           : data.chat_room.label,
                        is_private      : is_private,
                        user            : Ahwaa.Model.User,
                        invited_users   : _this.$invites.tokenInput('get')
                    });

                    _this.hide();
                    _this.sending.hide();
                    _this.resetForm();
                },
                error: function(data) {
                    console.log('%cCreate New Chat Room Form Error', 'color: #f00; font-weight:bold', data);
                }
            });
        },

        show : function show() {
            this.element.slideDown(200);
        },

        hide : function hide() {
            this.element.slideUp(200);
        },

        toggle : function toggle() {
            this.element.slideToggle(200);
        },

        resetForm : function resetForm() {
            this.$input.val("");
            this.$invites.tokenInput("clear");
            this.$checkbox[0].checked = false;
            this.$terms[0].checked = false;
        }
    }
});
