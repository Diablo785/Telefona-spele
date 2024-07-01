<?php
require 'vendor/autoload.php';
require_once 'db.php';

session_start();

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

if (!isset($data->amount) || $data->amount <= 0) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid amount']);
    exit();
}

$amount = $data->amount;

error_log("Received amount: " . $amount);

$db = new DB();
$conn = $db->conn;

$stripe = new \Stripe\StripeClient('sk_test_51PFvvo1DYMoaKsH8GAToC0uk27fD9isoP1ltcZkRWSMihNtdg3TB5MTCTLEMFL5IKFN0nIOTpJsxQdd49qKxA52f006M8HfRd3'); 

try {
    $customer = $stripe->customers->create();
    $ephemeralKey = $stripe->ephemeralKeys->create([
      'customer' => $customer->id,
    ], [
      'stripe_version' => '2024-04-10',
    ]);
    $paymentIntent = $stripe->paymentIntents->create([
      'amount' => $amount * 50,
      'currency' => 'eur',
      'customer' => $customer->id,
      'description' => 'Naintijs ir lohs',
      'automatic_payment_methods' => [
        'enabled' => 'true',
      ],
    ]);

    error_log("Payment intent created successfully");

    header('Content-Type: application/json');
    echo json_encode(
      [
        'paymentIntent' => $paymentIntent->client_secret,
        'ephemeralKey' => $ephemeralKey->secret,
        'customer' => $customer->id,
        'publishableKey' => 'pk_test_51PFvvo1DYMoaKsH8LU7h9j4D9sDRlIWQgtH9LPLuwlQjL9Izayz3lbGCsWoNd8DcwUP5GPWdoy2TzrDT4cfiFRgS00Xc1Yk8vr',
      ]
    );
    http_response_code(200);
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
}
?>
