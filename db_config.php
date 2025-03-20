<?php
/*
Used by everything database related to connect to our database
*/


// Database credentials (Same for everyone!!!)
$database_host = "dbhost.cs.man.ac.uk";   // Same for all teammates) virus?
$database_user = "p10584tl";  // Shared
$database_pass = "Vy45RUxOCovOnAHr7hjaka8GUXn52UupiuRqhRrHacQ"; // Shared
$database_name = "2024_comp10120_cm13";  //Shared

// Create a new connection to the database
$conn = new mysqli($database_host, $database_user, $database_pass, $database_name);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}