<?php
include 'db.php';

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON content sent in the request
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if the required fields are present
    if (isset($data['userId']) && isset($data['skinName'])) {
        // Process the purchase
        $userId = $data['userId'];
        $skinName = $data['skinName'];

        // Simulate purchase completion
        // Here you can implement your own logic to handle the purchase
        // For example, update the database, send confirmation email, etc.
        $db = new DB();
        $conn = $db->conn;

        // Get skin price
        $sql = "SELECT price FROM skins WHERE name = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $skinName);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $price = $row['price'];
        $stmt->close();

        // Check if the user has enough credits
        $sql = "SELECT credits FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $userCredits = $row['credits'];
        $stmt->close();

        if ($userCredits >= $price) {
            // Insert the purchased skin into user_skins table
            $sql = "INSERT INTO user_skins (user_id, skin_name, skin_id) VALUES (?, ?, (SELECT id FROM skins WHERE name = ?))";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("iss", $userId, $skinName, $skinName);
            $stmt->execute();
            $stmt->close();

            // Update user credits
            $sql = "UPDATE users SET credits = credits - ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $price, $userId);
            $stmt->execute();
            $stmt->close();

            // Fetch updated user credits
            $sql = "SELECT credits FROM users WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $userCredits = $row['credits'];
            $stmt->close();

            // Return a response
            $response = "Purchase successful! You bought $skinName skin for $price credits.";
            echo json_encode(['success' => true, 'message' => $response, 'credits' => $userCredits]);
        } else {
            // Not enough credits
            echo json_encode(['success' => false, 'message' => 'Insufficient credits']);
        }
    } else {
        // Required fields are missing
        echo json_encode(['success' => false, 'message' => 'Missing userId or skinName']);
    }
} else {
    // Invalid request method
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
