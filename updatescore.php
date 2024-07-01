<?php
include 'db.php';

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON content sent in the request
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if the required fields are present
    if (isset($data['userId']) && isset($data['score'])) {
        // Process the request to insert score into the database
        $userId = $data['userId'];
        $score = $data['score'];
        $gameDate = date('Y-m-d H:i:s'); // Current timestamp

        $db = new DB();
        $conn = $db->conn;  

        // Prepare and bind the INSERT statement
        $stmt = $conn->prepare("INSERT INTO scores (user_id, score, game_date) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $userId, $score, $gameDate);

        // Execute the statement
        if ($stmt->execute()) {
            // Score inserted successfully
            echo json_encode(['success' => true, 'message' => 'Score inserted successfully']);
        } else {
            // Error inserting score
            echo json_encode(['success' => false, 'message' => 'Error inserting score']);
        }

        // Close statement and database connection
        $stmt->close();
        $conn->close();
    } else {
        // Required fields are missing
        echo json_encode(['success' => false, 'message' => 'Missing userId or score']);
    }
} else {
    // Invalid request method
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
