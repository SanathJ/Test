module.exports = {
	name: 'time',
	args: false,
	cooldown: 60,
	usage: ' ',
	guildOnly: true,
	adminOnly: true,
	description: 'Prints server time',
	execute(message, args) {
		const date_ob = new Date();

		// current date
		// adjust 0 before single digit date
		const date = ('0' + date_ob.getDate()).slice(-2);

		// current month
		const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

		// current year
		const year = date_ob.getFullYear();

		// current hours
		const hours = date_ob.getHours();

		// current minutes
		const minutes = date_ob.getMinutes();

		// current seconds
		const seconds = ('0' + date_ob.getSeconds()).slice(-2);
		message.channel.send(
			'Server Time: ' +
                        date +
                        '/' +
                        month +
                        '/' +
                        year +
                        ' ' +
                        hours +
                        ':' +
                        minutes +
                        ':' +
                        seconds,
		);
	},
};