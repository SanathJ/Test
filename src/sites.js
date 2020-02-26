const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

async function opgg() {
	const dom = await JSDOM.fromURL('https://na.op.gg/champion/kayle/statistics/top/trend', {});
	const arr = [];
	for(let i = 0; i < 3; i++) {
		const str = (dom.window.document.getElementsByClassName('champion-stats-trend-rate').item(i).innerHTML);
		arr[i] = str.trim();
	}
	return arr;
}

async function ugg() {
	const dom = await JSDOM.fromURL('https://u.gg/lol/champions/kayle/build', {});
	const arr = [];

	for(let i = 0; i < 4; i++) {
		const str = (dom.window.document.getElementsByClassName('value').item(i).innerHTML);
		arr[i] = str.trim();
	}
	return arr;
}

async function log() {
	const dom = await JSDOM.fromURL('https://www.leagueofgraphs.com/champions/stats/kayle', {});
	const arr = [];

	// win rate
	let str = (dom.window.document.getElementById('graphDD2').innerHTML);
	arr[0] = str.trim();

	// pick rate
	str = (dom.window.document.getElementById('graphDD1').innerHTML);
	arr[1] = str.trim();

	// ban rate
	str = (dom.window.document.getElementById('graphDD3').innerHTML);
	arr[2] = str.trim();

	// ban rate
	str = (dom.window.document.getElementById('graphDD4').innerHTML);
	arr[3] = str.trim();

	return arr;
}

async function lol() {
	const dom = await JSDOM.fromURL('https://lolalytics.com/lol/kayle/', { runScripts: 'dangerously', resources: 'usable' });
	const arr = [];
	for(let i = 0; i < 5 && i != 2 && i != 1; i++) {
		const str = dom.serialize();
		// arr[i] = str;
		fs.writeFileSync('abc.html', str);
	}
	// return arr;
}

module.exports = {
	opgg,
	lol,
	log,
	ugg
};