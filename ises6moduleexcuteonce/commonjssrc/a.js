var counter = require('./m.js');

module.exports = {
    increaseCount: function() {
        counter.count += 1;
    }
}