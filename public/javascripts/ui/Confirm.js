Class(Ahwaa.UI, 'Confirm').inherits(Ahwaa.UI.Widget)({

    html : '\
        <div class="ahwaa-modal">\
            <div class="ahwaa-modal__background"></div>\
            <div class="ahwaa-modal__wrapper">\
                <div class="ahwaa-modal__header">\
                    <p class="ahwaa-modal--title">Modal Title</p>\
                </div>\
                <div class="ahwaa-modal__body">\
                    <div class="message"></div>\
                    <div class="ahwaa-modal__buttons">\
                        <button class="btn btn-info cancel-button">Cancel</button>\
                        <button class="btn btn-ok ok-button">OK</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
        ',

    prototype : {

        title : "Modal Title",
        message : "",
        showCloseButton : true,
        cancelButton : {
            text : 'Cancel',
            callback : null
        },
        okButton : {
            text : 'OK',
            callback : null
        },

        init : function(attributes) {
            var _this = this;
            Ahwaa.UI.Widget.prototype.init.apply(this, [attributes]);

            this.$bg        = this.element.find('.ahwaa-modal__background');
            this.$title     = this.element.find('.ahwaa-modal--title');
            this.$message   = this.element.find('.ahwaa-modal__body .message');
            this.$cancel    = this.element.find('.cancel-button');
            this.$ok        = this.element.find('.ok-button');

            this.$title.text(this.title);
            this.$message.html(this.message);
            this.$cancel.text(this.cancelButton.text);
            this.$ok.text(this.okButton.text);

            if (this.showCloseButton) {
                this.$close = $('<button class="ahwaa-modal--close">&times;</button>');
                this.$title.after(this.$close);

            }

            this.bindings();
        },

        bindings : function bindings() {
            var _this = this;
            this.$bg.bind('click', function() {
                _this.destroy();
            });
            if (this.$close) {
                this.$close.bind('click', function() {
                    _this.destroy();
                });
            }
            this.$cancel.bind('click', function() {
                if (typeof _this.cancelButton.callback === 'function') {
                    _this.cancelButton.callback();
                }
                _this.destroy();
            });
            this.$ok.bind('click', function() {
                _this.okButton.callback();
                _this.destroy();
            });
        },

        destroy : function destroy() {
            this.$bg.unbind('click');
            this.$cancel.unbind('click');
            this.$ok.unbind('click');
            if (this.$close) this.$close.unbind('click');
            Ahwaa.UI.Widget.prototype.destroy.call(this);
        }
    }
});
