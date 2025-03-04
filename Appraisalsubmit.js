document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("tableBody");
  const submitButton = document.getElementById("submitButton"); // Reference to the submit button

  // Fetch existing data on page load
  fetch("Appraisalsubmit.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const rows = data.appraisals; // Assuming data.appraisals contains the rows
        rows.forEach((rowData) => {
          const row = document.createElement("tr");
          for (const key in rowData) {
            const cell = document.createElement("td");
            let value = rowData[key];
            // Check if the value is a decimal number (assumes decimal values should have '%' sign)
            if (!isNaN(value) && value.includes('.')) {
              value = value + "%"; // Append '%' symbol
            }
            cell.textContent = value;
            row.appendChild(cell);
          }
          tableBody.appendChild(row); // Append row to table
        });
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Error fetching existing data");
    });

    function checkscoreValue() {
    let isValid = true;
    document.querySelectorAll("#tableBody tr").forEach((row) => {
      let targetCell = row.cells[8]; // Targeting score column
      let target = parseFloat(targetCell.innerText.replace("%", "")) || 0;
      if (target > 100) {
        alert("Error: score value cannot exceed 100%.");
        isValid = false;
      }
    });
    return isValid;
  }

  // update checkColumnSumValidity function to check number to check score be between 0 and 100
  function validateBeforeSubmit() {
      let isValid = true;
      const invalidCells = [];
  
      document.querySelectorAll("#tableBody tr").forEach(row => {
          const cells = row.querySelectorAll("td");
          // Check columns 8 and 15
          [8, 15].forEach(colIndex => {
              const cell = cells[colIndex];
              const value = parseFloat(cell.textContent.replace("%", ""));
              if (isNaN(value) || value < 0 || value > 100) {
                  cell.classList.add("invalid-cell");
                  invalidCells.push(cell);
                  isValid = false;
              }
          });
      });
  
      if (!isValid) {
          alert("Scores must be between 0-100. Fix highlighted fields.");
          invalidCells[0].scrollIntoView({ behavior: "smooth" });
          return false;
      }
      return true;
  }
  // Event listener for the Submit button
  submitButton.addEventListener("click", function (event) {
    // Prevent submission if validation fails
    if (!validateBeforeSubmit()) {
      event.preventDefault();
      return;
  }
  // Proceed with submission...

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
    fetch("Appraisalsubmit.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submittedData }), // Send data as JSON
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        if (data.status === "success") {
          location.reload(); // Reload the page to reflect the changes
        }
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        alert("Error submitting data");
      });
  });

  // Function to check column sum validity (if required for validation)
  function checkColumnSumValidity() {
   
    return true;
  }

  // Function to check target value (if required for validation)
  function checkTargetValue() {
   
    return true;
  }
});
