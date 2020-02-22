const { calllol, getPatch, lolChannelID } = require('../util.js');

module.exports = {
	name: 'lol',
	args: false,
	cooldown: 100,
	guildOnly: true,
	adminOnly: true,
	usage: ' ',
	description: 'Prints lolalytics data',
	execute(message, args) {
		getPatch(lolChannelID, message, true);
		calllol(message);
		// clean up bootstrapping evidence
		message.delete();
	},
};