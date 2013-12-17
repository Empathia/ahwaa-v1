Module('ChatHelpers')({
    prototype: {
        isHostOf: function isHostOf(userID, roomID){
            var is_host = false;
            is_host = Ahwaa.Collection.Rooms.some(function(chat) {
                return  chat.id === roomID && chat.host_id === userID;
            });
            return is_host;
        }
    }
})
