<?php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use PDO;

class UserController {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    // Helper para enviar respuestas JSON
    private function jsonResponse(Response $response, array $data, int $statusCode): Response {
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($statusCode);
    }

    // Helper para validar los datos del usuario
    private function validateUserData(array $data, bool $isUpdate = false): array {
        $errors = [];

        if (!$isUpdate || isset($data['empresa_id'])) {
            if (!is_numeric($data['empresa_id'] ?? null)) {
                $errors[] = 'El campo empresa_id debe ser un número.';
            }
        }

        if (!$isUpdate || isset($data['tipo_usuario_id'])) {
            if (!is_numeric($data['tipo_usuario_id'] ?? null)) {
                $errors[] = 'El campo tipo_usuario_id debe ser un número.';
            }
        }

        if (!$isUpdate || isset($data['nombre'])) {
            if (empty($data['nombre'])) {
                $errors[] = 'El campo nombre es obligatorio.';
            }
        }

        if (!$isUpdate || isset($data['password'])) {
            if (empty($data['password'])) {
                $errors[] = 'El campo password es obligatorio.';
            }
        }

        return $errors;
    }

    // Inicio de sesión
    public function login(Request $request, Response $response): Response {
        $data = json_decode($request->getBody(), true);

        $usuario = $data['usuario'] ?? null;
        $password = $data['password'] ?? null;

        if (empty($usuario) || empty($password)) {
            return $this->jsonResponse($response, [
                'status' => 'error',
                'message' => 'El usuario y la contraseña son obligatorios.'
            ], 400);
        }

        try {
            $stmt = $this->pdo->prepare("SELECT * FROM usuario WHERE usuario = :usuario AND status = 1");
            $stmt->bindParam(':usuario', $usuario);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                // Generar un token JWT (o cualquier otro mecanismo de autenticación)
                $token = base64_encode(random_bytes(32)); // Simulación de token, cámbialo por JWT si es necesario

                return $this->jsonResponse($response, [
                    'status' => 'success',
                    'message' => 'Inicio de sesión exitoso.',
                    'user' => [
                        'id' => $user['id'],
                        'nombre' => $user['nombre'],
                        'apellido' => $user['apellido'],
                        'email' => $user['email'],
                        'telefono' => $user['telefono'],
                        'direccion' => $user['direccion']
                    ],
                    'token' => $token
                ], 200);
            } else {
                return $this->jsonResponse($response, [
                    'status' => 'error',
                    'message' => 'Credenciales incorrectas.'
                ], 401);
            }
        } catch (\PDOException $e) {
            error_log('Error al iniciar sesión: ' . $e->getMessage());
            return $this->jsonResponse($response, [
                'status' => 'error',
                'message' => 'Error en el servidor.'
            ], 500);
        }
    }

    // Crear usuario
    public function createUser(Request $request, Response $response): Response {
        $data = json_decode($request->getBody(), true);
        $errors = $this->validateUserData($data);

        if (!empty($errors)) {
            return $this->jsonResponse($response, ['status' => 'error', 'message' => $errors], 400);
        }

        try {
            $stmt = $this->pdo->prepare(
                "INSERT INTO usuario (empresa_id, tipo_usuario_id, nombre, password, apellido, usuario, email, telefono, direccion, status) 
                VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?)"
            );
            $stmt->execute([
                $data['empresa_id'],
                $data['tipo_usuario_id'],
                $data['nombre'],
                password_hash($data['password'], PASSWORD_BCRYPT),
                $data['apellido'],
                $data['usuario'],
                $data['email'],
                $data['telefono'],
                $data['direccion'],
                $data['status']
            ]);

            return $this->jsonResponse($response, ['status' => 'success', 'message' => 'Usuario creado'], 201);
        } catch (\PDOException $e) {
            error_log('Error al crear el usuario: ' . $e->getMessage());
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Error al guardar el usuario.'], 500);
        }
    }

// Obtener todos los usuarios
public function users(Request $request, Response $response): Response {
    $searchTerm = $request->getQueryParams()['q'] ?? ''; // Obtener el término de búsqueda desde los parámetros de consulta
    $tipoUsuario = $request->getQueryParams()['tipo_usuario_id'] ?? ''; // Obtener el tipo de usuario
    $status = $request->getQueryParams()['status'] ?? ''; // Obtener el estado

    try {
        $sql = "SELECT * FROM usuario WHERE 1=1"; // Empieza con una consulta básica

        // Si hay un término de búsqueda, lo agregamos a la consulta
        if (!empty($searchTerm)) {
            $sql .= " AND (nombre LIKE :searchTerm OR apellido LIKE :searchTerm OR email LIKE :searchTerm  OR direccion LIKE :searchTerm OR telefono LIKE :searchTerm)";
        }

        // Si hay un tipo de usuario, lo agregamos a la consulta
        if (!empty($tipoUsuario)) {
            $sql .= " AND tipo_usuario_id = :tipoUsuario";
        }

        // Si hay un estado, lo agregamos a la consulta
        if ($status !== '') { // Aseguramos que no sea un valor vacío
            $sql .= " AND status = :status";
        }

        $stmt = $this->pdo->prepare($sql);

        // Vinculamos los parámetros
        if (!empty($searchTerm)) {
            $stmt->bindValue(':searchTerm', "%$searchTerm%");
        }
        if (!empty($tipoUsuario)) {
            $stmt->bindValue(':tipoUsuario', $tipoUsuario);
        }
        if ($status !== '') { // Solo bind si el estado no está vacío
            $stmt->bindValue(':status', $status);
        }

        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $this->jsonResponse($response, ['status' => 'success', 'data' => $users], 200);
    } catch (\PDOException $e) {
        error_log($e->getMessage());
        return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Ha ocurrido un error en el servidor'], 500);
    }
}

    // Obtener usuario por ID
    public function getUser(Request $request, Response $response, array $args): Response {
        try {
            $userId = (int) $args['id'];
            $stmt = $this->pdo->prepare("SELECT * FROM usuario WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                return $this->jsonResponse($response, ['status' => 'success', 'data' => $user], 200);
            } else {
                return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Usuario no encontrado'], 404);
            }
        } catch (\PDOException $e) {
            error_log($e->getMessage());
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Ha ocurrido un error en el servidor'], 500);
        }
    }

    // Eliminar usuario
    public function deleteUser(Request $request, Response $response, array $args): Response {
        try {
            $userId = (int) $args['id'];
            $stmt = $this->pdo->prepare("DELETE FROM usuario WHERE id = ?");
            $stmt->execute([$userId]);

            if ($stmt->rowCount()) {
                return $this->jsonResponse($response, ['status' => 'success', 'message' => 'Usuario eliminado'], 200);
            } else {
                return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Usuario no encontrado'], 404);
            }
        } catch (\PDOException $e) {
            error_log($e->getMessage());
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Ha ocurrido un error en el servidor'], 500);
        }
    }

    // Actualizar usuario// Actualizar usuario
public function updateUser(Request $request, Response $response, array $args): Response {
    $data = json_decode($request->getBody(), true);
    $userId = (int) $args['id'];

    if (empty($data)) {
        return $this->jsonResponse($response, ['status' => 'error', 'message' => 'No se recibieron datos para actualizar'], 400);
    }

    // Obtener valores actuales del usuario
    $sqlSelect = "SELECT * FROM usuario WHERE id = ?";
    try {
        $stmtSelect = $this->pdo->prepare($sqlSelect);
        $stmtSelect->execute([$userId]);
        $currentUser = $stmtSelect->fetch(PDO::FETCH_ASSOC);

        if (!$currentUser) {
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Usuario no encontrado'], 404);
        }
    } catch (\PDOException $e) {
        error_log($e->getMessage());
        return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Error al consultar el usuario actual'], 500);
    }

    // Reemplazar valores faltantes por los actuales
    $updatedData = array_merge($currentUser, $data);

    // Validar los datos actualizados
    $errors = $this->validateUserData($updatedData, true);
    if (!empty($errors)) {
        return $this->jsonResponse($response, ['status' => 'error', 'errors' => $errors], 400);
    }

    // Generar cláusulas de actualización
    $setClause = [];
    $params = [];

    foreach ($data as $key => $value) {
        $setClause[] = "$key = ?";
        $params[] = $value;
    }

    if (empty($setClause)) {
        return $this->jsonResponse($response, ['status' => 'error', 'message' => 'No se proporcionaron campos para actualizar.'], 400);
    }

    $sqlUpdate = "UPDATE usuario SET " . implode(", ", $setClause) . " WHERE id = ?";
    $params[] = $userId;

    try {
        $stmtUpdate = $this->pdo->prepare($sqlUpdate);
        $stmtUpdate->execute($params);

        if ($stmtUpdate->rowCount()) {
            return $this->jsonResponse($response, ['status' => 'success', 'message' => 'Usuario actualizado'], 200);
        } else {
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'No se realizaron cambios en los datos del usuario'], 400);
        }
    } catch (\PDOException $e) {
        error_log($e->getMessage());
        return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Ha ocurrido un error en el servidor'], 500);
    }
}


}
