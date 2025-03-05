document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("tableBody");
    const selfAppraisal = document.getElementById("selfappraisal");
    const supervisorAppraisal = document.getElementById("supervisorappraisal"); // Add this if needed

    // Fetch existing appraisal data when the page loads
    function fetchAppraisalData() {
        fetch('AppraisalCalculation.php', {
            method: 'GET',
            credentials: 'same-origin', // To send session cookies
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Populate the UI with the fetched data
                selfAppraisal.textContent = data.data.self_appraisal || "0.00";
                supervisorAppraisal.textContent = data.data.supervisor_appraisal || "0.00";
            } else {
                alert('No appraisal data found');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
    }

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

    // Event listener for saving data (self-appraisal and supervisor-appraisal)
    function saveAppraisalData() {
        const selfAppraisalValue = selfAppraisal.textContent;
        const supervisorAppraisalValue = supervisorAppraisal.textContent;
        
        fetch('AppraisalCalculation.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                self_appraisal: selfAppraisalValue,
                supervisor_appraisal: supervisorAppraisalValue
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
            } else {
                alert('Failed to save appraisal data');
            }
        })
        .catch(error => console.error('Error saving data:', error));
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
    
    // Initialize calculations and fetch existing data when page loads
    if (tableBody) {
        calculateTotal();
        handleChanges();
        observer.observe(tableBody, { childList: true });
        fetchAppraisalData(); // Fetch existing appraisal data
    }

    // Add an event listener for the save button or form submission
    document.getElementById("saveAppraisalBtn").addEventListener("click", saveAppraisalData);
});
