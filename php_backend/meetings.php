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
            // var_dump($dataReceived);
            if($dataReceived['start_date'] != NULL) {
                $start_date = date('Y-m-d H:i:s', strtotime($receivedData['start_date']));
            }
            if($dataReceived['end_date'] != NULL) {
                $end_date = date('Y-m-d H:i:s', strtotime($receivedData['end_date']));
            }
            $sql = "INSERT INTO t_meetings (meeting_type, meeting_name, start_date, end_date, meeting_address, online_address) 
            VALUES ('" . $dataReceived['meeting_type'] .
            "', '" . $dataReceived['meeting_name'] .
            "', '" . $start_date .
            "', '" . $end_date .
            "', '" . $dataReceived['meeting_address'] .
            "', '" . $dataReceived['online_address'] . "')";
            var_dump("DUPA !!! " . "<br>");
            if ($conn->query($sql) === TRUE) {
                // echo "New record created successfully";
                $meeting_id = $conn->insert_id;
                echo "New record created successfully. Meeting ID: " . $meeting_id . "<br>";



                if($dataReceived['guests'] != NULL){
                    $sql_person = "SELECT id_person, firstname, surname FROM t_person";
                    $database_persons = $conn->query($sql_person);
                    foreach ($dataReceived['guests'] as $guest) {
                        $found_guest_flag = FALSE;
                        $guest_id = $guest['id'];
                        if ($database_persons->num_rows > 0) {
                            var_dump(" LE ITRACJĄ " . "<br>");
                            while ($row = $database_persons->fetch_assoc()) {
                                $row["id_person"] == $guest_id;
                                $found_guest_flag = TRUE;
                                var_dump($row['id_person'] . ' , ' .$row['firstname'] . ' , ' . $row['surname']  . "<br>");
                            }
                        } else {
                            echo "0 results from t_persons table";
                        }
                        var_dump("FALG  !!!!" . "<br>" . $found_guest_flag);
                        if ($found_guest_flag) {
                            $sql_guests = "INSERT INTO t_guests (fk_id_meeting, fk_id_person) 
                                            VALUES ('$meeting_id', '$guest_id')";
                        } else {
                            $sql_insert_person = "INSERT INTO t_person (firstname, surname, contact_email)
                                VALUES ('" . $guest['name'] . "', '" . $guest['surname'] . "', '" . $guest['contact_email'] . "')";
                        
                            if ($conn->query($sql_insert_person) === TRUE) {
                                $guest_id = $conn->insert_id;
                        
                                $sql_guests = "INSERT INTO t_guests (fk_id_meeting, fk_id_person) 
                                                VALUES ('$meeting_id', '$guest_id')";
                                echo "New Person created successfully. Guest ID: " . $guest_id . "<br>";
                            } else {
                                echo "Error: " . $sql_insert_person . "<br>" . $conn->error;
                            }
                        }
                        if ($conn->query($sql_guests) === TRUE) {
                            echo "Guest added successfully. Guest ID: " . $guest_id . "<br>";
                        } else {
                            echo "Error adding guest: " . $conn->error;
                        }
                    }
                }
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
                " - online address: " . $row["online_address"] . "<br>"
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
