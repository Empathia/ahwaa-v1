Class(Ahwaa.UI, 'Widget').includes(CustomEventSupport, NodeSupport)({
    elementClass: 'widget',
    html: '\
        <div></div>\
    ',
    activeClass : 'active',
    inViewClass : 'visible',

    activated : false,

    prototype: {
        elementId: null,
        cssClass: null,

        init: function (attributes) {
            this.children = [];
            $.extend(this, attributes);
            if (!this.element) {
                this.element = $(this.constructor.html);
                this.element.addClass(this.constructor.elementClass);
                if (this.elementId) {
                    this.element.attr('id', this.elementId);
                }
                if (this.cssClass) {
                    this.element.addClass(this.cssClass);
                }
            }
        },

        activate : function activate() {
            this.element.addClass(this.constructor.activeClass);
            this.activated = true;
            return this;
        },

        deactivate : function deactivate() {
            this.element.removeClass(this.constructor.activeClass);
            this.activated = false;
            return this;
        },

        inView : function activate() {
            this.element.addClass(this.constructor.inViewClass);
            return this;
        },

        outView : function deactivate() {
            this.element.removeClass(this.constructor.inViewClass);
            return this;
        },

        hide: function hide() {
            this.element.hide();
            return this;
        },

        show: function show() {
            this.element.show();
            return this;
        },

        isVisible: function isVisible() {
            return this.element.is(':visible');
        },

        render: function render(container, before) {
            if (before) {
                container.prepend(this.element);
            } else {
                container.append(this.element);
            }
            return this;
        },

        destroy: function destroy() {
            var _this = this;

            if (this.children) {
                var i, childrenLength = this.children.length, child;

                for (i = 0; i < childrenLength; i++) {
                    child = this.children[i];
                    child.setParent(null);
                    if (child.name) {
                        delete this[child.name];
                    }
                    child.destroy();
                }
            }
            this.children = [];

            if (this.parent) this.parent.removeChild(this);
            this.element.remove();
            this.element = null;
        }
    }
});
