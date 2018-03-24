<?php

  $recipient = "mmisciagna86@gmail.com";
  $subject = "Freelance Job!";
  $message = "Hello, Dr. Misciagna!<br><br>Someone has filled out your contact form. Here are the details:<br><br>";

  foreach($_POST as $key => $value) {
    if($key != "submit"){
      $message .= "<strong>$key:</strong> $value<br>";
    }
  }

  $headers  = 'MIME-Version: 1.0' . "\r\n";
  $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
  $headers .= 'To: Dr. Misciagna <michael.innovate@gmail.com>' . "\r\n";

  $result = mail($recipient, $subject, $message, $headers);
  header("Location: index.html");

?>
