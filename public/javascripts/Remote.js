Class('Remote')({
    remote: {
        create: '/create.json',
        update: '/update.json',
        destroy: '/destroy.json'
    },
    url_for: function(url, attrs) {
        attrs = attrs || {};
        return url.replace(/:\w+/g, function(match) {
            var m = match.substring(1);
            if(attrs[m] !== undefined) {
                return attrs[m];
            } else {
                return match;
            }
        });
    },
    prototype: {
        init: function(attrs) {
            this.attributes = {id: null};
            $.extend(this.attributes, attrs || {});
            $.extend(this, this.attributes);
        },
        new_record: function() {
            return this.id === null;
        },
        save: function() {
            var data = {}, attrs = {},
                action = this.new_record() ? 'create' : 'update';
            for(var attr in this.attributes) {
                if(this.attributes.hasOwnProperty(attr) && this.attributes[attr] !== null) {
                    attrs[attr] = this.attributes[attr];
                }
            }
            data[this.constructor.className.toLowerCase()] = attrs;
            this.remote_call(action, {
                type: this.new_record() ? 'post' : 'put',
                data: data,
                async: false
            });
            return this.valid;
        },
        update_attributes: function(attrs) {
            $.extend(this.attributes, attrs || {});
            return this.save();
        },
        remote_call: function (name, args) {
            var url = this.constructor.url_for(this.constructor.remote[name], this.attributes);
            args = $.extend({
                type: 'post',
                 url: url,
                 context: this,
                 dataType: 'json'
            }, args);
            args.success = function (response) {
                $.extend(this.attributes, response[this.constructor.className.toLowerCase()]);
                $.extend(this, this.attributes);
                this.valid = true;
                $.isFunction(args.onSuccess) && args.onSuccess(this);
            };
            args.error = function (response) {
                this.errors = eval('(' + response.responseText + ')');
                this.valid = false;
                $.isFunction(args.onError) && args.onError(this);
            };
            return $.ajax(args);
        }
    }
});

