const config = require('../../../creavi.conf.json');
const fs = require("fs")
const path = require('path')



const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = {...defaultConfig, ...environmentConfig};

global.gConfig = finalConfig;


const jwt_config = require('../../../jwt.conf.json');
const expiresIn =jwt_config.expiresIn;
const algorithm = jwt_config.algorithm;
const public_key = fs.readFileSync(path.join('./', jwt_config.public_key), "utf8");
const private_key = fs.readFileSync(path.join('.', jwt_config.private_key), "utf8");

global.keys = { ...{public_key}, ...{private_key}, ...{expiresIn}, ...{algorithm} };


