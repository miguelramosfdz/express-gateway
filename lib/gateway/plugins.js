const config = require('../config');
const logger = require('../logger').plugins;
const EventEmitter = require('events');
let pluginsSettings = config.systemConfig.plugins || {};

module.exports.load = function () {
  let pluginConfig = config.systemConfig.plugins || {};

  let loadedPlugins = [];
  for (let pluginName in pluginConfig) {
    try {
      let settings = pluginsSettings[pluginName];
      let requireName = settings.package || pluginName;
      let plugin = require(requireName);
      let manifest = new PluginManifest({settings});
      let loadedPlugin = plugin(manifest);
      loadedPlugins.push(loadedPlugin);
    } catch (err) {
      logger.error('Failed to load plugin ' + pluginName, err);
    }
  }
};

class PluginManifest extends EventEmitter {
  constructor ({settings}) {
    super();
    this.logger = logger;
    this.settings = settings || {};
    this.config = config;
    this.policies = [];
    this.conditions = [];
  }
}

// module.exports = function(manifest){
//     // it can be explicit `manifest` or it can be just 'this'
//     manifest.config // access to configuration {gateway, system, models}

//     manifest.config.models.Roles = {
//       properties: {
//         name: {isRequired: true, isMutable: true},
//         }
//     } // some new model definition

//     //New service declaration: oauth2 plugin will have code like:
//     manifest.services.tokenService = {}

//     // Existing Service: to avoid refactoring we can do decorators
//     // Or Strategy if we have time to refactor existing services
//     // (In this case main issue is to define common interface)
//     manifest.credentialService = decorator(manifest.credentialService)
//     decorator = function(credSrv){
//       let prev = credSrv.getCredential
//       credSrv.getCredential = function (id, type, options) {
//        if(type === 'jwt'){ /* do jwt magic */ }
//         else { return prev.apply(arguments) }
//       }
//     }

//     //dao objects exposed as property of a service
//     manifest.credentialService.dao.redis // this is lib/services/credentials/credential.dao.js
//     // same trick with decorators to change behavior
//     // the only problem with decorators vs strategy is that you can accidentally override other modules

//     manifest.conditions.register(function(conditionManifest){})

//       // alternative variant []
//     manifest.policies.register(require('./policies/name')) // ->
//   // eg plugin add policy
//   // policies
//   //   my-polciy.js
//   //
//   // define new gateway routes/middlewares

//   //
//     manifest.routes = function(gatewayExpressInstance) {}

//   // define new Admin routes/middlewares
//     manifest.adminRoutes = function(adminExpressInstance) {}

//     manifest.on('serverReady', ({httpServer, httpsServer})=> {
//       httpServer.on('upgrade', ()=>{}) // integrate websockets
//       httpsServer.on('upgrade', ()=>{}) // integrate secure websockets
//     })
