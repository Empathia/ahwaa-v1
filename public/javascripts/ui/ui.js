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
        },
        is_touch_device: function() {
            return 'ontouchstart' in window || 'onmsgesturechange' in window;
        }
    }
};
