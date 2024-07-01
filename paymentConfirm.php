<?php
require_once 'db.php';

session_start();

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

if (!isset($data->amount) || $data->amount <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid amount']);
    exit();
}

$amount = $data->amount;
$user_id = $_SESSION['user_id'] ?? null;

if ($user_id !== null) {
    $db = new DB();
    $conn = $db->conn;

    $stmt = $conn->prepare("UPDATE users SET credits = credits + ? WHERE id = ?");
    $stmt->bind_param("ii", $amount, $user_id);
    $stmt->execute();
    $stmt->close();

    http_response_code(200);
    echo json_encode(['message' => 'Credits updated successfully']);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'User not logged in']);
}
?>
