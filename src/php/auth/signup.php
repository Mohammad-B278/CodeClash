<?php
/*
Checking signuo details for correctness for signup page and registering the user
*/


require __DIR__ . '/../config/db_config.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recaptcha_secret = getenv('RECAPCHA_SECRET') ?: "secret";;
    $recaptcha_response = $_POST['g-recaptcha-response'];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'secret' => $recaptcha_secret,
        'response' => $recaptcha_response
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    $response_keys = json_decode($response, true);

    // Check if reCAPTCHA was completed
    if (!isset($_POST['g-recaptcha-response']) || empty($_POST['g-recaptcha-response'])) {
        echo "<script>alert('Error: reCAPTCHA verification is required'); window.location.href='signup_page.html';</script>";
        exit;
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
                echo "<script>alert('All fields have to be filled'); window.location.href='../pages/signup_page.html';</script>";
                exit;
            }

            // Validating email and username
            $stmt = $conn->prepare("SELECT userid FROM users WHERE username = ? OR email = ?");
            $stmt->bind_param("ss", $username, $email);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                echo "<script>alert('All fields have to be filled'); window.location.href='../pages/signup_page.html';</script>";
                exit;
            }
            $stmt->close();

            // Hashing
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // Adding to db
            $stmt = $conn->prepare("INSERT INTO users (first_name, surname, username, email, password) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $fname, $surname, $username, $email, $hashed_password);

            if ($stmt->execute()) {
                header('Location: ../../index.html');
                exit;
            } else {
                error_log("Database error: " . $stmt->error); // I'm not sure we have access to this at any point, but should be there for best practices
                echo "<script>alert('An error occurred. Please try again later'); window.location.href='../pages/signup_page.html';</script>";
            }

            $stmt->close();
            $conn->close();
        }

    } else {
        $response_json = json_encode($response_keys);
        echo "<script>alert('Verification failed. Details: $response_json'); window.location.href='../pages/signup_page.html';</script>";
    }
}
?>
