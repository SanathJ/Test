const { calllog, printDateAndPatch, logChannelID } = require('../src/util.js');
const sites = require('../src/sites.js');
const db = require('../src/database.js');

module.exports = {
	name: 'log',
	args: false,
	guildOnly: true,
	adminOnly: true,
	cooldown: 100,
	usage: ' ',
	description: 'Prints league of graphs data',
	async execute(message, argsIgnore) {
		await printDateAndPatch(logChannelID, message);
		calllog(message);

		db.insert('log', await sites.log());
		message.delete().catch(() => {});
	},
};