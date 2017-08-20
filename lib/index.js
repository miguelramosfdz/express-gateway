require('./eventBus'); // init event bus
const pluginsLoader = require('./plugins');
if (require.main === module) {
  require('./config'); // this is to init config before loading servers and plugins
  let plugins = pluginsLoader.load();
  require('./gateway')({plugins});
  require('./rest')({plugins});
} else { // Loaded as module (e.g. if "eg gateway create" generated code )
  class Main {
    constructor () {
      this.configPath = null;
    }

    load (configPath) {
      this.configPath = configPath;
      return this;
    }

    run () {
      process.env.EG_CONFIG_DIR =
        this.configPath || process.env.EG_CONFIG_DIR;
      require('./config'); // this is to init config before loading servers and plugins
      let plugins = pluginsLoader.load();
      require('./gateway')({plugins});
      require('./rest')({plugins});

      return this;
    }
  }

  module.exports = () => {
    return new Main();
  };
}
