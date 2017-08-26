const assert = require('assert');
const admin = require('../../lib/rest');
const request = require('supertest');
describe('admin with plugins', () => {
  let adminSrv;
  before('fires up a new admin instance', function () {
    return admin({
      plugins: {
        adminExtensions: [function (adminExpressInstance) {
          adminExpressInstance.all('/test', (req, res) => res.json({enabled: true}));
        }]},
      config: {
        gatewayConfig: {
          admin: {
            port: 0
          }
        }
      }
    }).then(srv => {
      adminSrv = srv;
      return srv;
    });
  });

  it('should add custom route', () => {
    return request(adminSrv)
      .get('/test')
      .then(res => {
        assert.ok(res.body.enabled);
      });
  });

  after('close admin srv', () => {
    adminSrv.close();
  });
});
