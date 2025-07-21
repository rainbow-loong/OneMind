const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, './')
};
config.resolver.sourceExts.push('cjs');

module.exports = config;