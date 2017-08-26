const logger = require('./logger').plugins;
const eventBus = require('./eventBus');
const engineVersion = 'v1.0';
module.exports.load = function ({config}) {
  config = config || require('./config');
  let pluginsSettings = config.systemConfig.plugins || {};

  let pluginConfig = config.systemConfig.plugins || {};

  let loadedPlugins = [];
  logger.debug('Loading plugins. Plugin engine version:', engineVersion);
  for (let pluginName in pluginConfig) {
    try {
      logger.debug('Loading plugin', pluginName);
      let settings = pluginsSettings[pluginName];
      let requireName = (settings && settings.package) || pluginName;
      let plugin = require(requireName);
      if (plugin.version !== engineVersion) { // TODO: versioning of plugins
        logger.warn(plugin.version, 'is different from engine version:', engineVersion, 'trying to load');
      }
      let manifest = new PluginManifest({settings, config});
      plugin.init(manifest);
      loadedPlugins.push(manifest);
      logger.info('Loaded plugin', pluginName);
    } catch (err) {
      logger.error('Failed to load plugin ' + pluginName, err);
    }
  }

  // Note: All logic to handle different plugin version should be here
  // Note: Rest of EG code must use only one standard interface
  return {
    policies: extract(loadedPlugins, 'policies'),
    conditions: extract(loadedPlugins, 'conditions'),
    gatewayExtensions: extract(loadedPlugins, 'gatewayExtensions'),
    adminExtensions: extract(loadedPlugins, 'adminExtensions'),
    cliExtensions: extract(loadedPlugins, 'cliExtensions')
  };
};

class PluginManifest {
  constructor ({settings, config}) {
    this.logger = logger;
    this.settings = settings || {};
    this.config = config;
    this.policies = [];
    this.conditions = [];
    this.gatewayExtensions = [];
    this.adminExtensions = [];
    this.cliExtensions = [];
    this.eventBus = eventBus;
  }
}

function extract (loadedPlugins, propName) {
  return loadedPlugins.reduce((result, current) => {
    return result.concat(current[propName] || []);
  }, []);
};

// module.exports = function(manifest){
//     // it can be explicit `manifest` or it can be just 'this'
//     manifest.config // access to configuration {gateway, system, models}

//     manifest.on('serverReady', ({httpServer, httpsServer})=> {
//       httpServer.on('upgrade', ()=>{}) // integrate websockets
//       httpsServer.on('upgrade', ()=>{}) // integrate secure websockets
//     })