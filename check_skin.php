<?php
include 'db.php';

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON content sent in the request
    $data = json_decode(file_get_contents('php://input'), true);

    if($data === null) {
        // JSON data is not valid
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }

    // Check if the required fields are present
    if (isset($data['userId']) && isset($data['skinName'])) {
        // Check if the user owns the skin
        $userId = $data['userId'];
        $skinName = $data['skinName'];

        $db = new DB();
        $conn = $db->conn;

        $sql = "SELECT COUNT(*) as count FROM user_skins WHERE user_id = ? AND skin_name = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $userId, $skinName);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $owned = $row['count'] > 0;
        $stmt->close();

        echo json_encode(['owned' => $owned]);
    } else {
        // Required fields are missing
        echo json_encode(['success' => false, 'message' => 'Missing userId or skinName']);
    }
} else {
    // Invalid request method
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
