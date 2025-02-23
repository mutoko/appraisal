document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("tableBody");

    function calculateWeightedAverage(row) {
        const weightCell = row.cells[5];  // 6th column (Weight on SSMARTA Objective %)
        const scoreCell = row.cells[8];   // 9th column (Score)
        const weightedAvgCell = row.cells[9]; // 10th column (Weighted Average)

        let weight = parseFloat(weightCell.textContent.trim()) || 0;
        let score = parseFloat(scoreCell.textContent.trim()) || 0;

        // Ensure score is between 0 and 100
        score = Math.max(0, Math.min(100, score));

        // Calculate weighted average
        let weightedAverage = (weight * score) / 100;

        // Display the calculated value in the Weighted Average cell
        weightedAvgCell.textContent = weightedAverage.toFixed(2) + "%";

        // Send data to the server for saving
        sendDataToServer(row, weight, score, weightedAverage);
    }

    function sendDataToServer(row, weight, score, weightedAverage) {
        const id = row.getAttribute("data-id"); // Assuming each row has a unique ID

        fetch("appraisalcalc.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `weight=${weight}&score=${score}&weighted_average=${weightedAverage}&id=${id}`
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server Response:", data);
        })
        .catch(error => console.error("Error:", error));
    }

    // Function to calculate all rows on page load
    function calculateAllRows() {
        document.querySelectorAll("#tableBody tr").forEach(row => {
            calculateWeightedAverage(row);
        });
    }

    // Attach event listener to update Weighted Average when Score changes
    tableBody.addEventListener("input", function (event) {
        let row = event.target.closest("tr");
        if (row) {
            calculateWeightedAverage(row);
        }
    });

    // Run calculations on page load
    calculateAllRows();
});
