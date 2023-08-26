/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const express = require('express');
const fs = require('fs');
const { Client } = require('pg');
const { JSDOM } = require('jsdom');
const util = require('util');

// Constants
const PORT = 3000;
const HOST = 'localhost';
const client = new Client({
	host: 'localhost',
	user: 'postgres',
	port: 5432,
	password: 'wertex12',
	database: 'practice'
});

// App
const app = express();
client.connect();

app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {

	fs.readFile('./public/info.html', 'utf8', function (err, data) {
		if (err) {
			throw err;
		}
		var document = new JSDOM(data).window.document;
		var tbody = document.querySelector('table.events-field tbody');
		var tr = document.createElement('tr');
		var td = tr.insertCell(0);
		td.textContent = 'new';
		tbody.insertRow(tr);

		var eventCount = document.getElementById('site-event-count').value;
		var curPage = 0;
		var offset = eventCount * curPage;

		const refreshStatus = () => {
			console.log('shi');
			getSize();
			getRows(eventCount, curPage, offset);
		}

		setInterval(refreshStatus, 1000);

		res.write(data);
		res.end();
	});
});

async function getSize() {
	var query = "SELECT reltuples AS estimate FROM pg_class where relname = 'history'";
	client.query(query, (err, res) => {
		if (err) {
			console.log(err.message);
		}
		else {
			var dsd = res.fields;
			console.log(res);
		}
	});
}
async function getRows(_eventCount, _curPage, _offset) {
	var query = util.format("SELECT * FROM history LIMIT %s OFFSET %s;", _eventCount, _offset);
	client.query(query, (err, res) => {
		if (err) {
			console.log(err.message);
		}
		else {
			res.rows.forEach(row => {
				console.log(row);
			});
		}
	});
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);