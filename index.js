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
var moment = require('moment-timezone'),
  extend = require('util')._extend,
  format = require('util').format,
  components = require('./lib/components'),
  parse = require('angular-expressions'),
  defaults = {
    autoStart: true,
    colors: {
      'day': '#FF760D',
      'night': '#005753'
    }
  };

function Clock(el, options) {
  var ns = 'http://www.w3.org/2000/svg';

  if (!el) {
    throw new Error('No element given when instantiating clocked.');
  }

  Object.defineProperties(this, {
    el: {
      value: el instanceof Node ? el : document.querySelector(el),
      writable: true
    },
    options: {
      value: options && extend(defaults, options) || defaults
    },
    svgNs: {
      value: ns
    },
    reqFrame: {
      writable: true
    },
    svg: {
      enumerable: true,
      configurable: true,
      value: document.createElementNS(ns, 'svg'),
      writable: true
    }
  });

  this.generate();

  if (this.options.autoStart) {
    this.start();
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
  var city = this.options.city,
    fn = city && moment.tz || moment;
  return parseInt(fn(city).format('HH'), 10) > 17 || parseInt(fn(city).format('HH'), 10) < 6 ? 'night' : 'day';
};

Clock.prototype.dateTicker = function() {
  var city = this.options.city,
    format = arguments.length ? 'HH:mm' : 'ddd D',
    fn = city && moment.tz || moment;
  return fn(city).format(format);
};

Clock.prototype.formatCity = function() {
  var city = this.options.city || 'local',
    formatted = city.replace(/^(\w+\/)*/gi, '');
  return formatted.replace('_', ' ');
};

Clock.prototype.generate = function() {
  var el = this.el,
    height = el.clientHeight,
    ns = this.svgNs,
    position = height / 2,
    /** Get Clock hands angles **/
    time = this.getTime(),
    colors = this.options.colors,
    color = colors[this.dayOrNight()],
    svg = this.svg,
    compMap = {
      circle: document.createElementNS(ns, 'circle'),
      city: document.createElementNS(ns, 'text'),
      date: document.createElementNS(ns, 'text'),
      dot: document.createElementNS(ns, 'circle'),
      hour: document.createElementNS(ns, 'line'),
      minute: document.createElementNS(ns, 'line'),
      second: document.createElementNS(ns, 'line'),
      svg: svg,
      time: document.createElementNS(ns, 'text')
    },
    context = {
      height: height,
      width: height,
      color: color,
      format: format,
      position: position,
      time: time
    },
    component, attr;


  compMap.date.appendChild(document.createTextNode(this.dateTicker()));
  compMap.time.appendChild(document.createTextNode(this.dateTicker(true)));
  compMap.city.appendChild(document.createTextNode(this.formatCity()));

  for (component in components) {
    for(attr in components[component]) {
      compMap[component].setAttr(attr, parse(components[component][attr])(context));
    }
  }
  for (component in compMap) {
    svg.appendChild(compMap[component]);
  }
  el.appendChild(svg);
};

Clock.prototype.tick = function() {
  var div = this.el,
    cir = div.querySelectorAll('circle'),
    hands = div.querySelectorAll('line'), //Get SVG child nodes (clock hands) 
    text = div.querySelectorAll('text'),
    position = div.clientHeight / 2,
    time = this.getTime(),
    hour = time.hour,
    minute = time.minute,
    second = time.second,
    fmt = 'rotate(%s %s %s)';

  [hour, minute, second].forEach(function(time, idx) {
    hands[idx].setAttribute('transform', format(fmt, time, position, position));
  });

  text[0].innerHTML = this.dateTicker();
  text[1].innerHTML = this.dateTicker(true);

  var colors = this.options.colors,
    color = colors[this.dayOrNight()];

  hands.forEach(function(hand) {
    hand.setAttribute('stroke', color);
  });

  text.forEach(function(txt) {
    txt.setAttribute('fill', color);
  });

  cir[0].setAttribute('stroke', color);
  cir[1].setAttribute('fill', color);

  this.reqFrame = window.requestAnimationFrame(this.tick.bind(this));
};

Clock.prototype.start = function() {
  this.reqFrame = window.requestAnimationFrame(this.tick.bind(this));
};

module.exports = Clock;