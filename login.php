<?php
include 'db_config.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recaptcha_secret = "6Le0n9IqAAAAAAR3-gJDKzRYE-hVZZucrmZiGwkx";
    $recaptcha_response = $_POST['g-recaptcha-response'];

    // Verify reCAPTCHA with Google
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptcha_secret}&response={$recaptcha_response}");
    // Verify reCAPTCHA with Google (changed file_get_contents to curl, supposedly should work)
    $recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";
    $data = [
        'secret' => $recaptcha_secret,
        'response' => $recaptcha_response
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $recaptcha_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    $response_keys = json_decode($response, true);

    // Check if reCAPTCHA was completed
    if (!isset($_POST['g-recaptcha-response']) || empty($_POST['g-recaptcha-response'])) {
        die("Error: reCAPTCHA verification is required.");
    }

    if ($response_keys["success"]) {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $email = trim($_POST['email']);
            $password = $_POST['password'];

            // Input validation
            if (empty($email) || empty($password)) {
                die("You have to provide email and password");
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
                    echo "Login successful. <a href='queue.html'>Go to profile</a>";
                } else {
                    echo "Invalid email or password";
                }
            } else {
                echo "Invalid email or password";
            }

            $stmt->close();
            $conn->close();
    } 
    else {
        echo "Verification failed. Please try again.";
    }
}
}
?>
