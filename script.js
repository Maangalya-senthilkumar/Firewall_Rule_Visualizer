document.getElementById('rule-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const ruleName = document.getElementById('rule-name').value;
    const sourceIP = document.getElementById('source-ip').value;
    const destIP = document.getElementById('dest-ip').value;
    const action = document.getElementById('action').value;
    const protocol = document.getElementById('protocol').value;
    const port = document.getElementById('port').value;

    addRule(ruleName, sourceIP, destIP, action, protocol, port);
});

const ctx1 = document.getElementById('trafficChart').getContext('2d');
const trafficChart = new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: ['Allow', 'Deny'],
        datasets: [{
            label: '# of Rules',
            data: [0, 0],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// Pie Chart
const ctx2 = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(ctx2, {
    type: 'pie',
    data: {
        labels: ['Allow', 'Deny'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)']
        }]
    }
});

// Line Chart
const ctx3 = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(ctx3, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Rules Over Time',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// Radar Chart
const ctx4 = document.getElementById('radarChart').getContext('2d');
const radarChart = new Chart(ctx4, {
    type: 'radar',
    data: {
        labels: ['TCP', 'UDP'],
        datasets: [{
            label: 'Protocol Usage',
            data: [0, 0],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    }
});

// Function to add rules to the table and update all charts
function addRule(name, srcIP, destIP, action, protocol, port) {
    const tableBody = document.querySelector('#rule-table tbody');
    const newRow = tableBody.insertRow();
    
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${srcIP}</td>
        <td>${destIP}</td>
        <td><i class="${action === 'allow' ? 'fas fa-check-circle' : 'fas fa-times-circle'} action-icon"></i>${action.charAt(0).toUpperCase() + action.slice(1)}</td>
        <td>${protocol}</td>
        <td>${port}</td>
        <td><button class="delete-button">Delete</button></td>
    `;

    // Add event listener for delete button
    newRow.querySelector('.delete-button').addEventListener('click', function() {
        tableBody.deleteRow(newRow.rowIndex - 1); // Adjust for the header row
        updateCharts(); // Function to update charts after deletion
    });

    // Update traffic chart
    if (action === 'allow') {
        trafficChart.data.datasets[0].data[0]++;
        pieChart.data.datasets[0].data[0]++;
        lineChart.data.datasets[0].data.push(trafficChart.data.datasets[0].data[0]);
        lineChart.data.labels.push(new Date().toLocaleTimeString());
        radarChart.data.datasets[0].data[protocol.toLowerCase() === 'tcp' ? 0 : 1]++;
    } else {
        trafficChart.data.datasets[0].data[1]++;
        pieChart.data.datasets[0].data[1]++;
    }

    // Update all charts
    trafficChart.update();
    pieChart.update();
    lineChart.update();
    radarChart.update();
}

// Function to update charts after deletion
function updateCharts() {
    trafficChart.data.datasets[0].data = [0, 0];
    pieChart.data.datasets[0].data = [0, 0];

    const rows = document.querySelectorAll('#rule-table tbody tr');
    rows.forEach(row => {
        const action = row.cells[3].textContent.toLowerCase();
        if (action.includes('allow')) {
            trafficChart.data.datasets[0].data[0]++;
            pieChart.data.datasets[0].data[0]++;
        } else {
            trafficChart.data.datasets[0].data[1]++;
            pieChart.data.datasets[0].data[1]++;
        }
    });

    trafficChart.update();
    pieChart.update();
}
