<?php
session_start();

require_once 'db.php';

class UpdateAccount {
    private $db;

    public function __construct() {
        $this->db = new DB();
    }

    public function updateUser($userId, $username, $email, $password) {
        $conn = $this->db->conn;

        $username = $conn->real_escape_string($username);
        $email = $conn->real_escape_string($email);
        $password = password_hash($password, PASSWORD_DEFAULT); // Hash the password before updating

        $query = "UPDATE users SET username='$username', email='$email', password='$password' WHERE id='$userId'";
        if ($conn->query($query) === TRUE) {
            return json_encode(array("success" => true, "message" => "User information updated successfully"));
        } else {
            return json_encode(array("success" => false, "message" => "Error updating user information: " . $conn->error));
        }
    }
}

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $updateAccount = new UpdateAccount();

    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['userId']) && isset($data['username']) && isset($data['email']) && isset($data['password'])) {
        $userId = $data['userId'];
        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password'];

        echo $updateAccount->updateUser($userId, $username, $email, $password);
    } else {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Invalid data provided"));
    }
} else {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
}
?>
