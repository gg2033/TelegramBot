require("dotenv").config();

const bot = require('./translaterBot');
require('./web')(bot);