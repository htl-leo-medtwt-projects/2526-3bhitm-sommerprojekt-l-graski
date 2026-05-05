<?php
require_once __DIR__ . '/api_helpers.php';
require_once __DIR__ . '/database.php';

$action = $_GET['action'] ?? '';
$conn = db();

function userToArray(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'email' => $row['email'],
        'first_name' => $row['first_name'],
        'last_name' => $row['last_name'],
        'phone' => $row['phone'],
        'street' => $row['street'],
        'zip' => $row['zip'],
        'city' => $row['city'],
        'country' => $row['country'] ?: 'Österreich'
    ];
}

switch ($action) {
    case 'login': {
            $data = getJsonInput();
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '';

            if ($email === '' || $password === '') {
                jsonResponse(['error' => 'E-Mail und Passwort erforderlich'], 400);
            }

            $stmt = $conn->prepare('SELECT id, email, password_hash, first_name, last_name, phone, street, zip, city, country FROM users WHERE email = ? LIMIT 1');
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();

            if (!$user || !password_verify($password, $user['password_hash'])) {
                jsonResponse(['error' => 'Ungültige Anmeldedaten.'], 401);
            }

            ensureSessionStarted();
            session_regenerate_id(true);
            $_SESSION['user_id'] = (int) $user['id'];
            $_SESSION['user'] = userToArray($user);

            jsonResponse(['user' => userToArray($user)]);
        }

    case 'register': {
            $data = getJsonInput();
            $firstName = trim($data['first_name'] ?? '');
            $lastName = trim($data['last_name'] ?? '');
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '';

            if ($firstName === '' || $lastName === '' || $email === '' || $password === '') {
                jsonResponse(['error' => 'Bitte alle Felder ausfüllen.'], 400);
            }

            if (strlen($password) < 8) {
                jsonResponse(['error' => 'Passwort muss mindestens 8 Zeichen haben.'], 400);
            }

            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $conn->prepare('INSERT INTO users (email, password_hash, first_name, last_name, country) VALUES (?, ?, ?, ?, ?)');
            $country = 'Österreich';
            $stmt->bind_param('sssss', $email, $hash, $firstName, $lastName, $country);

            if (!$stmt->execute()) {
                $stmt->close();
                if ($conn->errno === 1062) {
                    jsonResponse(['error' => 'Diese E-Mail ist bereits registriert.'], 409);
                }
                jsonResponse(['error' => 'Registrierung fehlgeschlagen.'], 500);
            }

            $userId = $conn->insert_id;
            $stmt->close();

            ensureSessionStarted();
            session_regenerate_id(true);
            $_SESSION['user_id'] = (int) $userId;

            $stmt = $conn->prepare('SELECT id, email, first_name, last_name, phone, street, zip, city, country FROM users WHERE id = ? LIMIT 1');
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();

            $_SESSION['user'] = $user ? userToArray($user) : null;
            jsonResponse(['user' => userToArray($user)]);
        }

    case 'logout': {
            ensureSessionStarted();
            $_SESSION = [];
            if (ini_get('session.use_cookies')) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
            }
            session_destroy();
            jsonResponse(['success' => true]);
        }

    case 'me': {
            ensureSessionStarted();
            if (!empty($_SESSION['user'])) {
                jsonResponse(['user' => $_SESSION['user']]);
            }

            $userId = requireAuth();
            $stmt = $conn->prepare('SELECT id, email, first_name, last_name, phone, street, zip, city, country FROM users WHERE id = ? LIMIT 1');
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();

            if (!$user) {
                jsonResponse(['error' => 'User nicht gefunden'], 404);
            }

            $userOut = userToArray($user);
            $_SESSION['user'] = $userOut;
            jsonResponse(['user' => $userOut]);
        }

    case 'update': {
            $userId = requireAuth();
            $data = getJsonInput();

            $firstName = trim($data['first_name'] ?? '');
            $lastName = trim($data['last_name'] ?? '');
            $phone = trim($data['phone'] ?? '');
            $street = trim($data['street'] ?? '');
            $zip = trim($data['zip'] ?? '');
            $city = trim($data['city'] ?? '');
            $country = trim($data['country'] ?? 'Österreich');

            if ($firstName === '' || $lastName === '') {
                jsonResponse(['error' => 'Vorname und Nachname sind Pflichtfelder.'], 400);
            }

            $stmt = $conn->prepare('UPDATE users SET first_name = ?, last_name = ?, phone = ?, street = ?, zip = ?, city = ?, country = ? WHERE id = ?');
            $stmt->bind_param('sssssssi', $firstName, $lastName, $phone, $street, $zip, $city, $country, $userId);
            if (!$stmt->execute()) {
                $stmt->close();
                jsonResponse(['error' => 'Profil konnte nicht gespeichert werden.'], 500);
            }
            $stmt->close();

            $stmt = $conn->prepare('SELECT id, email, first_name, last_name, phone, street, zip, city, country FROM users WHERE id = ? LIMIT 1');
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();

            $userOut = userToArray($user);
            ensureSessionStarted();
            $_SESSION['user'] = $userOut;
            jsonResponse(['user' => $userOut]);
        }

    case 'delete': {
            $userId = requireAuth();
            $stmt = $conn->prepare('DELETE FROM users WHERE id = ?');
            $stmt->bind_param('i', $userId);
            if (!$stmt->execute()) {
                $stmt->close();
                jsonResponse(['error' => 'Account löschen fehlgeschlagen.'], 500);
            }
            $stmt->close();

            ensureSessionStarted();
            $_SESSION = [];
            if (ini_get('session.use_cookies')) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
            }
            session_destroy();

            jsonResponse(['success' => true]);
        }

    default:
        jsonResponse(['error' => 'Unbekannte Aktion'], 400);
}
