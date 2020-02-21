const { callopgg, getPatch, opggChannelID} = require('../util.js');

module.exports = {
	name: 'opgg',
	args: false,
	cooldown: 100,
	guildOnly: true,
    adminOnly: true,
	usage: ' ',
	description: 'Prints opgg data',
	execute(message, args) {
		getPatch(opggChannelID, message, true);
		callopgg(message);
		// clean up bootstrapping evidence
		message.delete();
	},
};