Class('Reply').inherits(Remote)({
    remote: {
        create: '/topics/:topic_id/replies.json',
        update: '/topics/:topic_id/replies/:id.json'
    }
});
