const { callopgg, getPatch, opggChannelID } = require('../src/util.js');

module.exports = {
	name: 'opgg',
	args: false,
	cooldown: 100,
	guildOnly: true,
	adminOnly: true,
	usage: ' ',
	description: 'Prints opgg data',
	async execute(message, args) {
		getPatch(opggChannelID, message, true);
		callopgg(message);

		await db.insert('opgg', await sites.opgg())
		// clean up bootstrapping evidence
		message.delete();
	},
};