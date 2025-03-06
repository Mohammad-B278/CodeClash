<?php
session_start();
header("Content-Type: application/json");
require "db_config.php";

// Check if the userID is valid
if (!isset($_SESSION['userid'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

// Fetching achievementIDs a user has unlocked
$sql = "SELECT achievementID FROM user_achievements WHERE userid = ?"; 
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $_SESSION['userid']);
$stmt->execute();
$result = $stmt->get_result();
$userachievement = [];

while ($row = $result->fetch_assoc()) {
    $userachievement[] = $row['achievementID']; // Store only the achievementID values
}

// If no achievements are found, return an empty array
if (empty($userachievement)) {
    echo json_encode(["achievements" => []]);
    $conn->close();
    exit;
}

// Fetching achievement names based on the achievementIDs
$placeholders = implode(",", array_fill(0, count($userachievement), "?"));

$sql = "SELECT achievement_name FROM achievements WHERE achievementID IN ($placeholders)"; 
$stmt = $conn->prepare($sql);

// Bind the achievementIDs to the placeholders
$types = str_repeat("i", count($userachievement)); 
$stmt->bind_param($types, ...$userachievement); 

$stmt->execute();
$result = $stmt->get_result();
$achievement = [];

while ($row = $result->fetch_assoc()) {
    $achievement[] = $row['achievement_name']; // Store only the achievement names
}

// returned into a JSON file
echo json_encode(["achievements" => $achievement]);

$conn->close();
?>