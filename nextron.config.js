module.exports = {
  webpack: (defaultConfig, env) =>
    Object.assign(defaultConfig, {
      entry: {
        // electron main process
        background: "./main/background.js",
        // we can require `config.js` by using `require('electron').remote.require('./config')`
        preload: "./main/preload.js",
      },
    }),
};
