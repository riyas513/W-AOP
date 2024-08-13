const API_KEY = 'AIzaSyAqHgj_1K7auasupa9DWsFH1CM_VgIlKE8'; // Replace with your Google Sheets API key
const spreadsheetId = '1icO4rsduRQBH1M5XkFQz-44ZPWdsl6om3AObbMdFr50'; // Replace with your Spreadsheet ID

// Function to fetch data from Google Sheets
function fetchDataFromGoogleSheets(sheetName) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${API_KEY}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            if (rows.length > 0) {
                const headers = rows[0];
                const rowData = rows.slice(1).map(row => {
                    const rowObject = {};
                    headers.forEach((header, index) => {
                        rowObject[header] = row[index];
                    });
                    return rowObject;
                });
                return rowData;
            }
            return [];
        })
        .catch(error => {
            console.error('Error fetching data from Google Sheets:', error);
            return [];
        });
}

function login() {
    const workerId = document.getElementById('login-worker-id').value;
    const name = document.getElementById('login-name').value;
    
    fetchDataFromGoogleSheets('Employee').then(data => {
        const user = data.find(row => row['EMP CODE'] === workerId && row['MOBILE No'] === name);
        if (user) {
            localStorage.setItem('loggedInWorkerId', workerId);
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        } else {
            alert('Invalid EMP Code or Password');
        }
    });
}

