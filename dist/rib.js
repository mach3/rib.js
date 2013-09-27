/*!
 * Rib.js
 * ------
 * @version 0.8.0
 * @author mach3 <http://github.com/mach3>
 * @url http://github.com/mach3/rib.js
 * @license MIT License
 */
(function($, global, undefined){

	var Rib = {};

	/**
	 * Extend and create class-like object
	 * @param Object|Function obj
	 * @return Function
	 */
	Rib.extend = function(/* obj, obj, ... */){
		var args, RibObject;
		RibObject = function(){
			this.rebase(
				"defaults",
				"attributes",
				"handlers",
				"triggered"
			);
			$.extend(this.attributes, this.defaults);
			if(this._isString(this.el)){
				this.$el = $(this.el);
			}
			this.initialize.apply(this, arguments);
		};
		args = [
			Rib.Core,
			Rib.Events,
			Rib.Attributes,
			Rib.Util
		].concat([].slice.call(arguments));
		args = $.map(args, function(arg){
			return (typeof arg === "function") ? arg.prototype : arg;
		});
		args = [true, RibObject.prototype].concat(args);
		RibObject.prototype = $.extend.apply(null, args);
		return RibObject;
	};

	/**
	 * Core feature
	 * - `initialize()` as constructor
	 * - `rebase()` to rebase object
	 */
	Rib.Core = {

		el: null,
		$el: null,

		initialize: $.noop,

		/**
		 * Rebase object from reference to this own by name
		 * @param String name
		 */
		rebase: function(/* name, name */){
			var my = this;
			this._each([].slice.call(arguments), function(name, i){
				if(my[name] === undefined){ return; }
				my[name] = $.extend(true, {}, my[name]);
			});
			return this;
		}
	};

	/**
	 * Events feature
	 * - `on/off()` to add or remove event listener
	 * - `trigger()` to fire events
	 * - `one()` to add handler which runs just once
	 */
	Rib.Events = {

		handlers: {},
		triggered: {},

		/**
		 * Add event listener
		 * - If `once` is passed as true, the handler runs only once
		 * - If `once` is true and the event is already triggered once, call `func` immidiately
		 * @param String name
		 * @param Function func
		 * @param Boolean once
		 */
		on: function(name, func, once){
			once = !! once;
			if(! this.handlers[name]){
				this.handlers[name] = [];
			}
			if(once && !! this.triggered[name]){
				func.call(this);
				return;
			}
			this.handlers[name].push({
				once: once,
				func: func
			});
		},

		/**
		 * Add event listener which runs just once
		 * @param String name
		 * @param Function func
		 */
		one: function(name, func){
			this.on(name, func, true);
		},

		/**
		 * Remove event listener
		 * - If `func` isn't passed, remove all event listeners by name
		 * @param String name
		 * @param Function func
		 */
		off: function(name, func){
			var my = this;
			if(func === undefined){
				this.handlers[name] = [];
				return;
			}
			if(! this.handlers[name]){ return; }
			this._each(this.handlers[name], function(handler, i){
				if(handler.func === func){
					my.handlers[name].splice(i, 1);
				}
			});
			return this;
		},

		/**
		 * Fire event
		 * - The 2nd or following arguments will be passed to handler
		 * @param String name
		 * @param Mixed arg1, arg2 ...
		 */
		trigger: function(/* name, arg, arg */){
			var my = this, args, name;
			args = [].slice.call(arguments);
			name = args.shift();
			if(! this.handlers[name]){ return; }
			this.triggered[name] = true;
			this._each(this.handlers[name], function(handler, i){
				handler.func.apply(my, args);
				if(handler.once){
					my.off(name, handler.func);
				}
			});
			return this;
		}
	};

	/**
	 * Attributes feature
	 * - `defaults` as default values for attributes
	 * - `attributes` as container for attributes
	 * - `attr()` as setter and getter for attributes
	 */
	Rib.Attributes = {

		defaults: {},
		attributes: {},

		/**
		 * Set or get attribute(s)
		 * - If `key` and `value` passed, set attribute by key
		 * - If object passed as 1st argument, set attribute by object's properties
		 * - If `value` is not passed, get attribute by key
		 * - If no arguments, return all attributes
		 * @param String key
		 * @param Mixed value
		 * @return Mixed
		 */
		attr: function(key, value){
			var my = this, data = key;
			if(! arguments.length){
				return this.attributes;
			}
			if(! this._isString(data) && typeof data === "object"){
				this._each(data, function(value, key){
					my.attr(key, value);
				});
				return this;
			}
			if(value === undefined){
				return this.attributes[key];
			}
			if(this.attributes[key] !== value){
				this.attributes[key] = value;
				this.trigger("change", key, value);
			}
			return this;
		}
	};

	/**
	 * Utility feature
	 */
	Rib.Util = {

		/**
		 * Return obj is string or not
		 * @param Mixed obj
		 * @return Boolean
		 */
		_isString: function(obj){
			return typeof obj === "string" || obj instanceof String;
		},

		/**
		 * Run callback for each properties of `obj`
		 * @param Array|Object obj
		 * @param Function callback
		 */
		_each: function(obj, callback){
			var i;
			for(i in obj){
				if(! obj.hasOwnProperty(i)){ continue; }
				if(false === callback(obj[i], i, obj)){ break; }
			}
		},

		/**
		 * Return formatted string
		 * @param String tmpl
		 * @param String str,str,str...
		 * @return String
		 */
		_sprintf: function(/* tmpl, str, str, str ... */){
			var args = [].slice.call(arguments);
			return args.shift().replace(/%s/g, function(){
				return args.shift() || "";
			});
		}
	};

	global.Rib = Rib;

}(jQuery, this));