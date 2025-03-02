document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("tableBody");
  const submitButton = document.getElementById("submitButton"); // Reference to the submit button
  const FetchButton = document.getElementById("FetchButton");


  if (!tableBody) {
    console.error("Table body not found!");
    return;
  }

  let isEditable = false; // Tracks whether the table is in edit mode

  // Fetch data when the page loads up
  fetch("appraisal.php", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
   })
   .then((response) => response.json()) // Parse JSON response
   .then((data) => {
    // Loop through the data and dynamically create rows in the t
    data.forEach((rowData) => {
        const newRow = document.createElement("tr");

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

        // Append new row to table body
        tableBody.appendChild(newRow);

        // Attach event listeners for add and delete actions
        attachRowListeners(newRow);
    });
 })

  // Toggle editable mode on the table
  document.getElementById("editButton").addEventListener("click", function () {
    const rows = tableBody.querySelectorAll("tr");
    isEditable = !isEditable;

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      cells.forEach((cell) => {
        cell.contentEditable = isEditable.toString();
      });
    });

    
    document.getElementById("editableTable").classList.toggle("dashed-border", isEditable);

    // Toggle the visibility of the Add Row and Delete Row buttons
    addRowButton.style.display = isEditable ? "inline-block" : "none";

    // Change button text between "Edit" and "Done"
    this.innerText = isEditable ? "Done" : "Edit";
  });

 
// Formats a number as a percentage 2 decimal places
  function formatPercentage(value) {
    let num = parseFloat(value);
    return !isNaN(num) ? num.toFixed(2) + "%" : "0.00%";
  }
// Function to validate if the sum of WeightSSMARTAObjective does not exceed 100%
  function checkColumnSumValidity() {
    let totalWeight = 0;
    let isValid = true;

    document.querySelectorAll("#tableBody tr").forEach((row) => {
      let weightCell = row.cells[3]; // Targeting WeightSSMARTAObjective column
      let weight = parseFloat(weightCell.innerText.replace("%", "")) || 0;
      totalWeight += weight;
    });

    if (totalWeight > 100) {
      alert("Error: The total sum of WeightSSMARTAObjective should not exceed 100%.");
      isValid = false;
    }

    return isValid;
  }
// Function to validate if TargetSSMARTAObjective does not exceed 100%
  function checkTargetValue() {
    let isValid = true;
    document.querySelectorAll("#tableBody tr").forEach((row) => {
      let targetCell = row.cells[4]; // Targeting TargetSSMARTAObjective column
      let target = parseFloat(targetCell.innerText.replace("%", "")) || 0;
      if (target > 100) {
        alert("Error: TargetSSMARTAObjective value cannot exceed 100%.");
        isValid = false;
      }
    });
    return isValid;
  }

// Event listener for the Submit button
  document.getElementById("submitButton").addEventListener("click", function (event) {
     // Prevent submission if validation fails
    if (!checkColumnSumValidity() || !checkTargetValue()) {
      event.preventDefault();
      return;
    }

    const rows = tableBody.querySelectorAll("tr");
    const submittedData = [];
    
// Extracting table data into an array of objects
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        const rowData = {
          Perspectives: cells[0].innerText.trim(),
        SSMARTAObjectives: cells[1].innerText.trim(),
        Initiatives: cells[2].innerText.trim(),
        UoM: cells[3].innerText.trim(),
        DI: cells[4].innerText.trim(),
        WeightSSMARTAObjective: cells[5].innerText.trim(),
        TargetSSMARTAObjective: cells[6].innerText.trim(),
        Annual_Actual_Achievement: cells[7].innerText.trim(),
        Annual_Score: cells[8].innerText.trim(),
        Annual_Weighted_Average: cells[9].innerText.trim(),
        Annual_Detailed_Explanation: cells[10].innerText.trim(),
        Annual_Evidence: cells[11].innerText.trim(),
        Supervisor_WeightSSMARTAObjective: cells[12].innerText.trim(),
        Supervisor_TargetSSMARTAObjective: cells[13].innerText.trim(),
        Supervisor_ActualAchievement: cells[14].innerText.trim(),
        Supervisor_Score: cells[15].innerText.trim(),
        Supervisor_Weighted_Average: cells[16].innerText.trim(),
        Supervisor_Comments: cells[17].innerText.trim(),
        Supervisor_IdentifiedGaps: cells[18].innerText.trim(),
        Supervisor_Strategies: cells[19].innerText.trim()
        };
        submittedData.push(rowData);
      });

      // Send data to the server
      fetch("appraisal.php", {
        method: "POST",
        headers: {"Content-Type": "application/json", // Use application/json
        },
        body: JSON.stringify({ submittedData }), // Send data as JSON
      })
        .then((response) => response.text())
        .then((message) => {
          alert(message);
          location.reload();
        })
        .catch((error) => console.error("Error submitting data:", error));
    });

  // Attach listeners for add and delete links
  function attachRowListeners(row) {
    // Add event listener for the delete link
    const deleteButton = row.querySelector(".delete-link");
    deleteButton.addEventListener("click", function (event) {
      event.preventDefault();
      row.remove();
    });


   }

 // ADD DRAG OPTION

        const tableContainer = document.querySelector('.records');
        let isDragging = false;
        let startX, scrollLeft;
    
        // Start dragging
        tableContainer.addEventListener('mousedown', (e) => {
          isDragging = true;
          startX = e.pageX - tableContainer.offsetLeft;
          scrollLeft = tableContainer.scrollLeft;
          tableContainer.style.cursor = 'grabbing';
        });
    
        // Stop dragging
        tableContainer.addEventListener('mouseup', () => {
          isDragging = false;
          tableContainer.style.cursor = 'grab';
        });
    
        // Dragging movement
        tableContainer.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          e.preventDefault(); // Prevent text selection
          const x = e.pageX - tableContainer.offsetLeft;
          const scroll = (x - startX) * 2; // Adjust scroll speed here
          tableContainer.scrollLeft = scrollLeft - scroll;
        });
    
        // Prevent mouse leaving while dragging
        tableContainer.addEventListener('mouseleave', () => {
          if (isDragging) {
            isDragging = false;
            tableContainer.style.cursor = 'grab';
          }
        });


});      




