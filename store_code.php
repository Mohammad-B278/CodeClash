/* Backend PHP:
 1. Retrieve the submitted code and language
 2. Send code to Piston API for execution
 3. stores the result in the database(success or failure)
 4. Return the result to the frontend for display
*/

<?php
// Retrieve the POST data
$input = json_decode(file_get_contents('php://input'), true);

// Prepare data to store
if ($input) {
    $codeData = [
        "code" => $input['code'],
        "language" => $input['language'],
        "timestamp" => $input['timestamp'],
    ];

    // Path to your JSON file
    $filePath = 'user_code_submissions.json';

    // Read existing data
    $existingData = [];
    if (file_exists($filePath)) {
        $existingData = json_decode(file_get_contents($filePath), true);
    }

    // Add new submission
    $existingData[] = $codeData;

    // Save the data back to the JSON file
    if (file_put_contents($filePath, json_encode($existingData, JSON_PRETTY_PRINT))) {
        echo json_encode(["status" => "success", "message" => "Code saved successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save code."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
}
?>