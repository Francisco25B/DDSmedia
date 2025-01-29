<?php
//use PDO;

$host = 'localhost';
$dbname = 'database';  // Nombre de tu base de datos
$username = 'root';     // Tu nombre de usuario
$password = '';         // Tu contraseña

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
