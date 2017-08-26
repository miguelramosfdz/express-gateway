const assert = require('assert');
const admin = require('../../lib/rest');

describe('admin with plugins', () => {
  before('fires up a new gateway instance with valid config', () => {
    admin({adminExtensions: [function (adminExpressInstance) {
      assert.ok(adminExpressInstance);
      adminExpressInstance.all('/*', (req, res) => res.json({enabled: true}));
    }]});
  });
});
