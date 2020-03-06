const sqlite = require('sqlite');
const { format } = require('util');
const { patchUrl } = require('./util.js');
const request = require('request');

let db;

async function init() {
	db = await sqlite.open('./data.db');
	console.log('Connected to the data database.');
}

function close() {
	db.close();
}

async function row(sql, date) {
	let r;
	try{
		r = await db.get(sql, date);
		return r;
	}
	catch (err) {
		return console.error(err.message);
	}
}

function insert(table, values) {
	// formats present date as YYYY-MM_DD
	const today = new Date();
	const chk = today.getFullYear() + '-'
					+ ('0' + (today.getMonth() + 1)).slice(-2) + '-'
					+ ('0' + today.getDate()).slice(-2);

	request.get(patchUrl, async function(error, response, body) {
		if (!error && response.statusCode == 200) {
			const data = JSON.parse(body);
			const patch = parseFloat(data.patches.slice(-1)[0].name);
			await db.run(format('INSERT OR REPLACE INTO %s VALUES(?, ?, ?, ?, ?)', table), chk, patch, values[0], values[1], values[2]);
		}
	});
}

async function backup() {
	try{
		await db.run('VACUUM');
		const directory = __dirname;
		await db.run('VACUUM main INTO ?', directory + '/../backup.db');
	}
	catch(err) {
		console.log(err);
	}
}

module.exports = {
	init,
	close,
	row,
	insert,
	backup,
};