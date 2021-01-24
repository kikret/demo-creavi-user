"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var config = require('../../../creavi.conf.json');

var defaultConfig = config.development;
var environment = process.env.NODE_ENV || 'development';
var environmentConfig = config[environment];

var finalConfig = _objectSpread({}, defaultConfig, {}, environmentConfig);

global.gConfig = finalConfig;

var jwt_config = require('../../../jwt.conf.json');

var public_key = jwt_config.public_key;
var private_key = jwt_config.private_key;
console.log(jwt_config, public_key, private_key);
global.keys = _objectSpread({}, {
  public_key: public_key
}, {}, {
  private_key: private_key
});