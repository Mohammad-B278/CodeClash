<?php
/*
Fetching all the questions available for the questions page
*/


header("Content-Type: application/json");
require "db_config.php"; // Include database connection

// Fetch all questions
$sql = "SELECT questionID, title, description, example, difficulty, topics FROM questions";
$result = $conn->query($sql);

$questions = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $questions[] = $row; // Store each question in an array
    }
    // Return questions data
    echo json_encode($questions);
} else {
    // No questions found, return an error message
    echo json_encode(["error" => "No questions found"]);
}

// Close the database connection
$conn->close();
?>
