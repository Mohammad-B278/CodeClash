<?php
/*
Fetching leaderboard data for leaderboard page
*/


header("Content-Type: application/json");
require __DIR__ . '/../config/db_config.php';

$sql = "SELECT 
            performance.userID, 
            users.username, 
            performance.leaderboard_problems AS problems_solved, 
            performance.leaderboard_wins AS wins 
        FROM performance 
        JOIN users ON performance.userID = users.userID 
        ORDER BY performance.leaderboard_wins DESC, performance.leaderboard_problems DESC 
        LIMIT 10";

$result = $conn->query($sql);

if (!$result) {
    die(json_encode(['error' => $conn->error, 'query' => $sql]));
}

$leaderboard = [];
while ($row = $result->fetch_assoc()) {
    $leaderboard[] = $row;
}

echo json_encode($leaderboard);

$conn->close();
?>