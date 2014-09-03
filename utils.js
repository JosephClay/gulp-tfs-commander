var _ = require('lodash'),
    gulpUtil = require('gulp-util'),

    stripNewLines = function(str) {
        str = str || '';

        return str.replace(/\r?\n|\r/g, '');
    };

module.exports = {
    log: function(message) {
        gulpUtil.log(stripNewLines(message));
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
    },

    stripNewLines: function(str) {
        str = str || '';

        return str.replace(/\r?\n|\r/g, '');
    }
};