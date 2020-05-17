const db = require('../src/database.js');

const fs = require('fs');
const { format } = require('util');

const Discord = require('discord.js');

const config = JSON.parse(fs.readFileSync('config.json'));

module.exports = {
	name: 'current',
	args: false,
	guildOnly: true,
	adminOnly: true,
	cooldown: 60,
	usage: ' ',
	description: 'Displays most recent data collected',
	async execute(message, argsIgnore) {
		this.curr(message);
	},

	async curr(message) {
		message.client.channels.get(config.channels.current).bulkDelete(4);
		const siteArr = ['opgg', 'ugg', 'lol', 'log'];
		for (let i = 0; i < siteArr.length; i++) {
			const row = await db.row(format('SELECT * FROM %s ORDER BY Date DESC LIMIT 1', siteArr[i]));

			// sets image and url based on site
			let image;
			let url;
			let color;
			switch (siteArr[i]) {
			case 'opgg':
				image = 'https://cdn.discordapp.com/attachments/561116378090700811/711408499388579870/opgg.png';
				url = 'https://na.op.gg/champion/kayle/statistics/top/trend';
				color = '#ff0000';
				break;
			case 'log':
				image = 'https://cdn.discordapp.com/attachments/561116378090700811/711405113872482334/LoG.png';
				url = 'https://www.leagueofgraphs.com/champions/stats/kayle';
				color = '#5775a6';
				break;
			case 'lol':
				image = 'https://cdn.discordapp.com/attachments/561116378090700811/711407080871034932/LoLalytics.png';
				url = 'https://lolalytics.com/lol/kayle/';
				color = '#d5b240';
				break;
			case 'ugg':
				image = 'https://cdn.discordapp.com/attachments/561116378090700811/711438714290831461/UGG.png';
				url = 'https://u.gg/lol/champions/kayle/build';
				color = '#0060ff';
				break;
			}

			const embed = new Discord.RichEmbed()
				.setColor(color)
				.setTitle('Kayle Data')
				.setURL(url)
				.setImage(image)
				.addField('Date', row.Date, true)
				.addField('Patch', row.Patch, true)
				.addBlankField()
				.addField('Winrate', row.Winrate + '%', true)
				.addField('Pickrate', row.Pickrate + '%', true)
				.addField('Banrate', row.Banrate + '%', true);

			message.client.channels.get(config.channels.current).send(embed);
		}
		message.delete().catch(() => {});
	},
};