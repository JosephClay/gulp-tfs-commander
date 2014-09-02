var _ = require('lodash'),
	fs = require('fs'),
	through = require('through2'),
	gulpUtil = require('gulp-util'),
	exec = require('child_process').exec,

	throwError = function(message) {
		throw new gulpUtil.PluginError('gulp-tfs', message);
	},

	VALID_COMMANDS = ['edit', 'lock'],
	PLATFORM_BLACKLIST = ['win32'],

	defaults = {
		tfs: 'tf',
		command: 'edit'
	},

	commandLine = function(tfs, command) {
		return tfs + ' ' + command;
	};

var gulpTfs = module.exports = function(opts) {
	opts = setOptions(opts);

	return through.obj(function(file, encoding, callback) {
		var self = this;
		checkForTFS(function(result) {

			if (!result) {
				gulpUtil.log('TF command is not found.');
				self.push(file);
				return callback();
			}

			if (!fs.existsSync(file.path)) {
				return throwError('File does not exist');
			}

			if (PLATFORM_BLACKLIST.indexOf(process.platform) !== -1) {
				return throwError('This plugin can only be used on a Windows system with Visual Studio installed');
			}

			var command = commandLine(opts.tfs, opts.command + ' "' + file.path + '"');
			return exec(command, function(err, stdout, stderr) {
				processExecResults(err, stdout, stderr);
				gulpUtil.log('TF result: command ' + opts.command + ' on file ' + gulpUtil.colors.cyan(stdout));
				self.push(file);
				callback();
			});
		});
	});
};

var setDefauls = function(opts) {
	_.extend(defaults, opts);
	return gulpTfs;
};

var setOptions = function(opts) {
	opts = _.extend({}, defaults, opts);

	if (VALID_COMMANDS.indexOf(opts.command) < 0) {
		return throwError('The only commands currently implemented are: ' + VALID_COMMANDS.join(','));
	}

	return opts;
};

var processExecResults = function(err, stdout, stderr) {
	if (stderr) {
		gulpUtil.log('TF command error: ' + gulpUtil.colors.cyan(stderr) + ' -- ' + gulpUtil.colors.red(stderr));
		return stderr;
	}

	if (err) {
		gulpUtil.log('TF command caution: ' + gulpUtil.colors.cyan(stdout) + ' -- ' + gulpUtil.colors.yellow(err));
		return err;
	}

	return stdout;
};

var checkForTFS = function(opts, done) {
	exec(commandLine(opts.tfs, 'bob'), function(err, stdout, stderr) {
		// not a tf command, but validates that tf throws the right error
		// this ensures that the tf command is available
		if (stderr === 'Unrecognized command: bob.\r\n') {
			return done(true);
		}

		return throwError('TF command is not available. Make sure Visual Studio is installed and its install directory is in your %PATH%');
	});
};

gulpTfs.checkForTFS = checkForTFS;
gulpTfs.processExecResults = processExecResults;
gulpTfs.config = setDefaults;

