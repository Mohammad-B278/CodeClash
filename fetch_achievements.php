<?php
session_start();
header("Content-Type: application/json");
require "db_config.php";

// Check if the userID is valid
if (!isset($_SESSION['userid'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$userID = $_SESSION['userid'];

// Achievements recieving
// Checks if user has achieved achievement, and adds to achievements table if they have

$sql = "SELECT username, num_wins, num_problems_solved FROM users WHERE userID = ?"; //? means variable
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userID);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

// Fetching achievementIDs a user has unlocked
$sql = "SELECT achievementID FROM user_achievements WHERE userid = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userID);
$stmt->execute();
$result = $stmt->get_result();
$userAchievement = [];

while ($row = $result->fetch_assoc()) {
    $userAchievement[] = $row['achievementID']; // Store only the achievementID values
}
$stmt->close();

// Fecthing every achievementID and name
$sql = "SELECT achievementID, achievement_name FROM achievements";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();
$achievement = [];

while ($row = $result->fetch_assoc()) {
    $achievement[$row['achievementID']] = $row['achievement_name']; // Storing achievement's name in ID slot
}
$stmt->close();

// Achievement thresholds
$no_of_achievement = array(1,3,5,10,20);

// Inserting achievements
foreach ($achievement as $achievementID => $achievementName) {
    $index = intdiv(($achievementID-1), 2);
    $insertAchievement = false;
    
    // check if achievement is already in database
    // if achivementID is in userachievment[] continue
    if (in_array($achievementID, $userAchievement)){
        continue;
    }

    if ($achievementID % 2 == 1) {
        // then it is a no of pvp wins achievement
        if ($user["num_wins"] >= $no_of_achievement[$index]) {
            $insertAchievement = true;        
        }

    } else {
        // then it is a no of problems solved achievement
        if ($user["num_problems_solved"] >= $no_of_achievement[$index]) {
            $insertAchievement = true;
        }
    }

    if ($insertAchievement) {
        $sql = "INSERT INTO user_achievements (userID, achievementID) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $userID, $achievementID);
        $stmt->execute();
        $stmt->close();
        $userAchievement[] = $achievementID; // Adding to return later
    }
}

// Fetching achievementIDs a user has unlocked
$sql = "SELECT achievements.achievement_name  FROM user_achievements JOIN achievements ON user_achievements.achievementID = achievements.achievementID WHERE user_achievements.userID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userID);
$stmt->execute();
$result = $stmt->get_result();
$userachievement = [];

while ($row = $result->fetch_assoc()) {
    $userAchievements[] = $row['achievement_name'];
}
$stmt->close();

// If no achievements are found, return an empty array
if (empty($userAchievements)) {
    echo json_encode(["achievements" => $achievement, "user_achievements" => []]);
    $conn->close();
    exit;
}

// returned into a JSON file
echo json_encode(["achievements" => $achievement, "user_achievements" => $userAchievements]);

$conn->close();
?>