<?php
session_start();

require_once 'db.php';

class Login {
    private $db;

    public function __construct() {
        $this->db = new DB();
    }

    public function loginUser($username, $password) {
        $conn = $this->db->conn;

        $username = $conn->real_escape_string($username);

        $query = "SELECT id, username, password, email, credits, joinDate FROM users WHERE username='$username'";
        $result = $conn->query($query);

        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $dbHashedPassword = $row['password'];

            if (password_verify($password, $dbHashedPassword)) {
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['password'] = $password;
                $_SESSION['username'] = $row['username'];
                $_SESSION['email'] = $row['email'];
                $_SESSION['credits'] = $row['credits'];
                $_SESSION['joinDate'] = $row['joinDate'];
                return json_encode(array("success" => true, "message" => "Login successful", "userData" => array(
                    "id" => $row['id'],
                    "username" => $row['username'],
                    "password" => $password,
                    "email" => $row['email'],
                    "credits" => $row['credits'],
                    "joinDate" => $row['joinDate']
                )));
            } else {
                return json_encode(array("success" => false, "message" => "Invalid password"));
            }
        } else {
            return json_encode(array("success" => false, "message" => "Invalid username"));
        }
    }
}

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $login = new Login();

    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['username']) && isset($data['password'])) {
        $username = $data['username'];
        $password = $data['password'];

        echo $login->loginUser($username, $password);
    } else {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Username or password not provided"));
    }
} else {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
}

?>
