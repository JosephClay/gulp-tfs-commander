var _ = require('lodash'),
	path = require('path'),
	fs = require('fs'),
	utils = require('./utils'),
	through = require('through2'),
	gulpUtil = require('gulp-util'),
	PluginError = gulpUtil.PluginError,
	exec = require('child_process').exec,

	PLUGIN_NAME = 'gulp-tfs-commander',

	defaults = {
		tfs: 'tf',
		command: 'edit',
		debug: false
	};

var gulpTfs = module.exports = function(opts) {
	opts = _.extend({}, defaults, opts);

	return through.obj(function(file, encoding, callback) {
		var self = this;

		if (!fs.existsSync(file.path)) {
			this.push(f);
			return callback();
		}

		var command = utils.generateCommand(opts.tfs, opts.command + ' "' + file.path + '" ' + utils.zipParams(opts.params));
		return exec(command, function(err, stdout, stderr) {
			if (opts.debug) {
				processExecResults(err, stdout, stderr);
				utils.log('TFS result: command ' + opts.command + ' on file ' + gulpUtil.colors.cyan(stdout));
			}
			self.push(file);
			callback();
		});
	});
};

var direct = function(opts, file) {
	opts = _.extend({}, defaults, opts);

	return through.obj(function(f, encoding, callback) {
		var self = this;

		if (!fs.existsSync(file)) {
			this.push(f);
			return callback();
		}

		var command = utils.generateCommand(opts.tfs, opts.command + ' "' + file + '" ' + utils.zipParams(opts.params));
		return exec(command, function(err, stdout, stderr) {
			if (opts.debug) {
				processExecResults(err, stdout, stderr);
				utils.log('TFS result: command ' + opts.command + ' on file ' + gulpUtil.colors.cyan(stdout));
			}
			self.push(f);
			callback();
		});
	});
};

var processExecResults = function(err, stdout, stderr) {
	if (stderr) {
		utils.log('TFS command error: ' + gulpUtil.colors.cyan(stderr) + ' -- ' + gulpUtil.colors.red(stderr));
		return stderr;
	}

	if (err) {
		utils.log('TFS command caution: ' + gulpUtil.colors.cyan(stdout) + ' -- ' + gulpUtil.colors.yellow(err));
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
			return done();
		}

		throw new PluginError(PLUGIN_NAME, 'TF command is not available. Make sure Visual Studio is installed and its install directory is in your %PATH%');
	});
};

_.extend(gulpTfs, {
	checkForTFS: checkForTFS,
	direct: direct,
	config: function(opts) {
		_.extend(defaults, opts);
		return gulpTfs;
	}
});

