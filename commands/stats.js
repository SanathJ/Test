const database = require('../database.js');
const { format } = require('util');
const Discord = require('discord.js');

module.exports = {
	name: 'stats',
	args: true,
	minArgLength: 2,
	guildOnly: false,
	adminOnly: false,
	cooldown: 5,
	usage: '<opgg | ugg | log | lol> <DD-MM-YYYY>',
	description: 'Prints kayle data from a site on a certain day',
	async execute(message, args) {

		const sites = ['opgg', 'ugg', 'log', 'lol'];

		if (!sites.includes(args[0].toLowerCase())) {
			return message.reply('that\'s not a valid site!');
		}

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
			message.reply('that\'s not a valid date! The correct format is `DD-MM-YYYY`');
		}

		const row = await database.test(format('SELECT * FROM %s WHERE Date = ?', 'opgg'), dateStr);

		if (!row) {
			message.reply('no data was found for ' + dateStr + '!');
			message.delete();
			return;
		}

		// sets desc based on site
		let image;

		switch (args[0]) {
		case 'opgg':
			image = 'https://cdn.discordapp.com/attachments/482911683568861186/682143294465245194/Kayle_opgg.png';
			break;
		case 'log':
			image = 'League Of Graphs data';
			break;
		case 'lol':
			image = 'Lolalytics data';
			break;
		case 'ugg':
			image = 'U.gg data';
			break;
		}

		const embed = new Discord.RichEmbed()
			.setColor('#ff0000')
			.setTitle('Kayle Data')
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
				if (msg.guild) {
					msg.delete(180000);
				}
			});
	},
};
