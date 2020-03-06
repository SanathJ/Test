const sites = require('../src/sites.js');
const db = require('../src/database.js');

module.exports = {
	name: 'test',
	args: false,
	cooldown: 10,
	guildOnly: true,
	adminOnly: true,
	usage: ' ',
	description: 'testing',
	async execute(message, args) {
		console.log(await db.insert('opgg', await sites.opgg()));
		message.delete();
	},
};