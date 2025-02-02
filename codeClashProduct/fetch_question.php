<?php
header("Content-Type: application/json");
include "db_config.php";

if (!isset($_GET["id"])) {
    echo json_encode(["error" => "No question ID provided."]);
    exit;
}

$question_id = intval($_GET["id"]);

// Fetching question details
$sql = "SELECT title, description, example FROM questions WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $question_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(["error" => "Question not found."]);
    exit;
}

$question = $result->fetch_assoc();

// Fetching test cases
$sql_test_cases = "SELECT input, expected_output FROM test_cases WHERE question_id = ?";
$stmt = $conn->prepare($sql_test_cases);
$stmt->bind_param("i", $question_id);
$stmt->execute();
$result_test_cases = $stmt->get_result();

$test_cases = [];
while ($row = $result_test_cases->fetch_assoc()) {
    $test_cases[] = [
        "input" => $row["input"],
        "expected_output" => $row["expected_output"]
    ];
}

$response = [
    "title" => $question["title"],
    "description" => $question["description"],
    "example" => [
        "input" => json_decode($question["example"])->input ?? "",
        "output" => json_decode($question["example"])->output ?? ""
    ],
    "test_cases" => $test_cases
];

echo json_encode($response);
$conn->close();
?>
