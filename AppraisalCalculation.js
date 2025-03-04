// AppraisalCalculation.js - Independent Real-Time Calculation
document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("tableBody");

    function parsePercentage(value) {
        return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    }

    function calculateWeightedAverage(row) {
        const weightCell = row.cells[5]; // Column 5 (Weight)
        const scoreCell = row.cells[8];  // Column 8 (Score)
        const resultCell = row.cells[9]; // Column 9 (Weighted Average)
        
        const weight = parsePercentage(weightCell.textContent);
        const score = parsePercentage(scoreCell.textContent);
        const weightedAvg = (weight * score) / 100;
        
        resultCell.textContent = `${weightedAvg.toFixed(2)}%`;
    }

    // Listen for changes in the table
    tableBody.addEventListener("input", function(e) {
        const cell = e.target;
        const row = cell.closest('tr');
        const colIndex = cell.cellIndex;

        // Trigger calculation if column 5 or 8 is edited
        if (colIndex === 5 || colIndex === 8) {
            calculateWeightedAverage(row);
        }
    });
});