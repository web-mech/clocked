module.exports = {
  'x1': 'position',
  'y1': 'position',
  'x2': 'height / 2',
  'y2': '((height / 2) - (height / 2 * 0.70))',
  'stroke': 'color',
  'stroke-width': '(height * 0.03) + \'px\'',
  'stroke-linecap': '\'round\'',
  'stroke-opacity': '0.4',
  'fill': '\'transparent\'',
  'transform': 'format(\'rotate( %s %s %s)\', time.minute, position, position)'
};