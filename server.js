/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const express = require('express');
const fs = require('fs');

// Constants
const PORT = 3000;
const HOST = 'localhost';

// App
const app = express();

app.get('/', (req, res) => {
	res.send('Hello remote world!\n');
});

app.get('/info', (req, res) => {
	fs.readFile('./public/info.html', null, function (error, data) {
		if (error) {
			res.writeHead(404);
			res.write('Whoops! File not found!');
		} else {
			res.write(data);
		}
		res.end();
	});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);