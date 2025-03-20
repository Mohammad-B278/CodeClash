<?php
/*
Fetching question for the specific problem defined by specific pseudo element for challenge/coding pages
*/

header("Content-Type: application/json");
require "db_config.php";

if (!isset($_GET["questionID"])) {
    echo json_encode(["error" => "No question ID provided."]);
    exit;
}

$question_id = intval($_GET["questionID"]);

// Fetching question details
$sql = "SELECT title, description, example, test_cases, expected_output FROM questions WHERE questionID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $question_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(["error" => "Question not found."]);
    exit;
}

$question = $result->fetch_assoc();

$response = [
    "title" => $question["title"],
    "description" => $question["description"],
    "example" => $question["example"],
    "test_cases" => $question["test_cases"],
    "expected_output" => $question["expected_output"]
];

echo json_encode($response);
$conn->close();
?>
