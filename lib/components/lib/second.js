module.exports = {
  'x1': 'height / 2',
  'y1': 'height / 2',
  'x2': 'height / 2',
  'y2': '((height / 2) - (height / 2 * 0.80))',
  'stroke': 'color',
  'stroke-width': '(height * 0.01) + \'px\'',
  'stroke-linecap': '\'round\'',
  'stroke-opacity': '0.4',
  'fill': '\'transparent\'',
  'transform': 'format(\'rotate( %s %s %s)\', time.second, position, position)'
};