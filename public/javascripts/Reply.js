Class('Reply').inherits(Remote)({
    remote: {
        create: '/topics/:topic_id/replies.js',
    }
});
