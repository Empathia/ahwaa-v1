Class('Reply').inherits(Remote)({
    remote: {
        create: '/topics/:topic_id/replies.json',
        update: '/topics/:topic_id/replies/:id.json',
        flag: '/topics/:topic_id/replies/:id/flag.json'
    },
    
    prototype: {
        flag: function (args) {
            var url = this.constructor.url_for(this.constructor.remote.flag, this.attributes);
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                context: this,
                success: function (response) {
                    $.extend(this.attributes, response[this.constructor.className.toLowerCase()]);
                    $.extend(this, this.attributes);
                    this.valid = true;
                    $.isFunction(args.success) && args.success(this);
                },
                error: function (response) {
                    this.errors = eval('(' + response.responseText + ')');
                    this.valid = false;
                    $.isFunction(args.error) && args.error(this);
                }
            });
        }
    }
});
