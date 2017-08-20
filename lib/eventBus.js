const {EventEmitter} = require('events');
class EventBus extends EventEmitter {}
console.log('Initiating Event Bus');
module.exports = new EventBus();
