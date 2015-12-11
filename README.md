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
	- autoStart [default true] - Automatically start when instantiated
  - city [default local] - The city / timezone to set the time for (e.g. America/Los_Angeles)
  - colors (Any valid css color property value will do):
    - day [default orange] - Color to set the clock during the day.
    - night [default gray] - Color to set the clock during the night.

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