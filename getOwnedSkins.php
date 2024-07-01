<?php
require_once 'db.php';

session_start();

$user_id = $_SESSION['user_id'] ?? null;

if ($user_id === null) {
    http_response_code(401);
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

class Skins {
    private $db;

    public function __construct() {
        $this->db = new DB();
    }

    public function getOwnedSkins($user_id) {
        $query = "SELECT skin_name FROM user_skins WHERE user_id = ?";
        $stmt = $this->db->conn->prepare($query);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $skins = [];
        while ($row = $result->fetch_assoc()) {
            $skins[] = $row['skin_name'];
        }

        $stmt->close();
        return $skins;
    }
}

$skins = new Skins();
$ownedSkins = $skins->getOwnedSkins($user_id);

echo json_encode(['ownedSkins' => $ownedSkins]);
?>
