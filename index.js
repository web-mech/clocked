var moment = require('moment-timezone'),
  extend = require('util')._extend,
  format = require('util').format,
  components = require('./lib/components'),
  parse = require('angular-expressions').compile,
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
    color: {
      get: function() {
        return this.options.colors[this.dayOrNight()];
      }
    },
    timeFn: {
      get: function() {
        var city = this.options.city;
        return city && moment.tz || moment;
      }
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
    fn = this.timeFn;
  return {
    hour: (parseInt(fn(city).format('h'), 10) * 30) + (parseInt(fn(city).format('mm'), 10) * 0.5),
    minute: parseInt(fn(city).format('mm'), 10) * 6,
    second: parseInt(fn(city).format('ss'), 10) * 6
  };
};


Clock.prototype.dayOrNight = function() {
  var city = this.options.city,
    fn = this.timeFn;
  return parseInt(fn(city).format('HH'), 10) > 17 || parseInt(fn(city).format('HH'), 10) < 6 ? 'night' : 'day';
};

Clock.prototype.dateTicker = function() {
  var city = this.options.city,
    format = arguments.length ? 'HH:mm' : 'ddd D',
    fn = this.timeFn;
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
    color = this.color,
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
      fill: 'transparent',
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
    for (attr in components[component]) {
      compMap[component].setAttribute(attr, parse(components[component][attr])(context));
    }
  }

  delete compMap.svg;

  for (component in compMap) {
    svg.appendChild(compMap[component]);
  }
  el.appendChild(svg);
};

Clock.prototype.tick = function() {
  var div = this.el,
    color = this.color,
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

  [this.dateTicker(), this.dateTicker(true)].forEach(function(formattedDate, idx) {
    text[idx + 1] = formattedDate;
  });

  Array.prototype.forEach.call(hands, function(hand) {
    hand.setAttribute('stroke', color);
  });

  Array.prototype.forEach.call(text, function(txt) {
    txt.setAttribute('fill', color);
  });

  ['stroke', 'fill'].forEach(function(attr, idx) {
    cir[idx].setAttribute(attr, color);
  });

  this.reqFrame = window.requestAnimationFrame(this.tick.bind(this));
};

Clock.prototype.start = function() {
  this.reqFrame = window.requestAnimationFrame(this.tick.bind(this));
};

module.exports = Clock;