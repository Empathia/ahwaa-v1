Class('Reply').inherits(Remote)({
    table_name: 'replies',
    remote: {
        create: '/topics/:topic_id/replies.json',
        update: '/topics/:topic_id/replies/:id.json'
    }
});
