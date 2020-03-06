const util = require('../src/util.js');
const sites = require('../src/sites.js');
const db = require('../src/database.js');

module.exports = {
	name: 'megu',
	args: false,
	cooldown: 100,
	guildOnly: true,
	adminOnly: true,
	usage: ' ',
	description: 'Prints op.gg, league of graphs, lolalytics, and u.gg data',
	async execute(message, argsIgnore) {
		util.getPatch(util.logChannelID, message, true);
		util.getPatch(util.lolChannelID, message, true);
		util.getPatch(util.opggChannelID, message, true);
		util.getPatch(util.uggChannelID, message, true);

		util.calllog(message);
		util.calllol(message);
		util.callopgg(message);
		util.callugg(message);

		await db.insert('opgg', await sites.opgg());
		await db.insert('ugg', await sites.ugg());
		await db.insert('log', await sites.log());

		message.delete();
	},
};