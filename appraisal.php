<?php
session_start(); // Start session to access logged-in user data

$servername = "localhost";
$username = "root";
$password = "";
$database = "rcmrd";

$connection = new mysqli($servername, $username, $password, $database);

if ($connection->connect_error) {
    die("Database connection failed: " . $connection->connect_error);
}

// Ensure user is logged in and staffNo is set in session
if (!isset($_SESSION['staffNo'])) {
    die("Unauthorized access. Please log in.");
}

$staffNo = $_SESSION['staffNo']; // Retrieve staffNo from the session

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch data only for the logged-in user's staffNo
    $sql = "SELECT * FROM appraisal_perfomance WHERE staffNo = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("s", $staffNo);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo json_encode($rows); // Return data as JSON

    $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data (JSON)
    $inputData = file_get_contents("php://input");
    $data = json_decode($inputData, true);  // Decode the JSON data

    if (isset($data['submittedData'])) {
        $submittedData = $data['submittedData'];

        if (!empty($submittedData)) {
            // DELETE existing records for this staffNo before inserting new ones
            $deleteSQL = "DELETE FROM appraisal_perfomance WHERE staffNo = ?";
            $deleteStmt = $connection->prepare($deleteSQL);
            $deleteStmt->bind_param("s", $staffNo);
            $deleteStmt->execute();
            $deleteStmt->close();

            // Prepare the SQL statement for inserting new data
            $stmt = $connection->prepare("INSERT INTO appraisal_perfomance (
                staffNo, Perspectives, SSMARTAObjectives, Initiatives, UoM, DI,
                WeightSSMARTAObjective, TargetSSMARTAObjective, Annual_Actual_Achievement, Annual_Score,
                Annual_Weighted_Average, Annual_Detailed_Explanation, Annual_Evidence, 
                Supervisor_WeightSSMARTAObjective, Supervisor_TargetSSMARTAObjective,
                Supervisor_ActualAchievement, Supervisor_Score, Supervisor_Weighted_Average,
                Supervisor_Comments, Supervisor_IdentifiedGaps, Supervisor_Strategies
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            if (!$stmt) {
                die("Error preparing insert statement: " . $connection->error);
            }

            // Loop through the submitted data and insert into the database
            foreach ($data['submittedData'] as $rowData) {
                $Perspectives = $rowData['Perspectives'];
                $SSMARTAObjectives = $rowData['SSMARTAObjectives'];
                $Initiatives = $rowData['Initiatives'];
                $UoM = $rowData['UoM'];
                $DI = $rowData['DI'];
                $WeightSSMARTAObjective = $rowData['WeightSSMARTAObjective'];
                $TargetSSMARTAObjective = $rowData['TargetSSMARTAObjective'];
                $Annual_Actual_Achievement = $rowData['Annual_Actual_Achievement'];
                $Annual_Score = $rowData['Annual_Score'];
                $Annual_Weighted_Average = $rowData['Annual_Weighted_Average'];
                $Annual_Detailed_Explanation = $rowData['Annual_Detailed_Explanation'];
                $Annual_Evidence = $rowData['Annual_Evidence'];
                $Supervisor_WeightSSMARTAObjective = $rowData['Supervisor_WeightSSMARTAObjective'];
                $Supervisor_TargetSSMARTAObjective = $rowData['Supervisor_TargetSSMARTAObjective'];
                $Supervisor_ActualAchievement = $rowData['Supervisor_ActualAchievement'];
                $Supervisor_Score = $rowData['Supervisor_Score'];
                $Supervisor_Weighted_Average = $rowData['Supervisor_Weighted_Average'];
                $Supervisor_Comments = $rowData['Supervisor_Comments'];
                $Supervisor_IdentifiedGaps = $rowData['Supervisor_IdentifiedGaps'];
                $Supervisor_Strategies = $rowData['Supervisor_Strategies'];

                // Bind parameters and include staffNo for each insert
                $stmt->bind_param("isssssdddddssdddddsss", 
                $staffNo, $Perspectives, $SSMARTAObjectives, $Initiatives, $UoM, $DI, $WeightSSMARTAObjective,
                $TargetSSMARTAObjective, $Annual_Actual_Achievement, $Annual_Score, $Annual_Weighted_Average,
                $Annual_Detailed_Explanation, $Annual_Evidence, $Supervisor_WeightSSMARTAObjective,
                $Supervisor_TargetSSMARTAObjective, $Supervisor_ActualAchievement, $Supervisor_Score,
                $Supervisor_Weighted_Average, $Supervisor_Comments, $Supervisor_IdentifiedGaps, $Supervisor_Strategies
            );

                if (!$stmt->execute()) {
                    echo "Error inserting data for $Perspectives $StrategicObjective: " . $stmt->error . "<br>";
                }
            }

            // Close the statement
            $stmt->close();
            echo "Data successfully inserted.";
        } else {
            echo "No data received.";
        }
    } else {
        echo "No 'submittedData' found in the POST request.";
    }
}

$connection->close();
?>
