<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Response from PHP</title>
</head>
<body>
    <p>Base response</p>
    <?php
function saveMeetingToDatabase($dataReceived, $servername, $username, $password, $dbname) {
    if (!empty($dataReceived)) {
        $conn = new mysqli($servername, $username, $password, $dbname);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        if($dataReceived['start_date'] != NULL) {
            $startDate = date('Y-m-d H:i:s', strtotime($dataReceived['start_date']));
        }
        if($dataReceived['end_date'] != NULL) {
            $endDate = date('Y-m-d H:i:s', strtotime($dataReceived['end_date']));
        }

        $create_meeting = "INSERT INTO t_meetings (meeting_type, meeting_name, start_date, end_date, meeting_address, online_address) 
        VALUES ('" . $dataReceived['meeting_type'] .
        "', '" . $dataReceived['meeting_name'] .
        "', '" . $startDate .
        "', '" . $endDate .
        "', '" . $dataReceived['meeting_address'] .
        "', '" . $dataReceived['online_address'] . "')";

        if ($conn->query($create_meeting) === TRUE) {
            $meetingId = $conn->insert_id;
            echo "New record created successfully. Meeting ID: " . $meetingId . "<br>";

            if($dataReceived['guests'] != NULL){
                addGuestsToMeeting($dataReceived['guests'], $meetingId, $conn);
            }
            if($dataReceived['tasks'] != NULL){
                addTasksToMeeting($dataReceived['tasks'], $meetingId, $conn);
            }
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $conn->close();
    } else {
        echo "No POST data received." . "<br>";
    }
}

function addGuestsToMeeting($guests, $meetingId, $conn) {
    foreach ($guests as $guest) {
        $foundGuestFlag = FALSE;
        $guestId = $guest['id'];

        $sqlPersonSelect = "SELECT id_person, firstname, surname FROM t_person";
        $databasePersons = $conn->query($sqlPersonSelect);

        if ($databasePersons->num_rows > 0) {
            while ($row = $databasePersons->fetch_assoc()) {
                if ($row["id_person"] == $guestId) {
                    $foundGuestFlag = TRUE;
                    break;
                }
            }
        } else {
            echo "0 results from t_persons table";
        }

        if ($foundGuestFlag) {
            $sqlInsertGuests = "INSERT INTO t_guests (fk_id_meeting, fk_id_person) 
                            VALUES ('$meetingId', '$guestId')";
        } else {
            $sqlInsertPerson = "INSERT INTO t_person (firstname, surname, contact_email)
                VALUES ('" . $guest['name'] . "', '" . $guest['surname'] . "', '" . $guest['contact_email'] . "')";
            if ($conn->query($sqlInsertPerson) === TRUE) {
                $guestId = $conn->insert_id;
        
                $sqlInsertGuests = "INSERT INTO t_guests (fk_id_meeting, fk_id_person) 
                                VALUES ('$meetingId', '$guestId')";
                echo "New Person created successfully. Guest ID: " . $guestId . "<br>";
            } else {
                echo "Error: " . $sqlInsertPerson . "<br>" . $conn->error;
            }
        }

        if ($conn->query($sqlInsertGuests) === TRUE) {
            echo "Guest added successfully. Guest ID: " . $guestId . "<br>";
        } else {
            echo "Error adding guest: " . $conn->error;
        }
    }
}

function addTasksToMeeting($tasks, $meetingId, $conn) {
    foreach ($tasks as $task) {
        $foundTaskFlag = FALSE;
        $taskId = $task['id'];

        $sql_tasks = "SELECT id_task, task_name, standard_duration FROM t_task";
        $database_tasks = $conn->query($sql_tasks);

        if ($database_tasks->num_rows > 0) {
            while ($row = $database_tasks->fetch_assoc()) {
                if ($row["id_task"] == $taskId) {
                    $foundTaskFlag = TRUE;
                    break;
                }
            }
        } else {
            echo "0 results from t_task table";
        }

        if ($foundTaskFlag) {
            $sqlInsertMeetingTasks = "INSERT INTO t_meeting_tasks (fk_id_meeting, fk_id_task) 
                            VALUES ('$meetingId', '$taskId')";
        } else {
            $sqlInsertTask = "INSERT INTO t_task (task_name, standard_duration)
                VALUES ('" . $task['name'] . "', '60')";
            if ($conn->query($sqlInsertTask) === TRUE) {
                $taskId = $conn->insert_id;
        
                $sqlInsertMeetingTasks = "INSERT INTO t_meeting_tasks (fk_id_meeting, fk_id_task) 
                                VALUES ('$meetingId', '$taskId')";
                echo "New task created successfully. task ID: " . $taskId . "<br>";
            } else {
                echo "Error: " . $sqlInsertTask . "<br>" . $conn->error;
            }
        }

        if ($conn->query($sqlInsertMeetingTasks) === TRUE) {
            $meetingTasksId = $conn->insert_id;
            echo "Task " . $taskId . " added to meeting successfully. Meeting task ID: " . $meetingTasksId . "<br>";
        } else {
            echo "Error adding task: " . $conn->error;
        }
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

    saveMeetingToDatabase($dataReceived, $servername, $username, $password, $dbname);

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
