module.exports = {
  version: 'v1.0',
  init: function (pluginManifest) {
    pluginManifest.policies.push(require('./policies/example-policy'));
    pluginManifest.routes.push(require('./routes/hello-eg'));
    pluginManifest.adminRoutes.push(require('./admin-routes/hello-admin'));

    pluginManifest.eventBus.on('hot-reload', function ({type, newConfig}) {
      console.log('hot-reload', type, newConfig);
    });
    pluginManifest.eventBus.on('ready', function ({httpServer, httpsServer, adminServer}) {
      console.log('ready');
    });
  }

};
