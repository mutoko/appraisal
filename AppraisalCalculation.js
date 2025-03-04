// AppraisalCalculation.js - Standalone Real-Time Calculation
document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("tableBody");
    
    function parsePercentage(value) {
        return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    }

    function calculateRow(row) {
        const weight = parsePercentage(row.cells[5].textContent);
        const score = parsePercentage(row.cells[8].textContent);
        const result = (weight * score) / 100;
        row.cells[9].textContent = `${result.toFixed(2)}%`;
    }

    // Calculate all rows initially
    function calculateAllRows() {
        tableBody.querySelectorAll('tr').forEach(row => {
            calculateRow(row);
        });
    }

    // Calculate when data changes
    function handleChanges() {
        tableBody.addEventListener('input', (e) => {
            const cell = e.target;
            const row = cell.closest('tr');
            if ([5, 8].includes(cell.cellIndex)) {
                calculateRow(row);
            }
        });
    }

    // Observe table for new rows (dynamic data loading)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'TR') calculateRow(node);
            });
        });
    });

    // Start observing
    if (tableBody) {
        calculateAllRows(); // Initial calculation
        handleChanges();    // Input change handler
        observer.observe(tableBody, { childList: true });
    }
});