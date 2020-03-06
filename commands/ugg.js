const { callugg, getPatch, uggChannelID } = require('../src/util.js');


module.exports = {
	name: 'ugg',
	args: false,
	guildOnly: true,
	adminOnly: true,
	cooldown: 60,
	usage: ' ',
	description: 'Prints u.gg data',
	async execute(message, args) {
		getPatch(uggChannelID, message, true);
		callugg(message);
		await db.insert('ugg', await sites.ugg())
		message.delete();
	},
};