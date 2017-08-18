let cors = require('cors');
module.exports = {
  policy: function (policyManifest) {
    return cors(policyManifest.actionParams);
  }
};
