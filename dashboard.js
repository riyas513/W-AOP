const API_KEY = '   '; // Replace with your Google Sheets API key

let allData = [];
const loggedInWorkerId = localStorage.getItem('loggedInWorkerId');

// Function to fetch data from Google Sheets
function fetchDataFromGoogleSheets(sheetName, spreadsheetId) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${API_KEY}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);  // Log the API response
            if (!data || !data.values || data.values.length === 0) {
                console.error('No data found or data is undefined:', data);
                return []; // Return an empty array if no data is found
            }

            const rows = data.values;
            const headers = rows[0];
            const rowData = rows.slice(1).map(row => {
                const rowObject = {};
                headers.forEach((header, index) => {
                    rowObject[header] = row[index];
                });
                return rowObject;
            });
            return rowData;
        })
        .catch(error => {
            console.error('Error fetching data from Google Sheets:', error);
            return [];
        });
}

function renderTable(data, tableHeadId, tableBodyId) {
    const tableHead = document.getElementById(tableHeadId);
    const tableBody = document.getElementById(tableBodyId);

    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length > 0) {
        const headers = Object.keys(data[0]);

        // Create a header row with column names
        const headerRow = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = 'Field';
        headerRow.appendChild(th);

        // Add a column for each record
        data.forEach((_, index) => {
            const th = document.createElement('th');
            th.textContent = `Record ${index + 1}`;
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);

        // Populate the table with field names and corresponding values
        headers.forEach(header => {
            const rowElement = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = header;
            rowElement.appendChild(th);

            data.forEach(row => {
                const td = document.createElement('td');
                td.textContent = row[header] || '';
                rowElement.appendChild(td);
            });

            tableBody.appendChild(rowElement);
        });
    }
}


function filterData(data) {
    return data.filter(row => row['EMP CODE'] === loggedInWorkerId);
}

function loadSheetData(type) {
    let selectedSheet;
    let tableHeadId, tableBodyId;
    let selectedSpreadsheetId;

    switch(type) {
        case 'attendance':
            selectedSpreadsheetId = ''; // Replace with actual Spreadsheet ID for Attendance
            selectedSheet = document.getElementById('attendance-sheet-select').value;
            tableHeadId = 'attendance-table-head';
            tableBodyId = 'attendance-table-body';
            break;
        case 'piecerate':
            selectedSpreadsheetId = ''; // Replace with actual Spreadsheet ID for Piecerate
            selectedmonth = document.getElementById('piecerate-sheet-select').value;
            selectedmachine = document.getElementById('worker-combo-select').value;
            selectedSheet = selectedmonth + "_" + selectedmachine;
            tableHeadId = 'piecerate-table-head';
            tableBodyId = 'piecerate-table-body';
            break;
        case 'workingIncentive':
            selectedSpreadsheetId = ''; // Replace with actual Spreadsheet ID for Incentives
            selectedSheet = document.getElementById('working-incentive-sheet-select').value;
            tableHeadId = 'working-incentive-table-head';
            tableBodyId = 'working-incentive-table-body';
            break;
    }

    fetchDataFromGoogleSheets(selectedSheet, selectedSpreadsheetId).then(data => {
        allData = filterData(data);
        renderTable(allData, tableHeadId, tableBodyId);
    });
}

function showAttendance() {
    document.getElementById('attendance-container').style.display = 'block';
    document.getElementById('piecerate-container').style.display = 'none';
    document.getElementById('working-incentive-container').style.display = 'none';
    loadSheetData('attendance');
}

function showPiecerate() {
    document.getElementById('attendance-container').style.display = 'none';
    document.getElementById('piecerate-container').style.display = 'block';
    document.getElementById('working-incentive-container').style.display = 'none';
    loadSheetData('piecerate');
}

function showWorkingIncentive() {
    document.getElementById('attendance-container').style.display = 'none';
    document.getElementById('piecerate-container').style.display = 'none';
    document.getElementById('working-incentive-container').style.display = 'block';
    loadSheetData('workingIncentive');
}
