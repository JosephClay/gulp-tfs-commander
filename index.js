var _ = require('lodash'),
	fs = require('fs'),
	utils = require('./utils'),
	through = require('through2'),
	gulpUtil = require('gulp-util'),
	PluginError = gulpUtil.PluginError,
	exec = require('child_process').exec,

	defaults = {
		tfs: 'tf',
		command: 'edit'
	};

var gulpTfs = module.exports = function(opts) {
	opts = _.extend({}, defaults, opts);

	return through.obj(function(file, encoding, callback) {
		var self = this;
		checkForTFS(opts, function(result) {

			if (!result) {
				gulpUtil.log('TFS command is not found.');
				self.push(file);
				return callback();
			}

			if (!fs.existsSync(file.path)) {
				throw new PluginError(utils.err('File does not exist'));
			}

			var command = utils.generateCommand(opts.tfs, opts.command + ' "' + file.path + '" ' + utils.zipParams(opts.params));
			return exec(command, function(err, stdout, stderr) {
				processExecResults(err, stdout, stderr);
				gulpUtil.log('TFS result: command ' + opts.command + ' on file ' + gulpUtil.colors.cyan(stdout));
				self.push(file);
				callback();
			});
		});
	});
};

var processExecResults = function(err, stdout, stderr) {
	if (stderr) {
		gulpUtil.log('TFS command error: ' + gulpUtil.colors.cyan(stderr) + ' -- ' + gulpUtil.colors.red(stderr));
		return stderr;
	}

	if (err) {
		gulpUtil.log('TFS command caution: ' + gulpUtil.colors.cyan(stdout) + ' -- ' + gulpUtil.colors.yellow(err));
		return err;
	}

	return stdout;
};

var checkForTFS = function(opts, done) {
	var command = utils.generateCommand(opts.tfs, 'bob');
	exec(command, function(err, stdout, stderr) {
		// not a tf command, but validates that tf throws the right error
		// this ensures that the tf command is available
		if (stderr === 'Unrecognized command: bob.\r\n') {
			return done(true);
		}

		throw new PluginError(utils.err('TF command is not available. Make sure Visual Studio is installed and its install directory is in your %PATH%'));
	});
};

_.extend(gulpTfs, {
	checkForTFS: checkForTFS,
	config: function(opts) {
		_.extend(defaults, opts);
		return gulpTfs;
	}
});

