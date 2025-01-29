<?php
use App\Controllers\UserController;

return function ($app, $pdo) {
    // Verifica si la clase se carga correctamente
    if (!class_exists('App\\Controllers\\UserController')) {
        die('No se pudo cargar la clase UserController');
    }

    // Creamos la instancia de UserController pasando el PDO
    $userController = new UserController($pdo);

    // Define las rutas
    $app->get('/users', [$userController, 'users']);  // Obtiene todos los usuarios
    $app->get('/users/{id}', [$userController, 'getUser']);  // Obtiene un usuario por ID
    $app->post('/users', [$userController, 'createUser']);  // Crea un nuevo usuario
    $app->delete('/users/{id}', [$userController, 'deleteUser']);  // Elimina un usuario por ID
    $app->put('/users/{id}', [$userController, 'updateUser']);  // Actualiza un usuario por ID


    // Ruta para inicio de sesión
    $app->post('/api/login', [$userController, 'login']);  // Inicio de sesión


    // Ruta para la raíz
    $app->get('/', function ($request, $response, $args) {
        $data = ['status' => 'success', 'message' => 'Bienvenido a la API de usuarios'];
        $response->getBody()->write(json_encode($data));  
        return $response
            ->withHeader('Content-Type', 'application/json')  
            ->withStatus(200);  
    });
};
