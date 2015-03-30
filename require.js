(function(obj) {
	'use strict';

	var _loaded = {};
	var _modules = {};
	var _options = {
		path: '',        //the default path for JS files
		extension: 'js'  //sets the extension of JS files
	};

	obj.define = define;

	/**
	 * Defines a module by name and possible dependencies.
	 * @param {string} name - Name of the module
	 * @param {Array}  dependencies - Array of dependencies: OPTIONAL
	 * @param {function} callback - The function to execute on module load
	 */
	function define(/*name, optional dependencies, callback */) {
		var args = _verify(arguments);
		_modules[args.name] = {};
		_modules[args.name].deps = args.deps;
		_modules[args.name].callback = args.callback;
		_modules[args.name].done = false;

		for (var d in args.deps) {
			_load(args.name, args.deps[d]);
		}
		_execute();
	}

	/** 
	 * Set a few options for `define`. 
	 * @param {object} options - Object containing different options
	 */
	define.options = function(options) {
		for(var o in _options) {
			_options[o] = options[o] || _options[o];
		}

		options['path'] = options['path'].replace(/^\//, '');
	};

	function _verify(args) {
		args = Array.prototype.slice.call(args);

		if (typeof args[0] !== 'string')
			throw new Error('DEFINE: First argument is the name of the module.');

		if (typeof args[1] !== 'object' && typeof args[1] !== 'function')
			throw new Error('DEFINE: Second argument is either the callback or dependencies.');

		if (typeof args[1] !== 'object' && typeof args[2] !== 'function')
			throw new Error('DEFINE: Third argument is the callback.');

		var ret = {
			name: args[0].replace(/^\//, ''),
			deps: (args[2]) ? args[1] : [],
			callback: args[2] || args[1]
		};

		for(var d in ret.deps) {
			ret.deps[d] = ret.deps[d].replace(/^\//, '');
		}

		return ret;
	}

	function _execute() {
		for (var name in _modules) {
			var execute = true;
			var deps = _modules[name].deps;
			var args = [];
			for (var d in deps) {

				if (!_loaded[deps[d]]) {
					execute = false;
				}
				args.push(_loaded[deps[d]]);
			}

			if (execute) {
				_loaded[name] = _modules[name].callback.apply(undefined, args);
				delete _modules[name];
				_execute();
			}
		}
	}


	function _load(name, file) {
		if (_loaded[name]) {
			return _loaded[name];
		} else {
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');

			script.async = true;

			script.onload = function() {
				_execute();
			};

			script.onerror = function() {
				console.error('File', file, 'in module', name, 'could not be loaded.');
			};

			var path = (_options.path !== '')?'/' + _options.path:'';

			script.src = path + '/' + file + '.' + _options.extension;
			head.appendChild(script);
		}
	}
})(window);