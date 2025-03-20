<?php
session_start();
require "db_config.php";

header("Content-Type: application/json");

if (!isset($_SESSION['userid'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$userid = $_SESSION['userid'];
$questionID = intval($data['questionID']);
$attempts = intval($data['attempts']);

$conn->begin_transaction(); // To make it so that we could rollback if one of the operations failed

try {
    // Checking if entry was already in the table
    $checkStmt = $conn->prepare("SELECT * FROM user_questions WHERE userID = ? AND questionID = ?");
    $checkStmt->bind_param("ii", $userid, $questionID);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows == 0) {
        // Adding to the table of problems solved
        $stmt = $conn->prepare("INSERT INTO user_questions (userID, questionID, attempts) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $userid, $questionID, $attempts);
        $stmt->execute();

        // Increasing number of problems solved
        $updateStmt = $conn->prepare("UPDATE users SET num_problems_solved = num_problems_solved + 1 WHERE userID = ?");
        $updateStmt->bind_param("i", $userid);
        $updateStmt->execute();
    } else {
        // Updating amomunt of attempts otherwise
        $updateAttemptsStmt = $conn->prepare("UPDATE user_questions SET attempts = attempts + ? WHERE userID = ? AND questionID = ?");
        $updateAttemptsStmt->bind_param("iii", $attempts, $userid, $questionID);
        $updateAttemptsStmt->execute();
    }

    $conn->commit();
    echo json_encode(["message" => "Progress saved successfully"]);
} catch (Exception $e) {
    // Rolling back if something went wrong
    $conn->rollback();
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

$checkStmt->close();
$conn->close();
?>
