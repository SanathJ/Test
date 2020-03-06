module.exports = {
	name: 'test',
	args: false,
	cooldown: 10,
	guildOnly: true,
	adminOnly: true,
	usage: ' ',
	description: 'testing',
	async execute(message, argsIgnore) {
		message.delete();
	},
};