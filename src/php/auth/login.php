<?php
/*
Checking login details for correctness for login page
*/


include __DIR__ . '/../config/db_config.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recaptcha_secret = getenv('RECAPCHA_SECRET') ?: "secret";
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
        echo "<script>alert('Error: reCAPTCHA verification is required'); window.location.href='../../index.html';</script>";
        exit;
    }

    if ($response_keys["success"]) {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $email = trim($_POST['email']);
            $password = $_POST['password'];

            // Input validation
            if (empty($email) || empty($password)) {
                echo "<script>alert('You have to provide email and password'); window.location.href='../../index.html';</script>";
                exit;
            }

            // Retrieving data
            $stmt = $conn->prepare("SELECT userid, username, password FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();
            
            if ($stmt->num_rows == 1) {
                $stmt->bind_result($userid, $username, $hashed_password);
                $stmt->fetch();

                // Verifying password
                if (password_verify($password, $hashed_password)) {
                    $_SESSION['userid'] = $userid;
                    $_SESSION['username'] = $username;
                    header('Location: homepage.html');
                    exit;
                } else {
                    echo "<script>alert('Invalid email or password'); window.location.href='../../index.html';</script>";
                }
            } else {
                echo "<script>alert('Invalid email or password'); window.location.href='../../index.html';</script>";
            }

            $stmt->close();
            $conn->close();
        } 
        else {
            echo "<script>alert('Verification failed. Please try again'); window.location.href='../../index.html';</script>";
        }
    }
}
?>
