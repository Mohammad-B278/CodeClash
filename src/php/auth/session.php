<?php
/*
Script used in all of the pages (excluding login and signup) to check if the user is logged in. Used to
return user to login page if not
*/


session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['userid'])) {
    echo json_encode(["logged_in" => false]);
    exit;
}

echo json_encode(["logged_in" => true, "userid" => $_SESSION['userid'], "username" => $_SESSION['username']]);
?>
