module.exports = {
  version: 'v1.0',
  init: function (pluginManifest) {
    pluginManifest.policies.push(require('./policies/example-policy'));
    pluginManifest.routes.push(require('./routes/hello-eg'));
    pluginManifest.adminRoutes.push(require('./admin-routes/hello-admin'));
  }

};
