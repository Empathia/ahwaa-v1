Class('Reply').inherits(Remote)({
    remote: {
        create: '/topics/:topic_id/replies.js',
        flag: '/topics/:topic_id/replies/:id/flag.json',
        vote_up: '/topics/:topic_id/replies/:id/vote_up.json'
    },
    
    prototype: {
        flag: function (args) {
            this.remote_call('flag', {
                onSuccess: args.success,
                onError: args.error
            });
        },

        vote_up: function (args) {
            this.remote_call('vote_up', {
                onSuccess: args.success,
                onError: args.error
            });
        }
    }
});
