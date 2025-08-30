const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Customize the webpack configuration here
  if (config.devServer) {
    config.devServer.port = 8000;
    config.devServer.host = '0.0.0.0';
  }
  
  return config;
};
