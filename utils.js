var _ = require('lodash');

module.exports = {
    err: function(message) {
        return 'gulp-tfs: ' + message;
    },

    generateCommand: function(tfs, command) {
        return tfs + ' ' + command;
    },

    zipParams: function(params) {
        if (!params) { return ''; }

        var str = '';
        _.each(params, function(value, key) {
            if (str.length) { str += ' '; }

            if (value === key) {
                str += '/' + key.toLowerCase();
            } else {
                str += '/' + key.toLowerCase() + ':' + value.toLowerCase();
            }
        });

        return str;
    }
};