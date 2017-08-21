module.exports = {
  name: 'policy-from-example-plugin',
  policy: (actionParams) => {
    return (req, res) => {
      // eslint-disable-next-line no-console
      console.log('executing policy-from-example-plugin with params', actionParams);
    };
  }
};
