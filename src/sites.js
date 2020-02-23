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

async function lol() {
	const dom = await JSDOM.fromURL('https://lolalytics.com/lol/kayle/', {runScripts: "dangerously", resources: "usable"});
	const arr = [];
	for(let i = 0; i < 5 && i != 2 && i != 1; i++) {
		const str = dom.serialize();//.window.document;// .getElementsByClassName("championstats").length;// .childNodes[i].innerHTML.split('<br>')[0];
		// arr[i] = str;
		fs.writeFileSync('abc.html', str);
	}
	// return arr;
}

module.exports = {
	opgg,
	lol,
};