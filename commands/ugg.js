const { callugg, getPatch, uggChannelID } = require('../util.js');


module.exports = {
	name: 'ugg',
	args: false,
	guildOnly: true,
    adminOnly: true,
	cooldown: 60,
	usage: ' ',
	description: 'Prints u.gg data',
	execute(message, args) {
		getPatch(uggChannelID, message, true);
		callugg(message);
		// clean up bootstrapping evidence
		message.delete();
	},
};