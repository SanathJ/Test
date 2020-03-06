const database = require('../src/database.js');

module.exports = {
	name: 'stop',
	args: false,
	usage: ' ',
	guildOnly: true,
	adminOnly: true,
	description: 'Stops bot immediately',
	execute(message, argsIgnore) {
		message.delete();
		database.close();
		process.exit(0);
	},
};