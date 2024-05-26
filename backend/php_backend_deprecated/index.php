<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Response from PHP XD</title>
</head>
<body>
    <p>XD</p>
    <?php
    function saveToDatabase($dataReceived, $servername, $username, $password, $dbname) {
        if (!empty($dataReceived)) {
            $conn = new mysqli($servername, $username, $password, $dbname);
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }
            $sql = "INSERT INTO test (data) VALUES ('" . $dataReceived['text'] . "')";
            if ($conn->query($sql) === TRUE) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
            $conn->close();
        } else {
            echo "No POST data received.";
        }
    }

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    $dataReceived = json_decode(file_get_contents('php://input'), true);

    echo json_encode(['receivedData' => $dataReceived]);

    echo "<p>String: $dataReceived</p>";
    if ($dataReceived) {
        echo "<h1>Data received from Angular:</h1>";
        echo "<p>String: $dataReceived</p>";
    } else {
        echo "<h1>Error: No data received</h1>";
    }

    // Database configuration
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "board_meetings";


    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT * FROM test";
    $result = $conn->query($sql);
    // Check if there are rows
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "ID: " . $row["id"] . " - Name: " . $row["data"] . "<br>";
        }
    } else {
        echo "0 results";
    }

    $conn->close();

    ?>
</body>
</html>
