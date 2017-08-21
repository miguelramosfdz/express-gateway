module.exports = {
  name: 'url-match',
  handler: function (req, actionConfig) {
    return (actionConfig.expected === req.url);
  }
};
