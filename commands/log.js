const { calllog, getPatch, logChannelID } = require('../src/util.js');

module.exports = {
	name: 'log',
	args: false,
	guildOnly: true,
	adminOnly: true,
	cooldown: 100,
	usage: ' ',
	description: 'Prints league of graphs data',
	async execute(message, args) {
		getPatch(logChannelID, message, true);
		calllog(message);
		await db.insert('log', await sites.log())
		message.delete();
	},
};