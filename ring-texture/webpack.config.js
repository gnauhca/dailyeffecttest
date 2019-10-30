const path = require('path');

module.exports = function() {
  return {
    entry: path.join(process.cwd(), 'ring-ani'),
    output: {
      path: path.join(process.cwd(), 'dist'),
      filename: '[name].js',
      library: 'ringAni',
      libraryTarget: 'umd'
    }
  };
}