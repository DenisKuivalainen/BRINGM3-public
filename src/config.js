const { viewOnPath } = require("ramda-godlike");
const configFile = require("../config.json");

const config = (...args) => viewOnPath(args, configFile);

module.exports = { config };