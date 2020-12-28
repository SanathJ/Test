const { MessageAttachment } = require('discord.js');
const request = require('request');
const Jimp = require('jimp');
const rp = require('request-promise-native');
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
const LOGYellow = '#FDB05F';

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
	const chartColors = [LOGBlue, LOGGreen, LOGRed, LOGYellow];
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

// draws a line in ctx from (x1, y1) to (x2, y2)
function drawLine(ctx, x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
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
	drawLine(ctx, 22, 48, 525, 48);

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
			drawLine(ctx, 22, 112 + 44 + yOffset, 525, 112 + 44 + yOffset);
		}

		yOffset += 55;
	}

	const img = new MessageAttachment(canvas.toBuffer('image/png'), 'log' + n + '.png');
	return channel.send('', img);
}

async function log3(dom, channel, n) {

	// only need physical and magic damage, the rest is true
	const data = [];
	const bars = dom.window.document.getElementsByClassName('stacked_bar')[0]
		.getElementsByClassName('stacked_bar_area');
	for(const i of bars) {
		data.push(parseFloat(i.getAttribute('tooltip')));
	}

	const canvas = createCanvas(600, 150);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = LOGBgColor;
	ctx.fillRect(0, 0, 600, 150);

	// Title
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.font = '500 24px Roboto';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Damage Dealt', 20, 15);

	ctx.strokeStyle = LOGDividerColor;
	drawLine(ctx, 20 - 2, 15 + 40, 600 - (20 - 2), 15 + 40);

	// full bar width and height
	const barWidth = 600 - 2 * (20 - 2) - 2 * 10;
	const barHeight = 40;

	// draw bars
	// true damage
	ctx.fillStyle = '#aaaaaa';
	ctx.fillRect(20 + 5, 15 + 40 + 15, barWidth, barHeight);
	// magic damage
	ctx.fillStyle = LOGBlue;
	ctx.fillRect(20 + 5, 15 + 40 + 15, ((data[0] + data[1]) / 100) * barWidth, barHeight);
	// physical damage
	ctx.fillStyle = LOGRed;
	ctx.fillRect(20 + 5, 15 + 40 + 15, (data[0] / 100) * barWidth, barHeight);

	// legend text
	ctx.fillStyle = '#ffffff';
	ctx.font = '400 12px Roboto';
	const legendSize = 16;
	const leftPadding = 2;
	const rightPadding = 5;

	// draw legend
	// physical
	let textWidth = ctx.measureText('Physical').width;
	ctx.fillText('Physical', 600 / 2 - (legendSize / 2) - rightPadding - textWidth,
		15 + 40 + 15 + barHeight + 10);
	ctx.fillStyle = LOGRed;
	ctx.fillRect(600 / 2 - (legendSize / 2) - rightPadding - textWidth - leftPadding - legendSize,
		15 + 40 + 15 + barHeight + 10 - 2, legendSize, legendSize);

	// magic
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Magic', 600 / 2 + (legendSize / 2) + leftPadding, 15 + 40 + 15 + barHeight + 10);
	ctx.fillStyle = LOGBlue;
	ctx.fillRect(600 / 2 - (legendSize / 2), 15 + 40 + 15 + barHeight + 10 - 2,
		legendSize, legendSize);

	// true
	textWidth = ctx.measureText('Magic').width;
	ctx.fillStyle = '#ffffff';
	ctx.fillText('True', 600 / 2 + (legendSize / 2) + leftPadding + textWidth + rightPadding + legendSize + leftPadding,
		15 + 40 + 15 + barHeight + 10);
	ctx.fillStyle = '#aaaaaa';
	ctx.fillRect(600 / 2 + (legendSize / 2) + leftPadding + textWidth + rightPadding, 15 + 40 + 15 + barHeight + 10 - 2,
		legendSize, legendSize);

	const img = new MessageAttachment(canvas.toBuffer('image/png'), 'log' + n + '.png');
	return channel.send('', img);
}

function log4helper(ctx, data) {
	const labels = ['PentaKill', 'Gold', 'Minions', 'Wards', 'Damage Dealt'];
	const indices = ['penta', 'gold', 'minions', 'wards', 'damage'];
	const xOffsets = [0, 0, 420, 0, 420];
	const yOffsets = [0, 210, 210, 420, 420];

	for (let i = 0; i < 5; i++) {
		// value
		ctx.textAlign = 'center';
		ctx.font = '300 56px Roboto';
		ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
		ctx.fillText(data[indices[i]].value, (800 - 40) / 4 + xOffsets[i], 10 + 210 + 170 / 2 + yOffsets[i]);
		// label
		ctx.textAlign = 'left';
		ctx.font = '300 36px Roboto';
		const fullTextWidth = ctx.measureText(labels[i]).width;
		ctx.fillStyle = 'rgba(255, 255, 255, 0.43)';
		ctx.fillText(labels[i], (800 - 40) / 4 - fullTextWidth / 2 + xOffsets[i], 10 + 210 + 170 / 2 + 50 + yOffsets[i]);
	}
}

async function log4(dom, channel, n) {
	const canvas = createCanvas(800, 800);
	const ctx = canvas.getContext('2d');

	/**
	 * parse data
	 */
	const data = {
		kda: {},
		penta: {},
		gold: {},
		minions: {},
		wards: {},
		damage: {},
		multiKills: {
			quadra: {},
			triple: {},
			double: {},
		},
	};

	data.kda.kills = dom.window.document.getElementsByClassName('kills')[0].innerHTML;
	data.kda.deaths = dom.window.document.getElementsByClassName('deaths')[0].innerHTML;
	data.kda.assists = dom.window.document.getElementsByClassName('assists')[0].innerHTML;

	const labels = ['penta', 'gold', 'minions', 'wards', 'damage'];
	for(let i = 2; i < dom.window.document.getElementsByClassName('number').length; i++) {
		data[labels[i - 2]].value = dom.window.document.getElementsByClassName('number')[i].innerHTML.trim();
	}
	const smallLabels = ['quadra', 'triple', 'double'];
	for(let i = 1; i < dom.window.document.getElementsByClassName('number-small').length; i++) {
		data.multiKills[smallLabels[i - 1]].value = parseFloat(dom.window.document.getElementsByClassName('number-small')[i].textContent).toFixed(4);
	}
	for(let i = 0; i < dom.window.document.getElementsByClassName('number-legend-small').length; i++) {
		data.multiKills[smallLabels[i]].rank = dom.window.document.getElementsByClassName('number-legend-small')[i].innerHTML.trim();
	}

	// background
	ctx.fillStyle = LOGBgColor;
	ctx.fillRect(0, 0, 800, 800);

	// dividers
	ctx.fillStyle = LOGDividerColor;
	ctx.fillRect(0, 170, 800, 40);
	ctx.fillRect(0, 170 + 210, 800, 40);
	ctx.fillRect(0, 170 + 420, 800, 40);
	ctx.fillRect(800 / 2 - 40 / 2, 170, 40, 800 - 170);


	/**
	 * KDA
	 */
	ctx.fillStyle = LOGGreen;
	ctx.font = '400 56px Roboto';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'bottom';
	const fullTextWidth = ctx.measureText(data.kda.kills + ' / ' + data.kda.deaths + ' / ' + data.kda.assists).width;
	ctx.textAlign = 'left';
	// kills
	ctx.fillText(data.kda.kills, 800 / 2 - fullTextWidth / 2, 170 / 2 + 10);
	// separator
	ctx.font = '300 56px Roboto';
	ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
	let partialTextWidth = ctx.measureText(data.kda.kills + ' ').width;
	ctx.fillText('/', 800 / 2 - fullTextWidth / 2 + partialTextWidth, 170 / 2 + 10);
	// deaths
	ctx.font = '400 56px Roboto';
	ctx.fillStyle = LOGRed;
	partialTextWidth = ctx.measureText(data.kda.kills + ' / ').width;
	ctx.fillText(data.kda.deaths, 800 / 2 - fullTextWidth / 2 + partialTextWidth, 170 / 2 + 10);
	// separator
	ctx.font = '300 56px Roboto';
	ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
	partialTextWidth = ctx.measureText(data.kda.kills + ' / ' + data.kda.deaths + ' ').width;
	ctx.fillText('/', 800 / 2 - fullTextWidth / 2 + partialTextWidth, 170 / 2 + 10);
	// assists
	ctx.font = '400 56px Roboto';
	ctx.fillStyle = LOGYellow;
	partialTextWidth = ctx.measureText(data.kda.kills + ' / ' + data.kda.deaths + ' / ').width;
	ctx.fillText(data.kda.assists, 800 / 2 - fullTextWidth / 2 + partialTextWidth, 170 / 2 + 10);
	// label
	ctx.textAlign = 'center';
	ctx.font = '300 36px Roboto';
	ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.fillText('Average KDA', 800 / 2, 170 / 2 + 60);


	// draw most data except multikills
	log4helper(ctx, data);

	/**
	 * multikills
	 */
	const initialX = 15 + (800 - 40) / 2 + 40;
	// can get centered y values by: topY + (boxSize / 6)(2n + 1)
	const topY = 170 + 40;
	ctx.textBaseline = 'middle';
	const types = ['Quadra', 'Triple', 'Double'];

	for (let i = 0; i < 3; i++) {
		const currentY = topY + (170 / 6) * (2 * i + 1);
		// value
		ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
		ctx.font = '300 32px Roboto';
		ctx.fillText(parseFloat(data.multiKills[types[i].toLowerCase()].value).toFixed(4), initialX, currentY);
		partialTextWidth = ctx.measureText(parseFloat(data.multiKills[types[i].toLowerCase()].value).toFixed(4) + ' ').width;
		// label
		ctx.fillStyle = 'rgba(255, 255, 255, 0.43)';
		ctx.font = '300 24px Roboto';
		ctx.fillText(types[i] + ' Kill', initialX + partialTextWidth, currentY);
		partialTextWidth += ctx.measureText(types[i] + ' Kill ').width;
	}


	/**
	 * Send image
	 */

	const img = new MessageAttachment(canvas.toBuffer('image/png'), 'log' + n + '.png');
	return channel.send('', img);
}

async function log5(dom, channel, n, data) {
	// initialise canvas
	const width = 500;
	const height = 400;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = LOGBgColor;
	ctx.fillRect(0, 0, width, height);

	// Title
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.font = '500 24px Roboto';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Winrate History', 23, 13);

	// divider
	ctx.strokeStyle = LOGDividerColor;
	const margin = 30;
	drawLine(ctx, margin, 50, width - margin, 50);

	const x = d3.scaleUtc()
		.domain(d3.extent(data, d => d[0]))
		.range([margin, width - margin]);

	const y = d3.scaleLinear()
		.domain([d3.min(data, d => d[1]), Math.ceil(d3.max(data, d => d[1]) / 5) * 5])
		.range([height - 30, 70]);


	ctx.textAlign = 'center';
	ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.font = '400 12px Roboto';

	// y-axis
	ctx.textBaseline = 'middle';
	const ymin = y(d3.min(data, d => d[1]));
	const ymax = y(Math.ceil(d3.max(data, d => d[1]) / 5) * 5);
	const yslope = (ymax - ymin) / (Math.ceil(d3.max(data, d => d[1]) / 5) * 5 - d3.min(data, d => d[1]));
	const yc = ymax - (Math.ceil(d3.max(data, d => d[1]) / 5) * 5) * yslope;
	let f = d => yslope * d + yc;

	for(let d = Math.ceil(d3.max(data, e => e[1]) / 5) * 5; d > d3.min(data, e => e[1]); d -= 5) {
		drawLine(ctx, margin, f(d), width - margin, f(d));
		ctx.fillText(d.toString() + '%', 15, f(d));
	}
	drawLine(ctx, margin, ymin, width - margin, ymin);

	// x-axis
	ctx.textBaseline = 'top';
	const xmin = x(d3.min(data, d => d[0]));
	const xmax = x(d3.max(data, d => d[0]));
	const xslope = (xmax - xmin) / (d3.max(data, d => d[0]) - d3.min(data, d => d[0]));
	const xc = xmax - d3.max(data, d => d[0]) * xslope;
	f = d => xslope * d + xc;

	// starts at 2015, 1 per year
	for(let d = 1420070400000, year = 2015; d < d3.max(data, e => e[0]); d += 31536000000, year++) {
		drawLine(ctx, f(d), height - 30, f(d), 70);
		ctx.fillText(year.toString(), f(d), height - 30 + 6);
	}
	drawLine(ctx, xmin, height - 30, xmin, 70);
	drawLine(ctx, xmax, height - 30, xmax, 70);

	const line = d3.line()
		.x(d => x(d[0]))
		.y(d => y(d[1]))
		.context(ctx);

	ctx.strokeStyle = LOGGreen;
	ctx.lineWidth = 2;
	ctx.beginPath();
	line(data);
	ctx.stroke();

	const area = d3.area()
		.x(d => x(d[0]))
		.y1(d => y(d[1]))
		.y0(y(d3.min(data, d => d[1])))
		.context(ctx);

	ctx.fillStyle = 'rgba(45, 235, 144, 0.3)';
	ctx.beginPath();
	area(data);
	ctx.fill();

	/**
	 * Send image
	 */

	const img = new MessageAttachment(canvas.toBuffer('image/png'), 'log' + n + '.png');
	return channel.send('', img);
}

async function calllog(msg) {
	const dom = await JSDOM.fromURL('https://www.leagueofgraphs.com/champions/stats/kayle', {});
	const channel = await msg.client.channels.fetch(logChannelID);

	await log1(dom, channel, 1);
	await log2(dom, channel, 2);
	await log3(dom, channel, 3);
	await log4(dom, channel, 4);

	// data for graphs
	const rgx = /data: \[\[.+]]/g;
	const matches = dom.serialize().match(rgx);

	// convert to valid json before parsing
	await log5(dom, channel, 5, JSON.parse(('{' + matches[1] + '}').replace('data', '"data"')).data);
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

		const positions = ['jungle', 'supp', 'adc', 'top', 'mid'];
		const champId = (await getChampionByID('Kayle')).key;

		// figure out popular position
		let rgx = RegExp('"' + champId + '" *: *\[[0-5 ,]+]');
		const preferred = JSON.parse('{' + dom.serialize().match(rgx).toString() + '}');
		const pos = positions[preferred[champId.toString()][0] - 1];

		rgx = RegExp('world_' + tierList[i] + '_' + pos + '": *{[\n "a-zA-Z0-9:,_.]*?"counters":');
		const fullJson = JSON.parse(dom.serialize().match(rgx).toString().replace(/, *"counters" *: */, '}')
			.replace(RegExp('world_' + tierList[i] + '_' + pos + '": *'), ''));

		console.log(fullJson);
		arr[0] = fullJson.win_rate;
		arr[1] = `${fullJson.rank !== null ? fullJson.rank : '?'} / ${fullJson.total_rank !== null ? fullJson.total_rank : '?'}`;
		arr[2] = fullJson.pick_rate + '%';
		arr[3] = fullJson.ban_rate + '%';
		arr[4] = new Intl.NumberFormat('en-US').format(fullJson.matches);


		const canvas = createCanvas(1015, 90);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = '#222238';
		ctx.fillRect(0, 0, 1015, 90);

		ctx.textBaseline = 'top';
		ctx.textAlign = 'center';

		ctx.font = '700 18px HelveticaNeue';

		// color win rate appropriately
		const winrateTier = !arr[0] || isNaN(arr[0]) ? '' : arr[0] < 45 ?
			'shinggo-tier' : arr[0] < 48.5 ? 'meh-tier' : arr[0] < 51.5 ?
				'okay-tier' : arr[0] < 53 ? 'good-tier' : arr[0] < 55 ? 'great-tier' : 'volxd-tier';

		ctx.fillStyle = String(wrColors[winrateTier]);
		ctx.fillText(arr[0] + '%', xCoords[0], 30);

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


const championJson = {};

async function getLatestChampionDDragon(language = 'en_US') {
	if (championJson[language]) {
		return championJson[language].data;
	}

	let response;
	let versionIndex = 0;
	// I loop over versions because 9.22.1 is broken
	do {
		const data = JSON.parse(await rp('http://ddragon.leagueoflegends.com/api/versions.json'));
		const version = data[versionIndex++];

		try {
			response = await rp(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`, {});
			break;
		}
		catch {
			console.log('ddragon doesn\'t have data, trying another patch');
		}
	} while(!response);

	championJson[language] = JSON.parse(response);
	return championJson[language].data;
}

// NOTE: IN DDRAGON THE ID IS THE CLEAN NAME!!! It's also super-inconsistent, and broken at times.
// Cho'gath => Chogath, Wukong => Monkeyking, Fiddlesticks => Fiddlesticks/FiddleSticks (depending on what mood DDragon is in this patch)
async function getChampionByID(name, language = 'en_US') {
	return (await getLatestChampionDDragon(language))[name];
}

module.exports = {
	calllog,
	calllol,
	callopgg,
	callugg,
	getPatch,
	printDateAndPatch,
	getChampionByID,
	logChannelID,
	lolChannelID,
	opggChannelID,
	uggChannelID,
	patchUrl,
};