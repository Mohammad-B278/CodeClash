<?php
/*
Used by everything database related to connect to our database
*/

require __DIR__ . '/../../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

// Database credentials (Same for everyone!!!)
$database_host = $_ENV['DB_HOST'] ?? 'localhost';   // Same for all teammates) virus?
$database_user = $_ENV['DB_USER'] ?? 'root';  // Shared
$database_pass = $_ENV['DB_PASS'] ?? ''; // Shared
$database_name = $_ENV['DB_NAME'] ?? 'test';  //Shared

// Create a new connection to the database
$conn = new mysqli($database_host, $database_user, $database_pass, $database_name);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}