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

/* // Fetch problem data from the 'questions' table (assuming id=20 for Problem 20)
$sql = "SELECT title, descriptions, example FROM questions WHERE id = 1";
$result = $conn->query($sql);

// Check if the data exists
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $questions[] = $row;
    }
    // Return questions data as JSON
    echo json_encode($questions);
} else {
    // No questions found, return an error message
    echo json_encode(["error" => "No questions found"]);
} */


// Fetch the test cases from the 'test_cases' table for Problem ID 20
//$sql_test_cases = "SELECT input, expected_output FROM test_cases WHERE question_id = 20";
//$result_test_cases = $conn->query($sql_test_cases);

// Check if the data exists
/* if ($result_test_cases->num_rows > 0) {
    $test_cases = [];
    while ($row = $result_test_cases->fetch_assoc()) {
        $test_cases[] = [
            'input' => $row['input'],
            'expected_output' => $row['expected_output']
        ];
    }
} else {
    $test_cases = [];
} */
?>