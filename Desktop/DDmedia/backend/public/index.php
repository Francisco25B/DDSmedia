<?php
require __DIR__ . '/../vendor/autoload.php';  // Carga el autoloader de Composer
require '../src/config/database.php';  // Asegúrate de que el archivo de configuración de la base de datos esté correcto
require '../src/controllers/UserController.php';  // Carga el controlador de usuario
require __DIR__ . '/../src/routes.php';  // Carga las rutas de tu aplicación

// Crear la conexión a la base de datos
$pdo = new PDO(dsn: 'mysql:host=localhost;dbname=database', username: 'root', password: ''); // Cambia según tus credenciales

// Configura las rutas
use Slim\Factory\AppFactory;
$app = AppFactory::create();

// Middleware CORS: Asegúrate de agregar CORS antes de cualquier otra ruta o middleware
$app->add(middleware: function ($request, $handler): mixed {
    $response = $handler->handle($request);
    
    // Encabezados CORS para todas las respuestas
    return $response
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:3000') // Cambia a la URL de tu frontend
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') // Métodos permitidos
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With') // Encabezados permitidos
        ->withHeader('Access-Control-Allow-Credentials', 'true'); // Si necesitas manejar cookies o autenticación
});


// Ejemplo para producción
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response
        ->withHeader('Access-Control-Allow-Origin', 'https://tu-frontend-en-produccion.com') // Para producción
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        ->withStatus(200);
});



// Pasa el objeto PDO a las rutas
(require __DIR__ . '/../src/routes.php')($app, $pdo);  // Pasar el $pdo a las rutas

// Ejecuta la aplicación Slim
$app->run();
