<?php
/*
1. Contains db config and connection details
2. connection to db using mysqli to CM13 group db
*/


// Database credentials (Same for everyone!!!)
$database_host = "dbhost.cs.man.ac.uk";   // Same for all teammates)
$database_user = "p10584tl";  // Shared
$database_pass = "Vy45RUxOCovOnAHr7hjaka8GUXn52UupiuRqhRrHacQ"; // Shared
$database_name = "2024_comp10120_cm13";  //Shared

// Create a new connection to the database
$conn = new mysqli($database_host, $database_user, $database_pass, $database_name);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// If connected successfully, you can perform queries
echo "Connected successfully";

// Close the connection when done
$conn->close();
?>
