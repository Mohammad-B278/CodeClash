<?php
include 'db_config.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recaptcha_secret = "6Le0n9IqAAAAAAR3-gJDKzRYE-hVZZucrmZiGwkx";
    $recaptcha_response = $_POST['g-recaptcha-response'];
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptcha_secret}&response={$recaptcha_response}");
    $response_keys = json_decode($response, true);

    // Check if reCAPTCHA was completed
    if (!isset($_POST['g-recaptcha-response']) || empty($_POST['g-recaptcha-response'])) {
        die("Error: reCAPTCHA verification is required.");
    }


    // Check if reCAPTCHA was completed
    if (!isset($_POST['g-recaptcha-response']) || empty($_POST['g-recaptcha-response'])) {
        die("Error: reCAPTCHA verification is required.");
    }
    
    if ($response_keys["success"]) {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $fname = trim($_POST['fname']);
            $surname = trim($_POST['surname']);
            $username = trim($_POST['username']);
            $email = trim($_POST['email']);
            $password = $_POST['password'];

            // Validating inputs
            if (empty($fname) || empty($surname) || empty($username) || empty($email) || empty($password)) {
                die("All fields have to be field");
            }

            // Validating email and username
            $stmt = $conn->prepare("SELECT userid FROM users WHERE username = ? OR email = ?");
            $stmt->bind_param("ss", $username, $email);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                die("Username or email taken");
            }
            $stmt->close();

            // Hashing
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // Adding to db
            $stmt = $conn->prepare("INSERT INTO users (first_name, surname, username, email, password) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $fname, $surname, $username, $email, $hashed_password);

            if ($stmt->execute()) {
                echo "Registration successful. <a href='login_page.html'>Login here</a>";
            } else {
                echo "Error: " . $stmt->error;
            }

            $stmt->close();
            $conn->close();
        }

    } else {
        echo "Verification failed. Please try again. $response_keys";
    }
}
?>
