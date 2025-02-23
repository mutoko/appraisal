<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $weight = isset($_POST['weight']) ? floatval($_POST['weight']) : 0;
    $score = isset($_POST['score']) ? floatval($_POST['score']) : 0;
    $weightedAverage = isset($_POST['weighted_average']) ? floatval($_POST['weighted_average']) : 0;
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    // Ensure score is within 0-100
    $score = max(0, min(100, $score));

    // Connect to the database (update with your credentials)
    $conn = new mysqli("localhost", "root", "", "appraisal_db");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Update database (assuming a table 'appraisal_scores')
    $sql = "UPDATE appraisal_scores SET weight=?, score=?, weighted_average=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("dddi", $weight, $score, $weightedAverage, $id);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(["success" => true, "weighted_average" => $weightedAverage]);
}
?>
