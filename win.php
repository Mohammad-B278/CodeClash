<?php
session_start();
require "db_config.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['userId'])) {
    echo json_encode(["error" => "Invalid request"]);
    exit;
}

$userid = intval($data['userId']);

$conn->begin_transaction();

try {
    $checkStmt = $conn->prepare("UPDATE users SET num_wins = num_wins + 1 WHERE userID = ?");
    $checkStmt->bind_param("i", $userid);
    $checkStmt->execute();

    if ($checkStmt->affected_rows > 0) {
        echo json_encode(["success" => "Win updated"]);
    } else {
        echo json_encode(["error" => "No update"]);
    }

    $conn->commit();

} catch (Exception $e) {
    // Rolling back if something went wrong
    $conn->rollback();
    echo json_encode(["error" => "Error updating win count: " . $e->getMessage()]);
}
$checkStmt->close();
$conn->close();
?>
