<?php
/*
Removing session variables (effectively logging user out) and returning to login page
*/


session_start();
session_unset();  // Unset all session variables
session_destroy(); // Destroy the session

// Redirect to the login page after logout
header("Location: ../../../index.html");
exit;
?>