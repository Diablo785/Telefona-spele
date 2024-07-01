<?php
session_start();

require_once 'db.php';

class GetUserData {
    private $db;

    public function __construct() {
        $this->db = new DB();
    }

    public function getUserData() {
        if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
            $user_id = $_SESSION['user_id'];
            $username = $_SESSION['username'];

            $conn = $this->db->conn;

            $stmt = $conn->prepare("SELECT id, username, email, credits, joinDate FROM users WHERE id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows == 1) {
                $row = $result->fetch_assoc();
                $row['password'] = $_SESSION['password']; // Include the plain text password
                return json_encode(array("success" => true, "user" => $row));
            } else {
                return json_encode(array("success" => false, "message" => "User data retrieval failed"));
            }
        } else {
            return json_encode(array("success" => false, "message" => "User not logged in"));
        }
    }
}

header('Content-Type: application/json');

$get_user_data = new GetUserData();
echo $get_user_data->getUserData();

?>
