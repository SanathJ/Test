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

const uggApiUrl = 'http://api.screenshotlayer.com/api/capture?delay=3&user_agent=Mozilla/5.0%20(iPhone;%20CPU%20iPhone%20OS%2011_0%20like%20Mac%20OS%20X)%20AppleWebKit/604.1.38%20(KHTML,%20like%20Gecko)%20Version/11.0%20Mobile/15A356%20Safari/604.1&fullpage=1&force=1&viewport=3840x2160&access_key=';

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
		if (err) throw err;

		// winrate
		let imageCopy = image.clone();
		imageCopy.crop(1381, 687, 2458 - 1381, 1019 - 687);
		// imageCopy.normalize();
		imageCopy.write('./img/op1.png');

		// pickrate
		imageCopy = image.clone();
		imageCopy.crop(1381, 1032, 2458 - 1381, 1364 - 1032);
		// imageCopy.normalize();
		imageCopy.write('./img/op2.png');

		// banrate
		imageCopy = image.clone();
		imageCopy.crop(1381, 1377, 2458 - 1381, 1709 - 1377);
		// imageCopy.normalize();
		imageCopy.write('./img/op3.png');

		// winrate / game length
		imageCopy = image.clone();
		imageCopy.crop(1381, 1722, 2458 - 1381, 2000 - 1722);
		// imageCopy.normalize();
		imageCopy.write('./img/op4.png');
	});

	Jimp.read(opggStatsApiUrl, (err, image) => {
		if (err) throw err;

		// leaderboards
		const imageCopy = image.clone();
		imageCopy.crop(1986, 407, 2438 - 1986, 1244 - 407);
		// imageCopy.normalize();
		imageCopy.write('./img/op5.png');
	});

	// post images
	// has a very high timeout to make sure image processing is complete
	// can have weird errors if this value isnt high enough
	setTimeout(function() {
		for (let i = 1; i <= opList.length; i++) {
			const img = new Attachment(
				__dirname + '/img/op' + i + '.png',
			);
			setTimeout(sendMessage, (i * 1000), msg, opggChannelID, img, opList[i - 1]);

		}
	}, 100000);

}

async function calllog(msg) {


	Jimp.read(logApiUrl, (err, image) => {
		if (err) throw err;

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
		imageCopy.write('./img//log7.png');

		// winrate / game duration
		imageCopy = image.clone();
		imageCopy.crop(629, 1523, 1070 - 629, 1825 - 1523);
		// imageCopy.normalize();
		imageCopy.write('./img/log8.png');

		// winrate / ranked games played
		imageCopy = image.clone();
		imageCopy.crop(1103, 1524, 1543 - 1103, 1825 - 1524);
		// imageCopy.normalize();
		imageCopy.write('./img/log13.png');

		// kills + assists / game duration
		imageCopy = image.clone();
		imageCopy.crop(630, 1848, 1070 - 630, 2149 - 1848);
		// imageCopy.normalize();
		imageCopy.write('./img/log9.png');

		// deaths / game duration
		imageCopy = image.clone();
		imageCopy.crop(1103, 1848, 1543 - 1103, 2149 - 1848);
		// imageCopy.normalize();
		imageCopy.write('./img/log10.png');

		// winrate / (kills - deaths) @10 min
		imageCopy = image.clone();
		imageCopy.crop(630, 2172, 1070 - 630, 2473 - 2172);
		// imageCopy.normalize();
		imageCopy.write('./img/log11.png');

		// winrate / (kills - deaths) @20 min
		imageCopy = image.clone();
		imageCopy.crop(1103, 2172, 1543 - 1103, 2473 - 2172);
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
		imageCopy.crop(1102, 890, 1544 - 1102, 1007 - 890);
		// imageCopy.normalize();
		imageCopy.write('./img/log3.png');

		// KDA and misc stats
		imageCopy = image.clone();
		imageCopy.crop(1103, 1029, 1543 - 1103, 1481 - 1029);
		// imageCopy.normalize();
		imageCopy.write('./img/log4.png');

	});

	// post images
	// has a very high timeout to make sure image processing is complete
	// can have weird errors if this value isnt high enough
	setTimeout(function() {
		for (let i = 1; i <= 13; i++) {
			const img = new Attachment(
				__dirname + '/img/log' + i + '.png',
			);
			setTimeout(sendMessage, (i * 1000), msg, logChannelID, img);
		}
	}, 100000);


}

async function calllol(msg) {


	Jimp.read(lolApiUrl, (err, image2) => {
		if (err) throw err;
		image2.contrast(+0.1);

		let imageCopy = image2.clone();
		imageCopy.crop(1976, 49, 2439 - 1976, 194 - 49);
		imageCopy.write('./img/lol1.png');

		imageCopy = image2.clone();
		imageCopy.crop(1401, 735, 2438 - 1401, 1058 - 735);
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
				__dirname + '/img/lol' + i + '.png',
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

	for (let i = 0; i < tierList.length; i++) {
		const finalUrl = uggApiUrl +
                       config.accessKeys[2 + (i % 5)] +
                       '&url=https://m.u.gg/lol/champions/kayle/build?rank=' +
                       tierList[i];

		uggHelper(i, finalUrl);

	}

	setTimeout(function() {
		for (let i = 0; i < tierList.length; i++) {
			const img = new Attachment(
				__dirname + '/img/ugg' + i + '.png',
			);
			setTimeout(sendMessage, (i * 1000), msg, uggChannelID, img);
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
		if (err) throw err;

		image.crop(1735, 112, 2104 - 1735, 267 - 112);
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

			if(print) {return printDateAndPatch(parseFloat(data.patches.slice(-1)[0].name), channel, message);}
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
};