<?php
include 'db.php';

// Check if the request is a GET or POST request
if ($_SERVER['REQUEST_METHOD'] === 'GET' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if userId is sent in either GET or POST request
    if (isset($_REQUEST['userId'])) {
        // Process the request to fetch personal leaderboard
        $userId = $_REQUEST['userId'];

        $db = new DB();
        $conn = $db->conn;

        // Fetch personal leaderboard with usernames and game dates
        $sql = "SELECT users.username, scores.score, scores.game_date 
                FROM scores 
                JOIN users ON scores.user_id = users.id 
                WHERE user_id = ? 
                ORDER BY score DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $personalLeaderboard = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        // Return personal leaderboard
        echo json_encode($personalLeaderboard);
    } else {
        // Required fields are missing
        echo json_encode(['success' => false, 'message' => 'Missing userId']);
    }
} else {
    // Invalid request method
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
