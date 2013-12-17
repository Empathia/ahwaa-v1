Class('Toggler').includes(CustomEventSupport, NodeSupport)({

    prototype : {

        init : function(toggler, content) {
            this.$body      = $('body')
            this.$toggler   = toggler;
            this.$content   = content;
            this.bindings();
        },

        bindings : function bindings() {
            var _this = this;

            this.$toggler.bind({
                click: function(ev) {
                    ev.stopPropagation();

                    if (_this.$content.is(':visible')) {
                        _this.hide();
                        return false;
                    }

                    // force to hide all others opened togglers
                    _this.constructor.dispatch('hide');

                    _this.show();
                    return false;
                },
                mouseover : function togglerEnter(ev) {
                    ev.stopPropagation();
                },
                mouseout : function togglerOut(ev) {
                    ev.stopPropagation();
                }
            });

            Toggler.bind('hide', function() {
                _this.hide();
            });
        },

        show : function() {
            var _this = this;
            this.$content.show();
            this.$body.bind('click.closeToggler', function(ev) {
                _this.hide();
            });
        },

        hide : function() {
            this.$content.hide();
            this.$body.unbind('click.closeToggler');
        }
    }
});
