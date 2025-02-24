      // This function calculates the Weighted Average for each row
      function calculateWeightedAverage() {
        const rows = document.querySelectorAll('#tableBody tr'); // Select all rows in the table body

        rows.forEach(row => {
            const weight = parseFloat(row.querySelector('.weight').textContent) || 0;
            const score = parseFloat(row.querySelector('.score').textContent) || 0;

            // Calculate Weighted Average
            const weightedAverage = (weight * score) / 100;
            row.querySelector('.weightedAverage').textContent = weightedAverage.toFixed(2);
        });
    }

    // This function will be called to populate data from the server (example)
    function populateTable(data) {
        const tableBody = document.getElementById('tableBody');
        
        // Clear existing rows (if any)
        tableBody.innerHTML = '';

        data.forEach(item => {
            // Create a new row and insert the fetched data
            const row = document.createElement('tr');

            row.innerHTML = `
                <td contenteditable="true">${item.perspective}</td>
                <td contenteditable="true">${item.ssmartObjective}</td>
                <td contenteditable="true">${item.initiative}</td>
                <td contenteditable="true">${item.uom}</td>
                <td contenteditable="true">${item.di}</td>
                <td class="weight" contenteditable="true">${item.weight}</td>
                <td contenteditable="true">${item.target}</td>
                <td contenteditable="true">${item.actualAchievement}</td>
                <td class="score" contenteditable="true">${item.score}</td>
                <td class="weightedAverage">0.00</td>
            `;
            
            tableBody.appendChild(row);
        });

        // After populating, trigger the weighted average calculation
        calculateWeightedAverage();
    }

    // Example of how to fetch data from a server and populate the table
    document.getElementById('FetchButton').addEventListener('click', () => {
        // Simulating a fetch call with mock data (replace with your actual fetch logic)
        const mockData = [
            {
                perspective: 'Perspective 1',
                ssmartObjective: 'Objective 1',
                initiative: 'Initiative 1',
                uom: 'Unit 1',
                di: 'D/I 1',
                weight: 50,
                target: '100',
                actualAchievement: '80',
                score: 70
            },
            {
                perspective: 'Perspective 2',
                ssmartObjective: 'Objective 2',
                initiative: 'Initiative 2',
                uom: 'Unit 2',
                di: 'D/I 2',
                weight: 60,
                target: '120',
                actualAchievement: '90',
                score: 80
            }
        ];

        // Populate table with the fetched data
        populateTable(mockData);
    });

    // Recalculate the weighted averages when the user edits a cell
    document.querySelectorAll('#tableBody td').forEach(cell => {
        cell.addEventListener('input', calculateWeightedAverage);
    });