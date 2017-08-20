const config = require('./config');
const logger = require('./logger').plugins;
const eventBus = require('./eventBus');
let pluginsSettings = config.systemConfig.plugins || {};
const engineVersion = 'v1.0';
module.exports.load = function () {
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
      let manifest = new PluginManifest({settings});
      let loadedPlugin = plugin.init(manifest);
      loadedPlugins.push(loadedPlugin);
      logger.info('Loaded plugin', pluginName);
    } catch (err) {
      logger.error('Failed to load plugin ' + pluginName, err);
    }
  }
  return loadedPlugins;
};
class PluginManifest {
  constructor ({settings}) {
    this.logger = logger;
    this.settings = settings || {};
    this.config = config;
    this.policies = [];
    this.conditions = [];
    this.routes = [];
    this.adminRoutes = [];
    this.eventBus = eventBus;
  }
}

// module.exports = function(manifest){
//     // it can be explicit `manifest` or it can be just 'this'
//     manifest.config // access to configuration {gateway, system, models}

//     manifest.on('serverReady', ({httpServer, httpsServer})=> {
//       httpServer.on('upgrade', ()=>{}) // integrate websockets
//       httpsServer.on('upgrade', ()=>{}) // integrate secure websockets
//     })
