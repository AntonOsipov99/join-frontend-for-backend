<?php
// Get the origin from the request headers
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// List of allowed origins
$allowed_origins = [
    'http://127.0.0.1:5501',  // Local development
    'http://localhost:5501',  // Alternative local reference
    'https://join.anton-osipov.de',  // Production environment
    'http://join.anton-osipov.de'    // Non-HTTPS version just in case
];

// Check if the origin is allowed
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

// Rest of the CORS headers
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Your existing email sending code starts here
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = $_POST["email"];
    $subject = "Reset Your Password";
    
    // HTML-Template einlesen
    $message = file_get_contents('./html/email.html');
    
    // Platzhalter in der Vorlage ersetzen
    $username = $_POST["username"]; // Benutzername aus dem POST-Daten erhalten
    
    $message = str_replace('{{reset_user}}', $username, $message);
    $message = str_replace('{{reset_link}}', 'join.anton-osipov.de/resetpassword.html?msg=' . $_POST["email"], $message);
    
    $headers = "From: join.anton-osipov.de\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    
    if (mail($to, $subject, $message, $headers)) {
        echo "success";
    } else {
        echo "error";
        echo error_get_last()['message'];
    }
}
?>

