Module('NodeSupport')({
    prototype: {

        appendChild: function (child) {
            if (!this.children) {
                this.children = [];
            }
            this.children.push(child);
            child.setParent(this);
            if (child.name) {
                this[child.name] = child;
            }
            return child;
        },

        removeChild: function (child) {
            if (!this.children) {
                this.children = [];
            }
            var i, childrenLength = this.children.length;
            for (i = 0; i < childrenLength; i++) {
                if (this.children[i] === child) {
                    child.setParent(null);
                    if (child.name) {
                        delete this[child.name];
                    }
                    this.children.splice(i, 1);
                    break;
                }
            }
            return this;
        },

        setParent: function (parent) {
            this.parent = parent;
            return this;
        }
    }
});
