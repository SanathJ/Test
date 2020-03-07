const { calllol, getPatch, lolChannelID } = require('../src/util.js');
const sites = require('../src/sites.js');
const db = require('../src/database.js');

module.exports = {
	name: 'lol',
	args: false,
	guildOnly: true,
	adminOnly: true,
	cooldown: 100,
	usage: ' ',
	description: 'Prints lolalytics data',
	async execute(message, argsIgnore) {
		getPatch(lolChannelID, message, true);
		calllol(message);

		db.insert('lol', await sites.lol());
		message.delete();
	},
};