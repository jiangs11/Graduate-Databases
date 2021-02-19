var redis = require("redis");
var argv  = require("yargs")
  .example("$ node subscriber.js -c channel")
  .option("c", {
    alias: "channel",
    describe: "The channel to subscribe to.",
    demandOption: "The channel is required.",
    type: "string",
    nargs: 1,
   }).argv;

var subscriber = redis.createClient();
var publisher = redis.createClient();

subscriber.on("message", (channel, message) => {
 if (channel !== 'emergency' && message.toLowerCase().includes('urgent')) {
  publisher.publish('emergency', message, () => {
   console.log('\nDetected urgency! Republished to emergency channel!');
  })
 }
 else {
  console.log('\nMessage ' + message + ' has arrived on channel ' + channel + '!');
 }
});
subscriber.subscribe(`${argv.channel}`);
