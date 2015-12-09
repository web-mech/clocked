var format = require('util').format,
  path = './lib/%s.json',
  components = ['circle', 'city', 'date', 'dot', 'hour', 'minute', 'second', 'svg', 'time'];

components.forEach(function(component) {
  exports[component] = require(format(path, component));
});