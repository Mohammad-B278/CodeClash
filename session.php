<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['userid'])) {
    echo json_encode(["logged_in" => false]);
    exit;
}

echo json_encode(["logged_in" => true, "userid" => $_SESSION['userid'], "username" => $_SESSION['username']]);
?>
