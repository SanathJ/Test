const { calllol, getPatch, lolChannelID } = require('../src/util.js');

module.exports = {
	name: 'lol',
	args: false,
	cooldown: 100,
	guildOnly: true,
	adminOnly: true,
	usage: ' ',
	description: 'Prints lolalytics data',
	execute(message, argsIgnore) {
		getPatch(lolChannelID, message, true);
		calllol(message);
		// clean up bootstrapping evidence
		message.delete();
	},
};