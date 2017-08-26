const assert = require('assert');
const gateway = require('../../lib/gateway');
const Config = require('../../lib/config/config');
const request = require('supertest');

let config = new Config();
config.gatewayConfig = {
  http: {
    port: 0
  }
};

describe('gateway routing with plugins', () => {
  let gatewaySrv;
  before('fires up a new gateway instance', function () {
    return gateway({
      plugins: {
        gatewayExtensions: [function (gatewayExpressInstance) {
          gatewayExpressInstance.all('/test', (req, res) => res.json({enabled: true}));
        }]},
      config
    }).then(srv => {
      gatewaySrv = srv.app;
      return srv;
    });
  });

  it('should add custom route', () => {
    return request(gatewaySrv)
      .get('/test')
      .then(res => {
        assert.ok(res.body.enabled);
      });
  });

  after('close gateway srv', () => {
    gatewaySrv.close();
  });
});
