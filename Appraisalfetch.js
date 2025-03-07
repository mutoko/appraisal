document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("tableBody");
    const fetchButton = document.getElementById("FetchButton");
    const progressContainer = document.getElementById("progressContainer");
    const progressBar = document.getElementById("progressBar");

    if (!tableBody || !fetchButton || !progressContainer || !progressBar) {
        console.error("One or more required elements not found in the document.");
        return;
    }

    fetchButton.addEventListener("click", function () {
        progressContainer.style.display = "block"; // Show progress bar
        animateProgressBar();
        fetchEmployeesData();
    });

    function animateProgressBar() {
        let progress = 0;
        progressBar.style.width = "0%";
        progressBar.innerText = "0%";

        const interval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(interval);
            } else {
                progress += 10;
                progressBar.style.width = progress + "%";
                progressBar.innerText = progress + "%";
            }
        }, 200);
    }

    function fetchEmployeesData() {
        fetch("Appraisalfetch.php")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched data:", data); // Debugging

                tableBody.innerHTML = ""; // Clear existing rows

                if (!Array.isArray(data) || data.length === 0 || (data.length === 1 && data[0].message)) {
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = `<td colspan="20" style="text-align:center; color:red;">
                        ${data[0]?.message || "No data found, consult your supervisor."}
                    </td>`;
                    tableBody.appendChild(newRow);
                } else {
                    data.forEach((row) => {
                        const weightPercentage = row.WeightSSMARTAObjective ? `${row.WeightSSMARTAObjective}%` : "0%";
                        const targetPercentage = row.TargetSSMARTAObjective ? `${row.TargetSSMARTAObjective}%` : "0%";

                        const weightPercentage2 = row.WeightSSMARTAObjective ? `${row.WeightSSMARTAObjective}%` : "0%";
                        const targetPercentage2 = row.TargetSSMARTAObjective ? `${row.TargetSSMARTAObjective}%` : "0%";

                         // Modify UoM and DI columns as needed
                         const uomValue = "I";  // Set "I" for DI column
                         const diValue = "%";  // Set percentage for UoM column
                         const achievementValue = "100%";  // Set default value for achievement column 
                         const score = "100%";  // Set default value for score column
 
                         const newRow = document.createElement("tr");
                         newRow.innerHTML = `
                             <td contenteditable="false"><strong>${row.Perspectives || ""}</strong></td>
                             <td contenteditable="false">${row.SSMARTAObjectives || ""}</td>
                             <td contenteditable="false">${row.Initiatives || ""}</td>
                             <td contenteditable="false">${diValue}</td> <!-- Updated DI column -->
                             <td contenteditable="false">${uomValue}</td> <!-- Updated UoM column -->
                             <td contenteditable="false">${row.WeightSSMARTAObjective || "0%"}</td>
                             <td contenteditable="false">${row.TargetSSMARTAObjective || "0%"}</td>
                             <td contenteditable="false">${achievementValue}</td>
                             <td contenteditable="false">${score}</td>
                             <td contenteditable="false"></td>
                             <td contenteditable="false"></td>
                             <td contenteditable="false"></td>
                             <td contenteditable="false">${row.WeightSSMARTAObjective || "0%"}</td>
                             <td contenteditable="false">${row.TargetSSMARTAObjective || "0%"}</td>
                             <td contenteditable="false">${achievementValue}</td>
                             <td contenteditable="false">${score}</td>
                             <td contenteditable="false"></td>
                             <td contenteditable="false"></td>
                             <td contenteditable="false"></td>
                             <td contenteditable="false"></td>
                        `;
                        tableBody.appendChild(newRow);
                    });
                }
            })
            .catch((error) => console.error("Error fetching employees data:", error))
            .finally(() => {
                progressBar.style.width = "100%";
                progressBar.innerText = "100%";
                setTimeout(() => {
                    progressContainer.style.display = "none"; // Hide after completion
                }, 1000);
            });
    }
});
document.getElementById("editButton").addEventListener("click", function () {
    const table = document.getElementById("editableTable");
    const rows = table.getElementsByTagName("tr");
    let isEditable = table.classList.contains("dashed-border"); // Check if already editable

    for (let i = 1; i < rows.length; i++) { // Skip header row
        const cells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < cells.length; j++) {
            if (j === 3 || j === 6 || j === 7 || j === 10 || j === 11) { // Only make column 4,8,10 and 11 editable
                cells[j].contentEditable = !isEditable ? "true" : "false";
            } else {
                cells[j].contentEditable = "false"; // Keep all other columns uneditable
            }
        }
    }

    // Toggle button text between "Appraise" and "Done"
    const button = document.getElementById("editButton");
    if (button.textContent.trim() === "Appraise") {
        button.textContent = "Done";
    } else {
        button.textContent = "Appraise";
    }

    // Add or remove dashed border style
    table.classList.toggle("dashed-border");
});

