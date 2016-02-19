'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var through = require('through2');
var fs = require('fs');
var map = require('map-stream');

var path = require("path");

module.exports = function(options) {
	if (!options.foo) {
		throw new gutil.PluginError('gulp-move-snippet', '`foo` required');
	}


	return through.obj(function(file, enc, cb) {
		// console.log(file);
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-move-snippet', 'Streaming not supported'));
			return;
		}

		try {
			file.contents = new Buffer(String(file.contents).replace(/API/, 'SOAP'));
			var content = String(file.contents);
			_get_snippets(content);
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-move-snippet', err));
		}

		cb();
	});
};


var _get_snippets = function(content) {
	var snippets = content.match(/\/\/##shift(.?)(([A-Za-z0-9]+)?)\s([a-z.\/]+)([.\n\s]+)([.\n\s]+)([a-zA-Z0-9.,:\s`#]+)([.\n\s]+)(\/\/##endshift)/g);
	var snippet = [];
	for (var i = 0; i < snippets.length; i++) {
		var sni = _format_snippet(snippets[i]);
		_shift_snippet(sni.name, sni.body, sni.file);
		snippet.push(sni);
	}
	return snippet;
}

var _format_snippet = function(snippet) {
	snippet = snippet.split(/\n\r|\n|\r/);
	var snippetbody = '';
	for (var i = 1; i < snippet.length - 1; i++) {
		snippetbody = snippetbody + snippet[i]
	}
	return {
		header: snippet[0],
		footer: snippet[snippet.length - 1],
		body: snippetbody,
		name: snippet[0].replace(/\/\/##shift:([a-zA-Z0-9]+)\s([a-zA-z0-9.:`#\//-]+)/, '$1'),
		file: snippet[0].replace(/\/\/##shift:([a-zA-Z0-9]+)\s([a-zA-z0-9.:`#\//-]+)/, '$2'),
		source: gulp.src(snippet[0].replace(/\/\/##shift:([a-zA-Z0-9]+)\s([a-zA-z0-9.:`#\//-]+)/, '$2'))
	};
}

var _shift_snippet = function(name, snippet, file) {

	return gulp.src(file, {
			base: './'
		})
		.pipe(map(function(file, cb) {
			var contents = file.contents.toString('utf8');
			var position = contents;
			var ori = contents;
			ori = ori.replace(/\/\/##shifthere:([a-z0-9A-Z]+):([a-zA-Z0-9]+)/, "//##shifthere:$1:$2");

			var oriReg = /\/\/##shifthere:([a-z0-9A-Z]+):([a-zA-Z0-9]+)/;
			var oriMatch = oriReg.exec(ori);

			var myRegexp = /\/\/##shifthere:([a-z0-9A-Z]+):([a-zA-Z0-9]+)/;
			var match = myRegexp.exec(position);

			if (match[2] == 'after' && match[1] == name)
				contents = contents.replace(/\/\/##shifthere:([a-z0-9A-Z]+):([a-zA-Z0-9]+)/, oriMatch[0] + '\n' + snippet);
			else if (match[1] == name)
				contents = contents.replace(/\/\/##shifthere:([a-z0-9A-Z]+):([a-zA-Z0-9]+)/, snippet + '\n' + oriMatch[0]);

			console.log(contents);
			file.contents = new Buffer(contents, 'utf8');
			cb(null, file);
		})).pipe(gulp.dest(path.dirname(file)));

};