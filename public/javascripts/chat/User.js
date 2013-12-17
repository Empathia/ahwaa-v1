Class('User')({
    prototype : {
        init : function(config) {
            Object.keys(config).forEach(function (property) {
                this[property] = config[property];
            }, this);
        },
        reconnect : function(data) {
            console.log(data);
            debugger
        }
    }
});
