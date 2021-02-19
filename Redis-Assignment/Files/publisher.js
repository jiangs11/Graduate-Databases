var redis = require("redis");
var argv  = require("yargs")
  .example("$ node publisher.js -c channel -k key -m message")
  .option("c", {
    alias: "channel",
    describe: "The channel to publish to.",
    demandOption: "The channel is required.",
    type: "string",
    nargs: 1,
   })
  .option("k", {
    alias: "key",
    describe: "The key of the message.",
    demandOption: "The key is required.",
    type: "string",
    nargs: 1
  })
  .option("m", {
    alias: "message",
    describe: "The message itself.",
    demandOption: "The message is required.",
    type: "string",
    nargs: 1,
   }).argv;

var publisher = redis.createClient();

publisher.publish(`${argv.channel}`, `{"${argv.key}": "${argv.message}"}`, () => {
 process.exit(0);
});
