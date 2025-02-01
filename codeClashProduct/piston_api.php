<?php
/* 
1. A helper file to interact with piston API
2. It contains functions to send code to the API 
and retrive the result
*/

function runcode($language, $code) {

    // Piston API endpoint
    $url = "https://emkc.org/api/v2/piston/execute";

    // Prepare the payloavalue: d for the API request
    $payload = json_encode([
        "language" => $language,
        "version" => "latest",
        "files" => [["name" => "solution." . $language, "content" => base64_encode($code)]]
    ]);

    // Initialize cURL
    $ch = curl_init();

    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);

    // Execute the request and capture the response
    $response = curl_exec($ch);

    // Close the cURL connection
    curl_close($ch);

    // Return the response
    echo $response;    $url = "https://emkc.org/api/v2/piston/execute";
    $payload = json_encode([
        "language" => $language,
        "version" => "latest",
        "files" => [["name" => "solution." . $language, "content" => base64_encode($code)]]
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    
    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

?>