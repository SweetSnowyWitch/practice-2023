const express = require('express');
const fs = require('fs');
const { Client } = require('pg');
const { JSDOM } = require('jsdom');

const PORT = 3000;
const HOST = 'localhost';
const client = new Client({
	host: 'localhost',
	user: 'postgres',
	port: 5432,
	password: 'wertex12',
	database: 'practice'
});
const app = express();

client.connect();
app.use(express.static(__dirname + '/public'));
app.get('/', async (req, res) => {
	fs.readFile('./public/info.html', 'utf8', function (err, data) {
		if (err) {
			throw err;
		}

		var window = new JSDOM(data).window;
		const refreshStatus = () => {
			getRows(window);
		}

		setInterval(refreshStatus, 1000);
		res.write(data);
		res.end();
	});
});
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

async function getRows(_window) {
	//var query = util.format("SELECT * FROM history LIMIT %s OFFSET %s;", _eventCount, _offset);
	var query = "SELECT * FROM history;";
	client.query(query, (err, res) => {
		if (err) {
			console.log(err.message);
		}
		else {
			var tbody = _window.document.querySelector('table.events-field tbody');
			tbody.innerHTML = ``;
			res.rows.forEach(
				row => {
					var tr = _window.document.createElement('tr');
					tr.innerHTML = `
											<td id="event-pic"><img class="event-pic-placeholder"></td>
											<td id="event-name">${row.name}</td>
											<td id="event-login">${row.login}</td>
											<td id="event-date">${row.date}</td>`;
					if (`${row.succeed}` === `true`) {
						tr.innerHTML += `
											<td id="event-type">Успешный вход</td>
										`;
					}
					else {
						tr.innerHTML += `
											<td id="event-type">Лицо не найдено</td>
										`;
					}
					tr.style.display = 'none';
					tbody.appendChild(tr);
				});
			pagination(_window, res.rows);
		}
	});
}

function pagination(_window, _rows) {
	var pageNo = parseInt(_window.document.getElementById('page-no').innerHTML);
	var pageReq = _window.document.getElementById('site-event-count').value;
	var pages = _window.document.querySelector('div.pagination-field');
	var pagesCount = Math.ceil(_rows.length / parseInt(pageReq));
	pages.innerHTML = `
						<button class="skip-backward-double" onclick=changePage(1,${pagesCount})></button>
						<button class="skip-backward" onclick=changePage(${pageNo - 1},${pagesCount})></button>
						<p class="pager">1/${pagesCount}</p>
						<button class="skip-forward" onclick=changePage(${pageNo + 1},${pagesCount})></button>
						<button class="skip-forward-double" onclick=changePage(${pagesCount},${pagesCount})></button>
					`;
	fs.writeFile('./public/info.html', _window.document.documentElement.outerHTML, function (err, data) {
		if (err) {
			throw err;
		}
	});
}