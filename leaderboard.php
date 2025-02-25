<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'db_config.php';

header('Content-Type: application/json');

$filter = isset($_GET['filter']) ? $_GET['filter'] : 'All Time';

// Note: Since we don't see a created_at column in the leaderboard table,
// we'll need to modify or remove the time filtering
$dateCondition = "";
/*
// This filtering would require a created_at or timestamp column
if ($filter === "Today") {
    $dateCondition = "AND DATE(leaderboard.created_at) = CURDATE()";
} elseif ($filter === "This Week") {
    $dateCondition = "AND YEARWEEK(leaderboard.created_at, 1) = YEARWEEK(CURDATE(), 1)";
}
*/

// Based on your table structure from the phpMyAdmin screenshots
$sql = "SELECT 
            leaderboard.position, 
            users.username, 
            leaderboard.score, 
            leaderboard.time_spent 
        FROM leaderboard 
        JOIN users ON leaderboard.user_id = users.userID 
        WHERE 1 $dateCondition 
        ORDER BY score DESC, time_spent ASC 
        LIMIT 10";

$result = $conn->query($sql);

if (!$result) {
    // Debug information if query fails
    echo json_encode(['error' => $conn->error, 'query' => $sql]);
    exit;
}

if ($result->num_rows > 0) {
    $leaderboard = [];
    while ($row = $result->fetch_assoc()) {
        $leaderboard[] = $row;
    }
    echo json_encode($leaderboard);
} else {
    echo json_encode([]);
}

$conn->close();
?>
