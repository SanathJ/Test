const config = require('../config.json');

module.exports = {
	name: 'suggest',
	guildOnly: true,
	adminOnly: true,
	description: 'List all of my commands or info about a specific command.',
	aliases: ['suggestion'],
	usage: '<suggestion>',
	minArgLength: 1,
	cooldown: 3,
	async execute(message, args) {
		if (message.channel.id !== config.channels.suggestions) {
			return false;
		}

		await message.react('749195645658726481');
		await message.react('749195645902127224');
		await message.delete().catch(() => {});
	},
};