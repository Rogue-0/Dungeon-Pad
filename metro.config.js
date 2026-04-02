// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Allow Metro to resolve .wasm files (needed by expo-sqlite on web)
config.resolver.assetExts.push('wasm');

module.exports = config;
