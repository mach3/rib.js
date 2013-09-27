
describe("Core", function() {

	it("initialize", function(){
		var Foo = Rib.extend({});
		var foo = new Foo;
		expect(foo instanceof Foo).toBe(true);
	});

	it("rebase()", function(){
		var Test = Rib.extend({
			vars: {
				foo: true,
				bar: false,
				baz: null
			},
			initialize: function(){
				this.rebase("vars");
			}
		});

		var a = new Test;
		var b = new Test;

		b.vars.foo = 1;
		b.vars.bar = 2;
		b.vars.baz = 3;

		expect(a.vars).not.toEqual(b.vars);
	});

});

describe("Events", function() {

	it("on/off()", function(){
		var Test = Rib.extend({});
		var test = new Test;
		var stack = [];
		var handlers = {
			foo: function(){
				stack.push("foo");
			},
			bar: function(){
				stack.push("bar");
			},
			baz: function(){
				stack.push("baz");
			}
		};

		test.on("test", handlers.foo);
		test.on("test", handlers.bar);
		test.on("test", handlers.baz);

		test.trigger("test");

		test.off("test", handlers.foo);
		test.off("test", handlers.baz);

		test.trigger("test");

		expect(stack.join(",")).toBe("foo,bar,baz,bar");
	});

	it("once()", function(){
		var Test = Rib.extend({});
		var test = new Test;
		var stack = [];
		var foo = function(){
			stack.push("foo");
		};
		var bar = function(){
			stack.push("bar");
		};
		var baz = function(){
			stack.push("baz");
		};

		test.one("test", foo);
		test.one("test", bar);

		test.trigger("test");
		test.trigger("test");

		test.one("test", baz);

		expect(stack.join(",")).toBe("foo,bar,baz");
	});
});


describe("Attributes", function() {
	it("attr()", function(){
		var Test = Rib.extend({
			defaults: {
				foo: null,
				bar: null
			}
		});
		var test = new Test;

		test.attr("foo", 1);
		test.attr("bar", 2);

		expect(test.attr("foo")).toBe(1);
		expect(test.attr("bar")).toBe(2);

		test.attr({
			foo: 3,
			bar: 4
		});

		expect(test.attr("foo")).toBe(3);
		expect(test.attr("bar")).toBe(4);
		expect(test.attr()).toEqual({foo: 3, bar: 4});
	});

	it("change event", function(){
		var Test = Rib.extend({
			defaults: {
				foo: null,
				bar: null
			}
		});
		var test = new Test();

		var stack = [];

		test.on("change", function(key, value){
			stack.push({
				key: key,
				value: value
			});
		});

		test.attr("foo", true);
		test.attr("bar", false);

		expect(stack).toEqual([
			{
				key: "foo",
				value: true
			},
			{
				key: "bar",
				value: false
			}
		]);
	});

});

describe("Utilities", function() {

	var Test = Rib.extend({});

	it("_isString", function(){
		var test = new Test;

		expect(test._isString("hoge")).toBe(true);
		expect(test._isString(new String("hoge"))).toBe(true);
		expect(test._isString(String("hoge"))).toBe(true);
		expect(test._isString(Object.toString())).toBe(true);
	});

	it("_each(array)", function(){
		var test = new Test;
		var arr = ["a", "b", "c", "d", "e"];
		(function(){
			var stack = [];
			test._each(arr, function(value, index){
				stack.push(value);
			});
			expect(stack).toEqual(arr);
		}());
		(function(){
			var stack = [];
			test._each(arr, function(value, index){
				if(value === "d"){ return false; }
				stack.push(value);
			});
			expect(stack).toEqual(["a", "b", "c"]);
		}());
	});

	it("_each(object)", function(){
		var test = new Test;
		var obj = {
			foo: true,
			bar: false,
			baz: true,
			hoge: true,
			fuga: false,
			piyo: true
		};
		(function(){
			var stack = {};
			test._each(obj, function(value, key){
				stack[key] = value;
			});
			expect(stack).toEqual(obj);
		}());
	});

	it("_sprintf()", function(){
		var test = new Test;
		expect(
			test._sprintf("%s,%s,%s,%s", "foo", "bar", "baz")
		).toEqual("foo,bar,baz,");
	});
  
});