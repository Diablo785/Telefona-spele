<?php
session_start();

require_once 'db.php';

class Register {
    private $db;

    public function __construct() {
        $this->db = new DB();
    }

    public function registerUser($username, $password, $email) {
        $conn = $this->db->conn;

        if ($this->usernameExists($username)) {
            return array("success" => false, "message" => "Username already exists");
        }
        if ($this->emailExists($email)) {
            return array("success" => false, "message" => "Email already exists");
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO users (username, password, email, credits) VALUES (?, ?, ?, ?)");
        $initialCredits = 0; // Set the initial credits to 0
        $stmt->bind_param("sssi", $username, $hashedPassword, $email, $initialCredits);

        if ($stmt->execute()) {
            return array("success" => true);
        } else {
            return array("success" => false, "message" => "Error registering user");
        }
    }

    private function usernameExists($username) {
        $conn = $this->db->conn;

        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        return $stmt->num_rows > 0;
    }

    private function emailExists($email) {
        $conn = $this->db->conn;

        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        return $stmt->num_rows > 0;
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $register = new Register();

    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['username']) && isset($data['password']) && isset($data['email'])) {
        $username = $data['username'];
        $password = $data['password'];
        $email = $data['email'];

        $result = $register->registerUser($username, $password, $email);
        echo json_encode($result);
    } else {
        echo json_encode(array("success" => false, "message" => "Missing parameters"));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
}
?>
