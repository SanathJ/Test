const sqlite = require('sqlite');

let db;

async function init() {
	db = await sqlite.open('./data.db');
	console.log('Connected to the data database.');
}

function close() {
	db.close();
}

async function test(sql, date) {
	let row;
	try{
		row = await db.get(sql, date);
		return row;
	}
	catch (err) {
		return console.error(err.message);
	}
}

module.exports = {
	init,
	close,
	test,
};