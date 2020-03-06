const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function opgg() {
	const dom = await JSDOM.fromURL('https://na.op.gg/champion/kayle/statistics/top/trend', {});
	const arr = [];
	for(let i = 0; i < 3; i++) {
		const str = (dom.window.document.getElementsByClassName('champion-stats-trend-rate').item(i).innerHTML);
		arr[i] = str.trim().replace('%', '');
	}
	return arr;
}

async function ugg() {
	const dom = await JSDOM.fromURL('https://u.gg/lol/champions/kayle/build', {});
	const arr = [];

	for(let i = 0; i < 4; i++) {
		const str = (dom.window.document.getElementsByClassName('value').item(i).innerHTML);
		arr[i] = str.trim().replace('%', '');
	}
	arr.splice(1, 1);
	return arr;
}

async function log() {
	const dom = await JSDOM.fromURL('https://www.leagueofgraphs.com/champions/stats/kayle', {});
	const arr = [];

	// win rate
	let str = (dom.window.document.getElementById('graphDD2').innerHTML);
	arr[0] = str.trim().replace('%', '');

	// pick rate
	str = (dom.window.document.getElementById('graphDD1').innerHTML);
	arr[1] = str.trim().replace('%', '');

	// ban rate
	str = (dom.window.document.getElementById('graphDD3').innerHTML);
	arr[2] = str.trim().replace('%', '');

	return arr;
}

module.exports = {
	opgg,
	log,
	ugg,
};