Class('PrivateMessage').inherits(Remote)({
    remote: {
        create: '/users/:user_id/private_messages.json'
    }
});
