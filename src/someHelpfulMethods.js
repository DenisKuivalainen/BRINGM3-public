const { compose, flatten, lte, test, length } = require('ramda');

// Get string length
const strLength = compose(length, flatten);

module.exports = { strLength };