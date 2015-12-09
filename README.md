# Clocked


### An SVG Analog clock. 

	Created By: Anthony Datu
	Updated By: webmech
	Purpose: Modular Analog Clock

	Dependencies:
		1) moment.js
		2) moment-timezone.js

	How to use: 
		1) In html create <div id="clock"><svg></svg></div>
		2) Set div's height and width equal to each other(e.g 400px by 400px)
		3) Call new Clock(el, options) to 
		4) Call method clock.generate("#clock","Asia/Manila") <--- Zone is optional, if no city 
		time will default to Local time. Zone follows the moment-timezone.js zone name convention.
		5) Global timer[] key/value pair array holds the timer id for each clock. Key is the ID of element.
	           If you want to stop one clock, use clearInterval(timer['#element_id']);
	           
	Clock Description:
		Between 6 am - 5pm, clock color is orange, otherwise gray. The color follows the sun. 
		
[Example](http://codepen.io/anon/pen/YwPOXO)

Todos:
 	- Tests!
	- Make clock instances configurable.
	- Make clock color configurable.
	- Instantiate with element.
	- Generate svg element within constructor.
