# Clocked


### An SVG Analog clock. 

#### Originally Created by: Anthony Datu

#### Revived by: webmech

###### Purpose: Modular Analog Clock For use in browserify based apps

##### Dependencies:
- moment.js
- moment-timezone.js
- angular-expressions

		
##### Installation
```
npm install --save clocked
```

###### Basic Usage
```
var Clock = require('clocked'),
	el = document.createElement('div');

var clock = new Clock(el, {
	autoStart: false
});

clock.start();
```

###### Parameters:
- Element Can be a valid selector a htmlElement (any instance of Node)
- Options:
	- autoStart [default true] - Automaticall start when instantiated

###### Clock Default Colors:
Between 6 am - 5pm, clock color is orange, otherwise gray. The color follows the sun. The colors are overridable

```
 new Clock('#clock', {
   colors: {
   	'day': 'red',
   	'night': 'black'
   }
 });
```
		
[Example](http://codepen.io/anon/pen/YwPOXO)

Todos:

- Tests!
- Make clock instances configurable.
- Make clock color configurable.
- Instantiate with element.
- Generate svg element within constructor.
