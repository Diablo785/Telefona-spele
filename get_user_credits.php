<?php
include 'db.php';

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON content sent in the request
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if the required fields are present
    if (isset($data['userId'])) {
        // Process the request to fetch user credits
        $userId = $data['userId'];

        $db = new DB();
        $conn = $db->conn;

        $sql = "SELECT credits FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $userCredits = $row['credits'];
        $stmt->close();

        // Return user credits
        echo json_encode(['credits' => $userCredits]);
    } else {
        // Required fields are missing
        echo json_encode(['success' => false, 'message' => 'Missing userId']);
    }
} else {
    // Invalid request method
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
