<?php
/*
Fetching all the questions solved by user for profile page
*/

session_start();
header("Content-Type: application/json");
require __DIR__ . '/../config/db_config.php';

// Check if the userID is valid
if (!isset($_SESSION['userid'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

// Fetching questionIDs a user has completed
$sql = "SELECT questionID FROM user_questions WHERE userid = ?"; 
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $_SESSION['userid']);
$stmt->execute();
$result = $stmt->get_result();
$userquestion = [];

while ($row = $result->fetch_assoc()) {
    $userquestion[] = $row['questionID']; // Store only the questionID values
}

// If no questions are found, return an empty array
if (empty($userquestion)) {
    echo json_encode(["questions" => []]);
    $conn->close();
    exit;
}

// Fetching questions names based on the questionIDs
$placeholders = implode(",", array_fill(0, count($userquestion), "?"));

$sql = "SELECT title FROM questions WHERE questionID IN ($placeholders)"; 
$stmt = $conn->prepare($sql);

// Bind the questionIDs to the placeholders
$types = str_repeat("i", count($userquestion)); 
$stmt->bind_param($types, ...$userquestion); 

$stmt->execute();
$result = $stmt->get_result();
$question = [];

while ($row = $result->fetch_assoc()) {
    $question[] = $row['title']; // Store only the question names
}

// returned into a JSON file
echo json_encode(["questions" => $question]);

$conn->close();
?>