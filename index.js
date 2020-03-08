const Discord = require('discord.js');
const bot = new Discord.Client();

const fs = require('fs');

const CronJob = require('cron').CronJob;

bot.commands = new Discord.Collection();

const database = require('./src/database.js');

const { execute } = require('./commands/megu.js');

const config = JSON.parse(fs.readFileSync('config.json'));

const token = config.token;
const PREFIX = config.prefix;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));


bot.once('ready', () => {
	console.log('Online!');
	database.init();
	// bot.user.setActivity('with explosions');
});

bot.on('error', console.error);

bot.on('message', async msg => {

	if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;


	const args = msg.content.slice(PREFIX.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && msg.channel.type !== 'text') {
		return msg.reply('I can\'t execute that command inside DMs!');
	}

	if (command.adminOnly) {
		const mem = await msg.guild.fetchMember(msg.author);
		if(!mem.hasPermission(8)) return;
	}


	if (command.args && (args.length < command.minArgLength)) {

		let reply = `You didn't provide sufficient arguments, ${msg.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
		}

		return msg.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(msg.author.id)) {
		const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return msg.reply(`please wait ${timeLeft.toFixed()} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	else {
		timestamps.set(msg.author.id, now);
		setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
	}

	try {
		command.execute(msg, args);
	}
	catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute that command!');
	}
});

const job = new CronJob('0 30 23 * * *', function() {
	const channel = bot.channels.get(config.channels.general);
	execute(channel.lastMessage, undefined);
}, null, false, 'Asia/Kolkata');
job.start();

bot.login(token);