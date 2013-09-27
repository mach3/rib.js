
# Rib.js (working)

Simple class library for jQuery

```javascript
var Person = Rib.extend({
	defaults: {
		name: null,
		age: null
	},
	initialize: function(name, age){
		this.attr({
			name: name,
			age: age
		});
	},
	hello: function(){
		var str = "Hello, my name is %s, %s years old";
		console.log(
			this._sprintf(str, this.attr("name"), this.attr("age"))
		);
	}
});

var john = new Person("John", 23);
john.hello(); // Hello, my name is John, 23 years old
```

## author

mach3 @ <http://github.com/mach3>