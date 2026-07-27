const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native/Libraries/Renderer/shims/ReactNative') {
    return context.resolveRequest(
      context,
      'react-native/Libraries/Renderer/shims/ReactFabric',
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
