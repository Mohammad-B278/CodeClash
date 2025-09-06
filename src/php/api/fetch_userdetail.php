<?php
/*
Fetching relevant user details for the stats in user page
*/


session_start();
header("Content-Type: application/json");
require __DIR__ . '/../config/db_config.php';

//checks the userID is valid
if (!isset($_SESSION['userid'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

// fetching user details
$sql = "SELECT username, num_wins, num_problems_solved FROM users WHERE users.userID = ?"; //? means variable
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $_SESSION['userid']);
$stmt->execute();
$result = $stmt->get_result();

$userdetail = $result->fetch_assoc();

// fetching total attempts from user
$sql = "SELECT SUM(attempts) as total_attempts FROM user_questions WHERE userID = ?"; //? means variable
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $_SESSION['userid']);
$stmt->execute();
$result = $stmt->get_result();

$userattempts = $result->fetch_assoc();

$response = [
    "username" => $userdetail["username"],
    "num_wins" => $userdetail["num_wins"],
    "num_problems_solved" => $userdetail["num_problems_solved"],
    "attempts" => $userattempts["total_attempts"]
];

echo json_encode($response);
$conn->close();
?>