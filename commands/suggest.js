const config = require('../config.json');
const { MessageEmbed } = require('discord.js');

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


		// copy message into embed
		const embed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setDescription(args.join(' '));
		const sentMsg = await message.channel.send(embed);
		await sentMsg.react('749195645658726481');
		await sentMsg.react('749195645902127224');

		await message.delete().catch(() => {});
	},
};