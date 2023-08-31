function rows2arr(_rows) {
	var rowsArr = []
	for (var i = 0; i < _rows.length; i++) {
		rowsArr.push(_rows[i]);
	}
	return rowsArr;
}

function arr2rows(_tbody, _arr) {
	_tbody.innerHTML = ``;
	_arr.forEach(
		row => {
			var tr = window.document.createElement('tr');
			tr.innerHTML = row.innerHTML;
			tr.style.display = 'none';
			_tbody.appendChild(tr);
		});
}

function changePage(_pageNo, _pagesCount) {
	var pageNo = window.document.getElementById('page-no').innerText;
	var curPage = Math.min(Math.max(_pageNo, 1), _pagesCount);
	window.document.getElementById('page-no').innerText = curPage;
	window.document.querySelector('div.pagination-field p.pager').innerText = `${curPage}/${_pagesCount}`;
	renderRows(null, null);
}

function shouldRender(row) {
	var searchFilter = window.document.getElementById('site-search').value;
	var dateStartFilter = window.document.getElementById('date-start').value;
	var dateEndFilter = window.document.getElementById('date-end').value;
	var typeFilter = window.document.getElementById('site-select-event').value;

	var childData = row.children;
	var childName = childData[1].innerText;
	var childLogin = childData[2].innerText;
	var childDate = childData[3].innerText;
	var childType = childData[4].innerText;

	if (searchFilter != "" && !(childName.includes(searchFilter) || childLogin.includes(searchFilter)))
		return false;
	if (typeFilter != "" && childType != typeFilter)
		return false;
	return true;
}

function sortRows(colName, isAscending) {
	var tbody = window.document.querySelector('table.events-field tbody');
	var sortedRows = rows2arr(tbody.children);

	switch (colName) {
		case 'name':
			sortedRows.sort((a, b) => {
				var aData = a.children[1].innerText;
				var bData = b.children[1].innerText;
				if (aData < bData && isAscending || aData > bData && !isAscending) {
					return 1;
				}
				return -1;
			});
			break;
		case 'login':
			sortedRows.sort((a, b) => {
				var aData = a.children[2].innerText;
				var bData = b.children[2].innerText;
				if (aData < bData && isAscending || aData > bData && !isAscending) {
					return 1;
				}
				return -1;
			});
			break;
		case 'date':
			break;
		case 'type':
			sortedRows.sort((a, b) => {
				var aData = a.children[4].innerText;
				var bData = b.children[4].innerText;
				if (aData < bData && isAscending || aData > bData && !isAscending) {
					return 1;
				}
				return -1;
			});
			break;
		default:
			break;
	}

	return sortedRows;
}

function renderRows(colName, isAscending) {
	var pageNo = window.document.getElementById('page-no').innerText;
	var pageReq = window.document.getElementById('site-event-count').value;
	var tbody = window.document.querySelector('table.events-field tbody');
	var sortedRows = sortRows(colName, isAscending);
	var filteredRows = [];

	for (var i = 0; i < sortedRows.length; i++) {
		if (tbody.children[i].style.display == 'table-row')
			tbody.children[i].style.display = 'none';
		if (shouldRender(sortedRows[i]))
			filteredRows.push(sortedRows[i]);
	}

	arr2rows(tbody, sortedRows);
	for (var i = pageReq * (pageNo - 1); i < Math.min(filteredRows.length, pageReq * pageNo); i++) {
		tbody.children[i].style.display = 'table-row';
	}
}

function resetSearch() {
	window.document.getElementById('page-no').value = '1';
	window.document.getElementById('site-event-count').value = '10';
	window.document.getElementById('site-search').value = '';
	window.document.getElementById('date-start').value = '';
	window.document.getElementById('date-end').value = '';
	window.document.getElementById('site-select-event').value = '';
}