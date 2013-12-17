Class(Ahwaa.UI, 'OverlayMessage').inherits(Ahwaa.UI.Widget)({

    html : '\
        <div class="chat__overlay-message">\
            <div class="chat__overlay-message--wrapper">\
                <div class="chat__overlay-message--inner"></div>\
            </div>\
        </div>\
        ',

    prototype : {
        init : function(attributes) {
            var _this = this;

            this.showLoader = false;
            this.title = null;
            this.message = null;

            Ahwaa.UI.Widget.prototype.init.apply(this, [attributes]);

            this.$inner = this.element.find('.chat__overlay-message--inner');

            if (this.showLoader) {
                this.$inner[0].innerHTML += '<span class="loader"><img src="/images/loading-s-white.gif"></span>';
            }

            if (this.title) {
                this.$inner[0].innerHTML += ['<p class="chat__overlay-message--title">', this.title, '</p>'].join("");
            }

            if (this.message) {
                this.$inner[0].innerHTML += '<p class="chat__overlay-message--message">' + this.message + '</p>';
            }
        }
    }
});
