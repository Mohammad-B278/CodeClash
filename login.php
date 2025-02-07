<?php
include 'db_config.php';
session_start();

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
            echo "Login successful. <a href='profile_page.html'>Go to profile</a>";
        } else {
            echo "Invalid email or password";
        }
    } else {
        echo "Invalid email or password";
    }

    $stmt->close();
    $conn->close();
}
?>
