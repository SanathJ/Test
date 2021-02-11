const { callopgg, printDateAndPatch, opggChannelID } = require('../src/util.js');
const sites = require('../src/sites.js');
const db = require('../src/database.js');

module.exports = {
	name: 'opgg',
	args: false,
	cooldown: 100,
	guildOnly: true,
	adminOnly: true,
	usage: ' ',
	description: 'Prints opgg data',
	async execute(message, argsIgnore) {
		await printDateAndPatch(opggChannelID, message);
		callopgg(message);

		db.insert('opgg', await sites.opgg());
		// clean up bootstrapping evidence
		message.delete().catch(() => {});
	},
};