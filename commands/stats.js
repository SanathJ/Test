const database = require('../src/database.js');
const { format } = require('util');
const Discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));

module.exports = {
	name: 'stats',
	args: true,
	minArgLength: 1,
	guildOnly: false,
	adminOnly: false,
	cooldown: 120,
	usage: '<opgg | ugg | log | lol> [=today | DD-MM-YYYY]',
	description: 'Prints kayle data from a site on a certain day',
	async execute(message, args) {

		const sites = ['opgg', 'ugg', 'log', 'lol'];

		if (!sites.includes(args[0].toLowerCase())) {
			return message.reply('that\'s not a valid site!');
		}

		let row;
		if(args[1] && args[1] != 'today') {
			const arr = args[1].split('-');
			if(args[1].length != 10 || arr.length != 3) {
				return message.reply('that\'s not a valid date! The correct format is `DD-MM-YYYY`');
			}

			let dateStr = arr[2] + '-' + arr[1] + '-' + arr[0];
			try{
				let chk = new Date(dateStr).toISOString();
				chk = new Date(dateStr);
				dateStr = chk.getFullYear() + '-'
					+ ('0' + (chk.getMonth() + 1)).slice(-2) + '-'
					+ ('0' + chk.getDate()).slice(-2);
			}
			catch(err) {
				return message.reply('that\'s not a valid date! The correct format is `DD-MM-YYYY`');
			}

			row = await database.row(format('SELECT * FROM %s WHERE Date = ?', args[0]), dateStr);

			if (!row) {
				message.reply('no data was found for ' + args[1] + '!');
				message.delete();
				return;
			}
		}
		else {
			row = await database.row(format('SELECT * FROM %s ORDER BY Date DESC LIMIT 1', args[0]));
		}

		// sets image and url based on site
		let image;
		let url;
		let color;
		switch (args[0]) {
		case 'opgg':
			image = 'https://cdn.discordapp.com/attachments/482911683568861186/682143294465245194/Kayle_opgg.png';
			url = 'https://na.op.gg/champion/kayle/statistics/top/trend';
			color = '#ff0000';
			break;
		case 'log':
			image = 'https://cdn.discordapp.com/attachments/482911683568861186/682134344948908073/LoG.png';
			url = 'https://www.leagueofgraphs.com/champions/stats/kayle';
			color = '#5775a6';
			break;
		case 'lol':
			image = 'https://cdn.discordapp.com/attachments/482911683568861186/682132205916782662/LoG.png';
			url = 'https://lolalytics.com/lol/kayle/';
			color = '#d5b240';
			break;
		case 'ugg':
			image = 'https://cdn.discordapp.com/attachments/482911683568861186/682126819524476958/U.gg.png';
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

		message.delete();
		message.channel.send(embed)
			.then(msg => {
				if (msg.guild && msg.channel.id != config.channels.bot) {
					msg.delete(120000);
				}
			});
	},
};
