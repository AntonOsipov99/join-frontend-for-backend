<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = $_POST["email"];
    $subject = "Reset Your Password";

    // HTML-Template einlesen
    $message = file_get_contents('./html/email.html');

    // Platzhalter in der Vorlage ersetzen
    $username = $_POST["username"]; // Benutzername aus dem POST-Daten erhalten

    $message = str_replace('{{reset_user}}', $username, $message);
    $message = str_replace('{{reset_link}}', 'gruppe-691.developerakademie.net/join_gruppenarbeit/resetpassword.html?msg=' . $_POST["email"], $message);

    $headers = "From: webmaster@example.com\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";

    if (mail($to, $subject, $message, $headers)) {
        //echo "E-Mail wurde erfolgreich versandt.";
    } else {
        echo "E-Mail konnte nicht versandt werden.";
        echo error_get_last()['message'];
    }
}
?>




