const sites = require('../src/sites.js');

module.exports = {
	name: 'test',
	args: false,
	cooldown: 10,
	guildOnly: true,
	adminOnly: true,
	usage: ' ',
	description: 'testing',
	async execute(message, args) {
		sites.lol();
		//console.log(await sites.lol());
		message.delete();
	},
};