/* eslint-disable no-useless-escape */
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const rp = require('request-promise-native');

const { patchUrl, getChampionByID } = require('./util.js');

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

	const rank = 'platinum_plus';
	const positions = ['jungle', 'supp', 'adc', 'top', 'mid'];

	// TODO: dynamically figure out id

	const champId = (await getChampionByID('Kayle')).key;

	// figure out popular position
	let rgx = RegExp('"' + champId + '" *: *\[[0-5 ,]+]');
	const preferred = JSON.parse('{' + dom.serialize().match(rgx).toString() + '}');
	const pos = positions[preferred[champId.toString()][0] - 1];

	rgx = RegExp('world_' + rank + '_' + pos + '": *{[\n "a-zA-Z0-9:,_.]*?"counters":');
	const fullJson = JSON.parse(dom.serialize().match(rgx).toString().replace(/, *"counters" *: */, '}')
		.replace(RegExp('world_' + rank + '_' + pos + '": *'), ''));

	arr[0] = (fullJson.win_rate);
	arr[1] = (fullJson.pick_rate);
	arr[2] = (fullJson.ban_rate);

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

async function lol() {
	let JSONstr = await rp(patchUrl);
	let data = JSON.parse(JSONstr);
	const patch = parseFloat(data.patches.slice(-1)[0].name).toFixed(2);

	const APIurl = 'https://api.op.lol/champion/3/?patch=' + patch + '&cid=10&lane=default&tier=platinum_plus&queue=420&region=all';
	JSONstr = await rp(APIurl);
	data = JSON.parse(JSONstr);

	// if data is empty
	if(Object.keys(data).length === 0) {
		return {};
	}

	const arr = [];
	arr[0] = data.display.winRate;
	arr[1] = data.display.pickRate;

	// for some reason banrate is a float while the rest are strings
	arr[2] = parseFloat(data.display.banRate).toFixed(2);
	return arr;
}

module.exports = {
	opgg,
	log,
	ugg,
	lol,
};