/**
  Created By: Anthony Datu
  Purpose: Modular Analog Clock
  Date: 07/16/2014
  Notes: This works in conjunction with moment.js and moment-timezone.js
  How to use: 
    1) In html create <div id='clock'><svg></svg></div>
    2) Set div's height and width equal to each other(e.g 400px by 400px)
    3) Call new Clock() to instantiate object
    4) Call method generate('#clock','Manila') <--- City is optional, if no city 
    time will default to Local time.
  
  Clock Description:
    Between 6 am - 5pm, clock color is orange, otherwise gray. 
**/
var moment = require('moment-timezone');

function Clock(el, options) {
  var ns = 'http://www.w3.org/2000/svg',
  el = el instanceof Node ? el : document.querySelector(el);

  Object.defineProperties(this, {
    id: {
      value: Date.now(),
      writable: true
    },
    svgNs: {
      value: ns
    },
    city: {
      writable: true
    },
    timer: {
      value: {}
    },
    svg: {
      enumerable: true,
      configurable: true,
      value: document.createElementNS(ns, 'svg'),
      writable: true
    },
    options: {
      value: options || {}
    },
    el: {
      value: el,
      writable: true
    }
  });

  this.generate();

  if (this.options.autoStart) {
    this._start();
  }
}

Clock.prototype.getTime = function() {
  var city = this.options.city,
    fn = city && moment.tz || moment;
  return {
    hour: (parseInt(fn(city).format('h'), 10) * 30) + (parseInt(fn(city).format('mm'), 10) * 0.5),
    minute: parseInt(fn(city).format('mm'), 10) * 6,
    second: parseInt(fn(city).format('ss'), 10) * 6
  };
};


Clock.prototype.dayOrNight = function() {
  var city = this.options.city;
  return parseInt(moment.tz(city).format('HH'), 10) > 17 || parseInt(moment.tz(city).format('HH'), 10) < 6 ? 'night' : 'day';
};

Clock.prototype.dateTicker = function() {
  var city = this.options.city,
    format = arguments.length ? 'HH:mm' :  'ddd D';
  return moment.tz(city).format(format);
};

Clock.prototype.formatCity = function() {
  var city = this.options.city || 'local',
    formatted = city.replace(/^(\w+\/)*/gi, '');
  return formatted.replace('_', ' ');
};

Clock.prototype.generate = function() {
  var el = this.el,
    height = el.clientHeight,
    width = height,
    ns = this.svgNs,
    position = height / 2,
    /** Get Clock hands angles **/
    time = this.getTime(),
    color = this.dayOrNight() === 'night' ? '#005753' : '#FF760D',
    svg = this.svg,
    circle = document.createElementNS(ns, 'circle'),
    dot = document.createElementNS(ns, 'circle'),
    hourHand = document.createElementNS(ns, 'line'),
    minuteHand = document.createElementNS(ns, 'line'),
    secondHand = document.createElementNS(ns, 'line'),
    datetext = document.createElementNS(ns, 'text'),
    digitalclock = document.createElementNS(ns, 'text'),
    cityName = document.createElementNS(ns, 'text');

  datetext.appendChild(document.createTextNode(this.dateTicker()));
  digitalclock.appendChild(document.createTextNode(this.dateTicker(true)));
  cityName.appendChild(document.createTextNode(this.formatCity()));

  /** Set the Attributes **/
  //Container
  svg.setAttribute('height', height);
  svg.setAttribute('width', width);

  //Clock face
  circle.setAttribute('cx', height / 2);
  circle.setAttribute('cy', height / 2);
  circle.setAttribute('r', (height / 2 - (height * 0.035)));
  circle.setAttribute('fill', 'transparent');
  circle.setAttribute('stroke', color);
  circle.setAttribute('stroke-width', (height * 0.035));

  //Clock center dot
  dot.setAttribute('cx', height / 2);
  dot.setAttribute('cy', height / 2);
  dot.setAttribute('r', (height * 0.033));
  dot.setAttribute('fill', color);


  //Hour Hand
  hourHand.setAttribute('x1', position);
  hourHand.setAttribute('y1', position);
  hourHand.setAttribute('x2', position);
  hourHand.setAttribute('y2', ((height / 2) - (height / 2 * 0.35)));
  hourHand.setAttribute('stroke', color);
  hourHand.setAttribute('stroke-width', (height * 0.04) + 'px');
  hourHand.setAttribute('stroke-linecap', 'round');
  hourHand.setAttribute('stroke-opacity', '.4');
  hourHand.setAttribute('fill', 'transparent');
  hourHand.setAttribute('transform', 'rotate( ' + time.hour + ' ' + position + ' ' + position + ')');

  //Minute Hand
  minuteHand.setAttribute('x1', height / 2);
  minuteHand.setAttribute('y1', height / 2);
  minuteHand.setAttribute('x2', height / 2);
  minuteHand.setAttribute('y2', ((height / 2) - (height / 2 * 0.70)));
  minuteHand.setAttribute('stroke', color);
  minuteHand.setAttribute('stroke-width', (height * 0.03) + 'px');
  minuteHand.setAttribute('stroke-linecap', 'round');
  minuteHand.setAttribute('stroke-opacity', '.4');
  minuteHand.setAttribute('fill', 'transparent');
  minuteHand.setAttribute('transform', 'rotate( ' + time.minute + ' ' + position + ' ' + position + ')');

  //Second Hand
  secondHand.setAttribute('x1', height / 2);
  secondHand.setAttribute('y1', height / 2);
  secondHand.setAttribute('x2', height / 2);
  secondHand.setAttribute('y2', ((height / 2) - (height / 2 * 0.80)));
  secondHand.setAttribute('stroke', color);
  secondHand.setAttribute('stroke-width', (height * 0.01) + 'px');
  secondHand.setAttribute('stroke-linecap', 'round');
  secondHand.setAttribute('stroke-opacity', '.4');
  secondHand.setAttribute('fill', 'transparent');
  secondHand.setAttribute('transform', 'rotate( ' + time.second + ' ' + position + ' ' + position + ')');

  //Text Date
  datetext.setAttribute('x', (width * 0.12));
  datetext.setAttribute('y', ((height / 2) + (height * 0.1)));
  datetext.setAttribute('font-size', height / 2 * 0.13);
  datetext.setAttribute('fill', color);

  //Digital clock
  digitalclock.setAttribute('x', (width * 0.12));
  digitalclock.setAttribute('y', ((height / 2) + (height * 0.16)));
  digitalclock.setAttribute('font-size', height / 2 * 0.16);
  digitalclock.setAttribute('fill', color);
  digitalclock.setAttribute('class', 'digital');

  //City Name
  cityName.setAttribute('x', (width * 0.12));
  cityName.setAttribute('y', ((height / 2) + (height * 0.2)));
  cityName.setAttribute('font-size', (height / 2 * 0.1));
  cityName.setAttribute('fill', color);
  cityName.setAttribute('class', 'digital');

  /** Append the clock to the div **/
  svg.appendChild(circle);
  svg.appendChild(datetext);
  svg.appendChild(digitalclock);
  svg.appendChild(cityName);
  svg.appendChild(hourHand);
  svg.appendChild(minuteHand);
  svg.appendChild(secondHand);
  svg.appendChild(dot);

  el.appendChild(svg);
};

Clock.prototype.updateHands = function() {
  var div = this.el,
    cir = div.querySelectorAll('circle'),
    hands = div.querySelectorAll('line'), //Get SVG child nodes (clock hands) 
    text = div.querySelectorAll('text'),
    position = div.clientHeight / 2,
    time = this.getTime(),
    i;

  hands[0].setAttribute('transform', 'rotate( ' + time.hour + ' ' + position + ' ' + position + ')');
  hands[1].setAttribute('transform', 'rotate( ' + time.minute + ' ' + position + ' ' + position + ')');
  hands[2].setAttribute('transform', 'rotate( ' + time.second + ' ' + position + ' ' + position + ')');

  text[0].innerHTML = this.dateTicker();
  text[1].innerHTML = this.dateTicker(true);

  var color = this.dayOrNight() === 'night' ? '#005753' : '#FF760D';
  
  //update hands color
  for (i = 0; i < hands.length; i++) {
    hands[i].setAttribute('stroke', color);
  }

  //update texts color
  text[0].setAttribute('fill', color);
  text[1].setAttribute('fill', color);
  text[2].setAttribute('fill', color);

  cir[0].setAttribute('stroke', color);
  cir[1].setAttribute('fill', color);

  window.requestAnimationFrame(this.updateHands.bind(this));
};

Clock.prototype._start = function() {
  this.timer = window.requestAnimationFrame(this.updateHands.bind(this));
};

module.exports = Clock;