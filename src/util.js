const { MessageAttachment } = require('discord.js');
const request = require('request');
const Jimp = require('jimp');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const d3 = require('d3');

const { createCanvas, registerFont, loadImage } = require('canvas');
// fonts
registerFont(__dirname + '/../fonts/HelveticaNeue-Bold.otf', { family: 'HelveticaNeue', weight: '700' });
registerFont(__dirname + '/../fonts/Roboto-Regular.ttf', { family: 'Roboto', weight: '400' });
registerFont(__dirname + '/../fonts/Roboto-Light.ttf', { family: 'Roboto', weight: '300' });
registerFont(__dirname + '/../fonts/Roboto-Medium.ttf', { family: 'Roboto', weight: '500' });
registerFont(__dirname + '/../fonts/Roboto-Bold.ttf', { family: 'Roboto', weight: '700' });

const config = JSON.parse(fs.readFileSync('config.json'));

// access key is from screenshotlayer api. Change it to your own in config.json if you want or you can use mine
const lolApiUrl = 'http://api.screenshotlayer.com/api/capture?delay=3&access_key=' + config.accessKeys[0] + '&fullpage=1&force=1&viewport=3840x2160&url=https://lolalytics.com/lol/kayle/';

// separate key
const opggTrendApiUrl = 'http://api.screenshotlayer.com/api/capture?delay=3&access_key=' + config.accessKeys[1] + '&fullpage=1&force=1&viewport=3840x2160&url=https://op.gg/champion/kayle/statistics/top/trend';
const opggStatsApiUrl = 'http://api.screenshotlayer.com/api/capture?delay=3&access_key=' + config.accessKeys[1] + '&fullpage=1&force=1&viewport=3840x2160&url=https://op.gg/champion/statistics';

// URL from where patch data is received
const patchUrl = 'https://raw.githubusercontent.com/CommunityDragon/Data/master/patches.json';

// channel IDs
const logChannelID = config.channels.leagueofgraphs;
const opggChannelID = config.channels.opgg;
const lolChannelID = config.channels.lolalytics;
const uggChannelID = config.channels.ugg;

// color constants
const LOGBgColor = '#3a4556';
const LOGDividerColor = '#2d3848';
const LOGGreen = '#2DEB90';
const LOGRed = '#ff5859';
const LOGBlue = '#2AA3CC';

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
		imageCopy.crop(1379, 727, 2460 - 1379, 1061 - 727);
		// imageCopy.normalize();
		imageCopy.write('./img/op1.png');

		// pickrate
		imageCopy = image.clone();
		imageCopy.crop(1379, 1070, 2460 - 1379, 1406 - 1070);
		// imageCopy.normalize();
		imageCopy.write('./img/op2.png');

		// banrate
		imageCopy = image.clone();
		imageCopy.crop(1379, 1415, 2460 - 1379, 1751 - 1415);
		// imageCopy.normalize();
		imageCopy.write('./img/op3.png');

		// winrate / game length
		imageCopy = image.clone();
		imageCopy.crop(1379, 1760, 2460 - 1379, 2042 - 1760);
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
		imageCopy.crop(1984, 445, 2460 - 1985, 1286 - 444);
		// imageCopy.normalize();
		imageCopy.write('./img/op5.png');
	});

	// post images
	// has a very high timeout to make sure image processing is complete
	// can have weird errors if this value isnt high enough
	setTimeout(function() {
		for (let i = 1; i <= opList.length; i++) {
			const img = new MessageAttachment(
				__dirname + '/../img/op' + i + '.png',
			);
			setTimeout(sendMessage, (i * 1000), msg, opggChannelID, img, opList[i - 1]);

		}
	}, 100000);

}

// pie charts for stats
async function log1(dom, channel, n) {
	const canvas = createCanvas(800, 200);

	const ctx = canvas.getContext('2d');
	ctx.fillStyle = LOGBgColor;
	ctx.fillRect(0, 0, 800, 200);

	const chart = d3.arc().innerRadius(55).outerRadius(60);
	ctx.translate(100, 100);
	chart.context(ctx);

	// pie charts
	const arr = [];
	const chartColors = [LOGBlue, LOGGreen, LOGRed, '#FDB05F'];
	const labelArr = ['Popularity', 'Win Rate', 'Ban Rate', 'Mained By'];
	for(let i = 0; i < 4; i++) {
		arr[i]	= Number((dom.window.document.getElementById('graphDD' + (i + 1)).innerHTML).trim().replace('%', ''));

		const data = [{ value:arr[i], index:0 }, { value:100 - arr[i], index:1 }];
		const arcs = d3.pie()
			.value(function(d) { return d.value;})
			.sort(function(a, b) { return a.index < b.index; })(data);

		ctx.translate((i ? 200 : 0), 0);
		chart.context(ctx);

		ctx.fillStyle = chartColors[i];
		ctx.beginPath();
		chart(arcs[0]);
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.fillStyle = '#485363';
		chart(arcs[1]);
		ctx.fill();
		ctx.closePath();

		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.font = '300 24px Roboto';
		ctx.fillStyle = '#ffffff';
		ctx.fillText(arr[i] + '%', 0, 0);

		ctx.fillStyle = '#ffffff';
		ctx.font = '300 20px Roboto';
		ctx.fillText(labelArr[i], 0, 80);
	}


	const img = new MessageAttachment(canvas.toBuffer('image/png'), 'log' + n + '.png');
	return channel.send('', img);

}

// draws a line in ctx at (x, y) of specified width
function drawLine(ctx, x, y, width) {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + width, y);
	ctx.stroke();
}

async function log2(dom, channel, n) {

	// data collection from dom
	const coll = dom.window.document.getElementsByTagName('progressbar');
	const data = [];
	for(let i = 0; i < coll.length / 2; i++) {
		data[i] = {};
		data[i].popularity = coll[2 * i].getAttribute('data-value') * 100;
		data[i].winrate = coll[2 * i + 1].getAttribute('data-value') * 100;
	}

	// gets data rows
	const rowColl = dom.window.document.getElementsByClassName('sortable_table')[0]
		.getElementsByTagName('tbody')[0]
		.getElementsByTagName('tr');

	for(let i = 1; i < rowColl.length; i++) {
		data[i - 1].position = rowColl[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].textContent.trim();
	}


	const spriteYCoords = {
		Top: 150,
		Mid: 90,
		Support: 120,
		'AD Carry': 0,
		Jungler: 60,
	};

	const canvas = createCanvas(553, 389);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = LOGBgColor;
	ctx.fillRect(0, 0, 553, 389);

	// Title
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.font = '500 24px Roboto';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Roles', 23, 13);

	// divider (x = 22 to x = 525)
	ctx.strokeStyle = LOGDividerColor;
	drawLine(ctx, 22, 48, 525 - 22);

	// get spritesheet
	const spritesheet = await loadImage(__dirname + '/../img/log_lanes.png');

	// headers
	const start = 37;
	ctx.textAlign = 'left';
	ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';

	// aligns headers to be placed at their category's center
	ctx.textAlign = 'center';
	ctx.font = '400 14px Roboto';
	ctx.fillText('Role', start + 60, 112 - 40);
	ctx.fillText('Winrate', 353 + (150 / 2), 112 - 40);
	// popularity rendered as bold to show its the sorting predicate
	ctx.font = '700 14px Roboto';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Popularity', 171 + (150 / 2), 112 - 40);

	// chart
	ctx.textAlign = 'left';
	let yOffset = 0;
	ctx.font = '400 12px Roboto';
	for(let i = 0; i < 5; i++) {

		// draw lane
		ctx.drawImage(spritesheet, 0, spriteYCoords[data[i].position], 30, 30,
			171 - 134, 112 - 2 + yOffset, 30, 30);

		// draw label
		ctx.fillStyle = '#ffffff';
		ctx.textBaseline = 'middle';
		ctx.fillText(data[i].position, (171 - 134) + 30 + 4, (112 - 2) + yOffset + (30 / 2));

		ctx.textBaseline = 'top';
		// popularity
		// grey underlying bar
		ctx.fillStyle = '#2f3b4b';
		ctx.fillRect(171, 112 + yOffset, 150, 15);
		// actual data bar
		ctx.fillStyle = LOGBlue;
		ctx.fillRect(171, 112 + yOffset, data[i].popularity / 100 * 150, 15);
		// label
		ctx.fillStyle = '#ffffff';
		ctx.fillText(parseFloat(data[i].popularity).toFixed(1) + '%', 171, 131 + yOffset);
		// set to default
		ctx.fillStyle = '#2f3b4b';

		// winrate
		// grey underlying bar
		ctx.fillRect(353, 112 + yOffset, 150, 15);
		// actual data bar
		ctx.fillStyle = LOGGreen;
		ctx.fillRect(353, 112 + yOffset, data[i].winrate / 100 * 150, 15);
		// label
		ctx.fillStyle = '#ffffff';
		ctx.fillText(parseFloat(data[i].winrate).toFixed(1) + '%', 353, 131 + yOffset);
		// set to default
		ctx.fillStyle = '#2f3b4b';

		// draw dividers only between categories
		if (i != 4) {
			// divider
			drawLine(ctx, 22, 112 + 44 + yOffset, 525 - 22);
		}

		yOffset += 55;
	}

	const img = new MessageAttachment(canvas.toBuffer('image/png'), 'log' + n + '.png');
	return channel.send('', img);
}

async function calllog(msg) {
	const dom = await JSDOM.fromURL('https://www.leagueofgraphs.com/champions/stats/kayle', {});
	const channel = await msg.client.channels.fetch(logChannelID);

	await log1(dom, channel, 1);
	await log2(dom, channel, 2);
}

async function calllol(msg) {


	Jimp.read(lolApiUrl, (err, image2) => {
		if (err) {
			console.log(err);
			return;
		}
		image2.contrast(+0.1);

		let imageCopy = image2.clone();
		imageCopy.crop(1998, 47, 2473 - 1998, 203 - 47);
		imageCopy.write('./img/lol1.png');

		imageCopy = image2.clone();
		imageCopy.crop(1434, 731, 2471 - 1434, 1054 - 731);
		imageCopy.write('./img/lol2.png');

		imageCopy = image2.clone();
		imageCopy.crop(2170, 1061, 2471 - 2170, 1522 - 1061);
		imageCopy.write('./img/lol3.png');
	});

	// post images
	// has a very high timeout to make sure image processing is complete
	// can have weird errors if this value isnt high enough

	setTimeout(function() {
		for (let i = 1; i <= 3; i++) {
			const img = new MessageAttachment(
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
		'diamond_2_plus',
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
		'Diamond 2+',
		'Master',
		'Master+',
		'Grandmaster',
		'Challenger',
		'Overall',
	];

	const xCoords = [121, 315, 507, 700, 893];
	const labels = ['Win Rate', 'Rank', 'Pick Rate', 'Ban Rate', 'Matches'];
	const wrColors = { 'shinggo-tier' : '#ff4e50', 'meh-tier':'#ffa1a2',
		'okay-tier': '#ffffff', 'good-tier':'#75cdff',
		'great-tier':'#08a6ff', 'volxd-tier':'#ff9b00',
	};

	for (let i = 0; i < tierList.length; i++) {
		const dom = await JSDOM.fromURL('https://u.gg/lol/champions/kayle/build?rank=' + tierList[i], {});
		const arr = [];

		for(let j = 0; j < 5; j++) {
			const str = (dom.window.document.getElementsByClassName('value').item(j).innerHTML);
			arr[j] = str.trim();
		}

		const canvas = createCanvas(1015, 90);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = '#222238';
		ctx.fillRect(0, 0, 1015, 90);

		ctx.textBaseline = 'top';
		ctx.textAlign = 'center';

		ctx.font = '700 18px HelveticaNeue';

		// color win rate appropriately
		const winRateTier = dom.window.document.getElementsByClassName('win-rate').item(0).classList;
		ctx.fillStyle = String(wrColors[winRateTier[1].toString()]);
		ctx.fillText(arr[0], xCoords[0], 30);

		ctx.fillStyle = '#ffffff';
		for(let j = 1; j < 5; j++) {
			ctx.fillText(arr[j], xCoords[j], 30);
		}

		ctx.fillStyle = '#92929d';
		ctx.font = '700 11px HelveticaNeue';
		for(let j = 0; j < 5; j++) {
			ctx.fillText(labels[j], xCoords[j], 51);
		}

		const img = new MessageAttachment(canvas.toBuffer('image/png'), tierName[i] + '.png');
		const c = await msg.client.channels.fetch(uggChannelID);
		await c.send(tierName[i], img);
	}
}

function printDateAndPatch(pat, channel, message) {
	const today = new Date();
	// prints date
	message.client.channels.fetch(channel).then(c => c.send(
		'```' +
			today.getDate() +
			'/' +
			(today.getMonth() + 1) +
			'/' +
			today.getFullYear() +
			', Patch ' +
			pat +
			'```',
	));

}

function sendMessage(message, channel, image, text = '') {
	message.client.channels.fetch(channel).then(c => c.send(text, image));
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