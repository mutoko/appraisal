document.addEventListener("DOMContentLoaded", fetchWorkplanData);
const fetchButton = document.getElementById("FetchButton");

let isEditable = false; // Flag to track the edit mode

function fetchWorkplanData() {
    const tableBody = document.getElementById("tableBody");

    fetch("Appraisal.php")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data:", data); 

            if (data.error) {
                console.error("Error from server:", data.error);
                tableBody.innerHTML = `<tr><td colspan='20'>${data.error}</td></tr>`;
                return;
            }

            tableBody.innerHTML = ""; // Clear existing data

            if (data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='20'>No data available</td></tr>";
                return;
            }

            data.forEach(row => {
                const tr = document.createElement("tr");

                // Ensure numeric values are displayed as percentages
                const weightPercentage = row["WeightSSMARTAObjective"] ? `${row["WeightSSMARTAObjective"]}%` : "0%";
                const weight2Percentage = row["Supervisor_WeightSSMARTAObjective"] ? `${row["Supervisor_WeightSSMARTAObjective"]}%` : "0%";

                const targetPercentage = row.TargetSSMARTAObjective ? `${row.TargetSSMARTAObjective}%` : "0%";
                const target2Percentage = row.Supervisor_TargetSSMARTAObjective ? `${row.Supervisor_TargetSSMARTAObjective}%` : "0%";

                tr.innerHTML = `
                    <td contenteditable="false"><strong>${row.Perspectives || ""}</strong></td>
                    <td contenteditable="false">${row.SSMARTAObjectives	 || ""}</td>
                    <td contenteditable="false">${row.Initiatives || ""}</td>
                    <td contenteditable="false">${row.UoM || ""}</td>
                    <td contenteditable="false">${row.DI || ""}</td>
                    <td contenteditable="false">${weightPercentage}</td>
                    <td contenteditable="false">${targetPercentage}</td>
                    <td contenteditable="false">${row.Annual_Actual_Achievement || ""}</td>
                    <td contenteditable="false">${row.Annual_Score || ""}</td>
                    <td contenteditable="false">${row.Annual_Weighted_Average || ""}</td>
                    <td contenteditable="false">${row.Annual_Detailed_Explanation || ""}</td>
                    <td contenteditable="false">${row.Annual_Evidence || ""}</td>
                    <td contenteditable="false">${weight2Percentage}</td>
                    <td contenteditable="false">${target2Percentage}</td>
                    <td contenteditable="false">${row.Supervisor_ActualAchievement || ""}</td>
                    <td contenteditable="false">${row.Supervisor_Score || ""}</td>
                    <td contenteditable="false">${row.Supervisor_Weighted_Average || ""}</td>
                    <td contenteditable="false">${row.Supervisor_Comments || ""}</td>
                    <td contenteditable="false">${row.Supervisor_IdentifiedGaps || ""}</td>
                    <td contenteditable="false">${row.Supervisor_Strategies || ""}</td>
                `;

                tableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Fetch error:", error);
            tableBody.innerHTML = "<tr><td colspan='20'>Error loading data</td></tr>";
        });
  
}
