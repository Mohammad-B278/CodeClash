<?php
header("Content-Type: application/json"); // Ensure JSON response
include "db_config.php"; // Include database connection

// Fetch all questions
$sql = "SELECT id, title, description, example, difficulty FROM questions";
$result = $conn->query($sql);

$questions = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $questions[] = $row; // Store each question in an array
    }
    // Return questions data as a single JSON array
    echo json_encode($questions);
} else {
    // No questions found, return an error message
    echo json_encode(["error" => "No questions found"]);
}

// Close the database connection
$conn->close();
?>
