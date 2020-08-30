const db = require('../src/database.js');

module.exports = {
	name: 'link',
	guildOnly: true,
	adminOnly: true,
	description: 'adds link to be referred by a shorter name with `show`',
	aliases: ['links'],
	usage: '<link> <name>',
	minArgLength: 2,
	cooldown: 0,
	async execute(message, args) {
		const link = args.shift();
		const name = args.join(' ');
		const data = await db.rawInsert('links', [name, link]);
		// non unique
		if (data === 19) {
			const sentMsg = await message.reply('A link by this name already exists. Would you like to edit it?');
			const filter = (reaction, user) => (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') && user.id === message.author.id;
			sentMsg.react('👍');
			sentMsg.react('👎');

			// 2.5 min timeout
			const collector = sentMsg.createReactionCollector(filter, { time: 150000 });
			collector.on('collect', async function(r, user) {
				if(r.emoji.name === '👍') {
					db.runner('run', 'DELETE FROM links WHERE name=?', name);
					await db.rawInsert('links', [name, link]);
					collector.stop();
				}
				else if (r.emoji.name === '👎') {
					collector.stop();
				}
			});
		}
		await message.delete().catch(() => {});
	},
};