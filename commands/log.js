const { calllog, getPatch, logChannelID } = require('../util.js');

module.exports = {
	name: 'log',
	args: false,
	guildOnly: true,
    adminOnly: true,
	cooldown: 100,
	usage: ' ',
	description: 'Prints league of graphs data',
	execute(message, args) {
		getPatch(logChannelID, message, true);
		calllog(message);
		// clean up bootstrapping evidence
		message.delete();
	},
};