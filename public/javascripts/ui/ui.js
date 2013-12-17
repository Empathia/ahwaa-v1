window.Ahwaa = {
    UI: {},
    Model: {},
    Collection : {
        Rooms : {},
        Users : {}
    },
    utils : {
        pluralize: function(total, options) {
            var result = options.split(/\//);
            return (total <= 1) ? result[0] : result[1];
        }
    }
};
