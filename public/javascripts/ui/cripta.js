/*
 * https://github.com/noeldelgado/Cripta.js
 */

Class('Cripta')({

    prototype : {

        init : function(key, options) {
            this.name   = key;
            this.type   = sessionStorage;

            for (var i in options) {
                if (options.hasOwnProperty(i)) this[i] = options[i];
            }

            this.values = this.get() || options.values || {};
            this.is_array_based = this.values instanceof Array;

            return this;
        },

        add : function add(key, value) {
            if (this.is_array_based) {
                if (arguments.length > 1 || arguments.length === 0) {
                    console.error("Your base is an Array. You should pass one argument.");
                    return this;
                }
                this.values.push(key);
                return this;
            }

            if (arguments.length !== 2) {
                console.error("Your base is an Object. You should pass a key/value pair to this method.");
                return this;
            }

            if (this.values[key] instanceof Array) {
                this.values[key].push(value);
                return this;
            }

            this.values[key] = value;

            return this;
        },

        get : function get() {
            return JSON.parse(this.type.getItem(this.name));
        },

        remove : function remove(key, value) {
            if (value === undefined) {
                this.type.removeItem(this.name);
                this.values = (this.is_array_based) ? [] : {};
                return this;
            }

            if (this.is_array_based) {
                this.values.splice(this.values.indexOf(value), 1);
                return this;
            }

            this.values[key].splice(this.values[key].indexOf(value), 1);
            // delete this.values[value];

            return this;
        },

        empty : function empty() {
            this.type.clear();
            this.values = (this.is_array_based) ? [] : {};
        },

        find : function find(key, value, callback) {
            var keys, props, length, results, i;
            if (key.indexOf('.')) {
                keys    = key.split('.');
                props   = keys.slice(1, keys.length);
                key     = keys[0];
            }
            length = props.length ? this.values[key].length : this.values.length;

            if (props.length) {
                for (i = 0; i < length; i++) {
                    if (this.values[key][i][props] === value) {
                        results = this.values[key][i];
                        break;
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (this.values[i][key] === value) {
                        results = this.values[i];
                        break;
                    }
                }
            }

            if (callback) {
                callback.call(this, results);
                return this;
            }

            return results;
        },

        rewrite : function rewrite(value) {
            this.values = value;
            this.is_array_based = this.values instanceof Array;

            return this;
        },

        save : function save() {
            this.type.setItem(this.name, JSON.stringify(this.values));

            return this;
        }
    }
});
