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
            var_dump($dataReceived);
            $start_date = date('Y-m-d H:i:s', strtotime($receivedData['start_date']));
            $end_date = date('Y-m-d H:i:s', strtotime($receivedData['end_date']));    
            $sql = "INSERT INTO t_meetings (meeting_type, meeting_name, start_date, end_date, meeting_address, online_address, fk_id_gests, fk_id_tasks) 
            VALUES ('" . $dataReceived['meeting_type'] .
            "', '" . $dataReceived['meeting_name'] .
            "', '" . $start_date .
            "', '" . $end_date .
            "', '" . $dataReceived['meeting_address'] .
            "', '" . $dataReceived['online_address'] .
            "', '" . 0 .
            "', '" . 0 . "')";
            // $sql = "INSERT INTO t_meetings (meeting_type) VALUES ('" . $dataReceived['meeting_type'] . "')";
            // $sql = "INSERT INTO t_meetings (meeting_name) VALUES ('" . $dataReceived['meeting_name'] . "')";
            // $sql = "INSERT INTO t_meetings (start_date) VALUES ('" . $dataReceived['start_date'] . "')";
            // $sql = "INSERT INTO t_meetings (end_date) VALUES ('" . $dataReceived['end_date'] . "')";
            // $sql = "INSERT INTO t_meetings (meeting_address) VALUES ('" . $dataReceived['meeting_address'] . "')";
            // $sql = "INSERT INTO t_meetings (online_address) VALUES ('" . $dataReceived['online_address'] . "')";
            // $sql = "INSERT INTO t_meetings (fk_id_gests) VALUES ('" . 0 . "')";
            // $sql = "INSERT INTO t_meetings (fk_id_tasks) VALUES ('" . 0 . "')";
            if ($conn->query($sql) === TRUE) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
            $conn->close();
        } else {
            echo "No POST data received." . "<br>";
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

    saveToDatabase($dataReceived, $servername, $username, $password, $dbname);


    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT * FROM t_meetings";
    $result = $conn->query($sql);
    // Check if there are rows
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo("ID: " . $row["id_meeting"] .
                " - meeting type: " . $row["meeting_type"] .
                " - meeting name: " . $row["meeting_name"] .
                " - start date: " . $row["start_date"] .
                " - end date: " . $row["end_date"] . 
                " - meeting address: " . $row["meeting_address"] .
                " - online address: " . $row["online_address"] .
                " - fk_id_gests: " . $row["fk_id_gests"] .
                " - fk_id_tasks: " . $row["fk_id_tasks"] ."<br>"
            );
        }
    } else {
        echo "0 results";
    }

    // Close connection
    $conn->close();

    ?>
</body>
</html>
