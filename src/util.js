const { Attachment } = require('discord.js');
const request = require('request');
const Jimp = require('jimp');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json'));

// access key is from screenshotlayer api. Change it to your own in config.json if you want or you can use mine
const lolApiUrl = 'http://api.screenshotlayer.com/api/capture?delay=3&access_key=' + config.accessKeys[0] + '&fullpage=1&force=1&viewport=3840x2160&url=https://lolalytics.com/lol/kayle/';
const logApiUrl = 'http://api.screenshotlayer.com/api/capture?delay=3&access_key=' + config.accessKeys[0] + '&fullpage=1&force=1&viewport=1920x1080&url=https://www.leagueofgraphs.com/champions/stats/kayle';

// separate key
const opggTrendApiUrl = 'http://api.screenshotlayer.com/api/capture?delay=3&access_key=' + config.accessKeys[1] + '&fullpage=1&force=1&viewport=3840x2160&url=https://op.gg/champion/kayle/statistics/top/trend';
const opggStatsApiUrl = 'http://api.screenshotlayer.com/api/capture?delay=3&access_key=' + config.accessKeys[1] + '&fullpage=1&force=1&viewport=3840x2160&url=https://op.gg/champion/statistics';

const uggApiUrl = 'http://api.screenshotlayer.com/api/capture?delay=1&user_agent=Mozilla/5.0%20(iPhone;%20CPU%20iPhone%20OS%2011_0%20like%20Mac%20OS%20X)%20AppleWebKit/604.1.38%20(KHTML,%20like%20Gecko)%20Version/11.0%20Mobile/15A356%20Safari/604.1&fullpage=1&force=1&access_key=';

// URL from where patch data is received
const patchUrl = 'https://raw.githubusercontent.com/CommunityDragon/Data/master/patches.json';

// channel IDs
const logChannelID = config.channels.leagueofgraphs;
const opggChannelID = config.channels.opgg;
const lolChannelID = config.channels.lolalytics;
const uggChannelID = config.channels.ugg;

async function callopgg(msg) {
	/*
     * op.gg
     */

	const opList = [
		'Win Rate',
		'Pick Rate',
		'Ban Rate',
		'Win Rate / Game Length',
		// 'Trends',
		'Leaderboard',
	];


	Jimp.read(opggTrendApiUrl, (err, image) => {
		if (err) {
			console.log(err);
			return;
		}
		// winrate
		let imageCopy = image.clone();
		imageCopy.crop(1380, 727, 2458 - 1380, 1019 - 727);
		// imageCopy.normalize();
		imageCopy.write('./img/op1.png');

		// pickrate
		imageCopy = image.clone();
		imageCopy.crop(1380, 1071, 2459 - 1380, 1405 - 1071);
		// imageCopy.normalize();
		imageCopy.write('./img/op2.png');

		// banrate
		imageCopy = image.clone();
		imageCopy.crop(1380, 1416, 2459 - 1416, 1750 - 1416);
		// imageCopy.normalize();
		imageCopy.write('./img/op3.png');

		// winrate / game length
		imageCopy = image.clone();
		imageCopy.crop(1380, 1761, 2459 - 1380, 2041 - 1761);
		// imageCopy.normalize();
		imageCopy.write('./img/op4.png');
	});

	Jimp.read(opggStatsApiUrl, (err, image) => {
		if (err) {
			console.log(err);
			return;
		}

		// leaderboards
		const imageCopy = image.clone();
		imageCopy.crop(1985, 444, 2439 - 1985, 1283 - 444);
		// imageCopy.normalize();
		imageCopy.write('./img/op5.png');
	});

	// post images
	// has a very high timeout to make sure image processing is complete
	// can have weird errors if this value isnt high enough
	setTimeout(function() {
		for (let i = 1; i <= opList.length; i++) {
			const img = new Attachment(
				__dirname + '/../img/op' + i + '.png',
			);
			setTimeout(sendMessage, (i * 1000), msg, opggChannelID, img, opList[i - 1]);

		}
	}, 100000);

}

async function calllog(msg) {


	Jimp.read(logApiUrl, (err, image) => {
		if (err) {
			console.log(err);
			return;
		}

		// popularity history
		let imageCopy = image.clone();
		imageCopy.crop(629, 482, 1071 - 629, 785 - 482);
		// imageCopy.normalize();
		imageCopy.write('./img/log6.png');

		// winrate history
		imageCopy = image.clone();
		imageCopy.crop(629, 806, 1071 - 629, 1109 - 806);
		// imageCopy.normalize();
		imageCopy.write('./img/log5.png');

		// banrate history
		imageCopy = image.clone();
		imageCopy.crop(629, 1130, 1071 - 629, 1433 - 1130);
		// imageCopy.normalize();
		imageCopy.write('./img/log7.png');

		// winrate / game duration
		imageCopy = image.clone();
		imageCopy.crop(629, 1578, 1071 - 629, 1881 - 1578);
		// imageCopy.normalize();
		imageCopy.write('./img/log8.png');

		// winrate / ranked games played
		imageCopy = image.clone();
		imageCopy.crop(1102, 1578, 1544 - 1102, 1881 - 1578);
		// imageCopy.normalize();
		imageCopy.write('./img/log13.png');

		// kills + assists / game duration
		imageCopy = image.clone();
		imageCopy.crop(629, 1902, 1071 - 629, 2205 - 1902);
		// imageCopy.normalize();
		imageCopy.write('./img/log9.png');

		// deaths / game duration
		imageCopy = image.clone();
		imageCopy.crop(1102, 1902, 1544 - 1102, 2205 - 1902);
		// imageCopy.normalize();
		imageCopy.write('./img/log10.png');

		// winrate / (kills - deaths) @10 min
		imageCopy = image.clone();
		imageCopy.crop(629, 2226, 1071 - 629, 2529 - 2226);
		// imageCopy.normalize();
		imageCopy.write('./img/log11.png');

		// winrate / (kills - deaths) @20 min
		imageCopy = image.clone();
		imageCopy.crop(1102, 2226, 1544 - 1103, 2529 - 2226);
		// imageCopy.normalize();
		imageCopy.write('./img/log12.png');

		// stats
		imageCopy = image.clone();
		imageCopy.crop(629, 290, 1544 - 629, 461 - 290);
		// imageCopy.normalize();
		imageCopy.write('./img/log1.png');

		// Roles
		imageCopy = image.clone();
		imageCopy.crop(1102, 482, 1544 - 1102, 751 - 482);
		// imageCopy.normalize();
		imageCopy.write('./img/log2.png');

		// Damage
		imageCopy = image.clone();
		imageCopy.crop(1102, 945, 1544 - 1102, 1062 - 945);
		// imageCopy.normalize();
		imageCopy.write('./img/log3.png');

		// KDA and misc stats
		imageCopy = image.clone();
		imageCopy.crop(1102, 1083, 1544 - 1102, 1537 - 1083);
		// imageCopy.normalize();
		imageCopy.write('./img/log4.png');

	});

	// post images
	// has a very high timeout to make sure image processing is complete
	// can have weird errors if this value isnt high enough
	setTimeout(function() {
		for (let i = 1; i <= 13; i++) {
			const img = new Attachment(
				__dirname + '/../img/log' + i + '.png',
			);
			setTimeout(sendMessage, (i * 1000), msg, logChannelID, img);
		}
	}, 100000);


}

async function calllol(msg) {


	Jimp.read(lolApiUrl, (err, image2) => {
		if (err) {
			console.log(err);
			return;
		}
		image2.contrast(+0.1);

		let imageCopy = image2.clone();
		imageCopy.crop(1966, 47, 2437 - 1966, 203 - 47);
		imageCopy.write('./img/lol1.png');

		imageCopy = image2.clone();
		imageCopy.crop(1401, 735, 2438 - 1401, 1060 - 735);
		imageCopy.write('./img/lol2.png');

		imageCopy = image2.clone();
		imageCopy.crop(2137, 1065, 2438 - 2137, 1538 - 1065);
		imageCopy.write('./img/lol3.png');
	});

	// post images
	// has a very high timeout to make sure image processing is complete
	// can have weird errors if this value isnt high enough

	setTimeout(function() {
		for (let i = 1; i <= 3; i++) {
			const img = new Attachment(
				__dirname + '/../img/lol' + i + '.png',
			);
			setTimeout(sendMessage, (i * 1000), msg, lolChannelID, img);
		}
	}, 100000);

}

async function callugg(msg) {


	const tierList = [
		'platinum',
		'platinum_plus',
		'diamond',
		'diamond_plus',
		'master',
		'master_plus',
		'grandmaster',
		'challenger',
		'overall',
	];

	const tierName = [
		'Platinum',
		'Platinum+',
		'Diamond',
		'Diamond+',
		'Master',
		'Master+',
		'Grandmaster',
		'Challenger',
		'Overall',
	];

	for (let i = 0; i < tierList.length; i++) {
		const finalUrl = uggApiUrl +
                       config.accessKeys[2 + (i % 5)] +
                       '&url=https://u.gg/lol/champions/kayle/build?rank=' +
                       tierList[i];

		uggHelper(i, finalUrl);

	}

	setTimeout(function() {
		for (let i = 0; i < tierList.length; i++) {
			const img = new Attachment(
				__dirname + '/../img/ugg' + i + '.png',
			);
			setTimeout(sendMessage, (i * 1000), msg, uggChannelID, img, tierName[i]);
		}
	}, 100000);

}

function printDateAndPatch(pat, channel, message) {
	const today = new Date();
	// prints date
	message.client.channels.get(channel).send(
		'```' +
			today.getDate() +
			'/' +
			(today.getMonth() + 1) +
			'/' +
			today.getFullYear() +
			', Patch ' +
			pat +
			'```',
	);

}

async function uggHelper(x, final) {


	Jimp.read(final, (err, image) => {
		if (err) {
			console.log(err);
			return;
		}

		image.crop(83, 513, 1098 - 83, 603 - 513);
		image.write('./img/ugg' + x + '.png');
	});
}

function sendMessage(message, channel, image, text = '') {
	message.client.channels.get(channel).send(text, image);
}

function getPatch(channel = '', message = '', print) {
	request.get(patchUrl, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			const data = JSON.parse(body);

			if(print) {return printDateAndPatch(parseFloat(data.patches.slice(-1)[0].name).toFixed(2), channel, message);}
		}
	});
}

module.exports = {
	calllog,
	calllol,
	callopgg,
	callugg,
	getPatch,
	printDateAndPatch,
	logChannelID,
	lolChannelID,
	opggChannelID,
	uggChannelID,
	patchUrl,
};