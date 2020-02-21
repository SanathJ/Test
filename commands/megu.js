const util = require('../util.js');

module.exports = {
	name: 'megu',
	args: false,
	cooldown: 100,
	guildOnly: true,
    adminOnly: true,
	usage: ' ',
	description: 'Prints op.gg, league of graphs, lolalytics, and u.gg data',
	execute(message, args) {
		util.getPatch(util.logChannelID, message, true);
		util.getPatch(util.lolChannelID, message, true);
		util.getPatch(util.opggChannelID, message, true);
		util.getPatch(util.uggChannelID, message, true);
		util.calllog(message);
		util.calllol(message);
		util.callopgg(message);
		util.callugg(message);
		message.delete();
	},
};