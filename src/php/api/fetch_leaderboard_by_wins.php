<?php
/*
fetching leaderboard sorted by wins for the profile page
*/


session_start();
header("Content-Type: application/json");
require __DIR__ . '/../config/db_config.php';

//checks the userID is valid
if (!isset($_SESSION['userid'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

// fetching leaderboard details sorted by wins
$sql = "SELECT userID, leaderboard_wins, leaderboard_problems FROM performance ORDER BY leaderboard_wins DESC"; 
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();
$userdetail = [];

while ($row = $result->fetch_assoc()) {
    $userdetail[] = $row;
}

// fetching username 
$sql = "SELECT userID, username FROM users ORDER BY num_wins DESC"; 
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();
$username = [];

while ($row = $result->fetch_assoc()) {
    $username[] = $row;
}

$response = [];
foreach ($userdetail as $entry) {
    foreach ($username as $user) {
        if ($entry["userID"] == $user["userID"]) {
            $response[] = [
                "username" => $user["username"],
                "leaderboard_wins" => $entry["leaderboard_wins"],
                "leaderboard_problems" => $entry["leaderboard_problems"]
            ];
            break;
        }
    }
}

echo json_encode($response);
$conn->close();
?>