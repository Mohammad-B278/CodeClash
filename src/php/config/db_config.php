<?php
/*
Used by everything database related to connect to our database
*/


// Database credentials (Same for everyone!!!)
$database_host = getenv('DB_HOST') ?: 'localhost';   // Same for all teammates) virus?
$database_user = getenv('DB_USER') ?: 'root';  // Shared
$database_pass = getenv('DB_PASS') ?: ''; // Shared
$database_name = getenv('DB_NAME') ?: 'test';  //Shared

// Create a new connection to the database
$conn = new mysqli($database_host, $database_user, $database_pass, $database_name);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}