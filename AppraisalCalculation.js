document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("tableBody");
    const selfAppraisal = document.getElementById("selfappraisal");
    
    // Function to parse percentage values from cells
    function parsePercentage(value) {
        return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    }

    // Function to calculate weighted average per row
    function calculateRow(row) {
        const weight = parsePercentage(row.cells[5]?.textContent || "0");
        const score = parsePercentage(row.cells[8]?.textContent || "0");
        const result = (weight * score) / 100;
        row.cells[9].textContent = `${result.toFixed(2)}%`;
    }

    // Function to sum all values in column 9 and update self-appraisal
    function calculateTotal() {
        let total = 0;
        tableBody.querySelectorAll("tr").forEach(row => {
            const weightedAvg = parsePercentage(row.cells[9]?.textContent || "0");
            total += weightedAvg;
        });
        selfAppraisal.textContent = `${total.toFixed(2)}%`;
    }

    // Event listener for real-time recalculation on input changes
    function handleChanges() {
        tableBody.addEventListener("input", (e) => {
            const cell = e.target;
            const row = cell.closest("tr");
            if ([5, 8].includes(cell.cellIndex)) {
                calculateRow(row);
                calculateTotal();
            }
        });
    }

    // Observer to watch for dynamically added rows and recalculate
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === "TR") {
                    calculateRow(node);
                    calculateTotal();
                }
            });
        });
    });
    
    // Initialize calculations when page loads
    if (tableBody) {
        calculateTotal();
        handleChanges();
        observer.observe(tableBody, { childList: true });
    }
});
