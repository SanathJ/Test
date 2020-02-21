module.exports = {
	name: 'stop',
	args: false,
	usage: ' ',
	guildOnly: true,
    adminOnly: true,
	description: 'Stops bot immediately',
	execute(message, args) {
		process.exit(0);
	}
};