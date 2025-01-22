from numbers import Number
import os
from fastapi import FastAPI, Depends, File, UploadFile, HTTPException
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, Dict, List, Optional, Union
from fastapi.staticfiles import StaticFiles
from uuid import uuid4
from fastapi.responses import FileResponse

from meetings import (
    ExternalAgenda,
    meetings,
    guests,
    agendas,
    ExternalGuest,
    ExternalExistedMeeting,
    Guest,
    Agenda,
    ExistedMeeting,
    ShortMeeting,
    PagedListMeetings,
    ErrorResponse,
    ExternalShortMeeting,
    ExternalBaseMeeting,
    Task,
    MeetingType
)


from frontHandlers import (
    map_short_meeting_to_send,
    map_guests_to_send,
    map_meeting_to_send,
    at_least_one_address,
    map_guests_incoming,
    map_agenda_incoming,
    map_agenda_incoming,
    map_agenda_outgoing,
    map_new_meeting_incoming,
    map_existed_meeting_incoming,
    map_people_to_send,
    create_agenda_id
)

from projectInformation import projectInfo1, ProjectDataExternal

app = FastAPI()

# database Connection
def db_get_connection():
    hostAddress = None
    try:
        hostAddress = os.environ['DB_HOST']
    except:
        print("Domyślny host")
        hostAddress = "localhost"
    return mysql.connector.connect(
        host=hostAddress,
        user="meetingsAdmin",
        password="MeetTheAdmin123",
        database="db_meetings",
        port="3306",
        collation="utf8mb4_general_ci"
    )

# @app.on_event("startup")
def db_get_guests():
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)
    
    sqlQuery = "SELECT id, name, surname, job_position FROM guest"
    cursor.execute(sqlQuery)
    result = cursor.fetchall()

    guests = [Guest(id=guest['id'], name=guest['name'], surname=guest['surname'], job_position=guest['job_position']) for guest in result]
    cursor.close()
    connection.close()

    return guests


def map_agendas(results: List[Dict[str, Any]]) -> List[Agenda]:
    agenda_dict = {}

    for row in results:
        agenda_id = row["agenda_id"]
        agenda_name = row["agenda_name"]
        order_name = row["order_name"]

        if agenda_id not in agenda_dict:
            agenda_dict[agenda_id] = {
                "name": agenda_name,
                "orders": []
            }

        if order_name:
            agenda_dict[agenda_id]["orders"].append(order_name)

    return [
        Agenda(id=agenda_id, name=agenda_data["name"], order=agenda_data["orders"])
        for agenda_id, agenda_data in agenda_dict.items()
    ]

def get_agendas():
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)
    
    sqlQuery = """
    SELECT 
        agenda.id AS agenda_id,
        agenda.name AS agenda_name,
        order.id AS order_id,
        order.order AS order_name
    FROM agenda
    LEFT JOIN orders_list ON a.id = orders_list.fk_agenda
    LEFT JOIN orders ON orders_list.fk_order = order.id;
    """

    cursor.execute(sqlQuery)
    results = cursor.fetchall()
    return results

def get_agendas():
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)
    
    sqlQuery = """
    SELECT 
        agenda.id AS agenda_id,
        agenda.name AS agenda_name,
        orders.id AS order_id,
        orders.order AS order_name
    FROM agenda
    LEFT JOIN orders_list ON agenda.id = orders_list.fk_agenda
    LEFT JOIN orders ON orders_list.fk_order = orders.id;
    """

    cursor.execute(sqlQuery)
    results = cursor.fetchall()
    return results

def db_delete_meeting(meeting: ExistedMeeting) -> bool:
    meeting_id = meeting.id
    print(type(meeting))
    print(meeting)
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        sql_query_select = "SELECT id, meeting_name FROM meeting WHERE id = %s"
        cursor.execute(sql_query_select, (meeting.id,))
        meeting_db = cursor.fetchone()
        if not meeting_db:
            raise HTTPException(
                status_code=404, detail=f"Meeting with id #{meeting_id} not found"
            )
        if(meeting.documents):
            sql_query_delete_doc_list = "DELETE FROM documents_list WHERE fk_meeting = %s"
            cursor.execute(sql_query_delete_doc_list, (meeting_id,))
            for doc in meeting.documents:
                sql_query_delete_doc = """
                    DELETE FROM document 
                    WHERE doc_address = %s
                """
                cursor.execute(sql_query_delete_doc, (doc,))
        if(meeting.guests):
            sql_query_delete_guests = "DELETE FROM guests_list WHERE fk_meeting = %s"
            cursor.execute(sql_query_delete_guests, (meeting_id,))
        if(meeting.tasksList):
            sql_query_delete_task_list = "DELETE FROM tasks_list WHERE fk_meeting = %s"
            cursor.execute(sql_query_delete_task_list, (meeting_id,))
            for task in meeting.tasksList:
                sql_query_delete_tasks = """
                    DELETE FROM task 
                    WHERE task.id = %s
                """
                cursor.execute(sql_query_delete_tasks, (task.id,))

        sql_query_delete_meeting = "DELETE FROM meeting WHERE id = %s"
        cursor.execute(sql_query_delete_meeting, (meeting_id,))
        connection.commit()
        return True
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting meeting: {str(e)}")
    finally:
        cursor.close()
        connection.close()

def db_map_meeting(meeting: Dict[str, Any]) -> ExistedMeeting:
        guest_list = []
        if meeting['guests']:
            raw_guest_list = meeting['guests'].split(',')
            for raw_guest in raw_guest_list:
                guest_data = raw_guest.split(';')
                new_guest = Guest(id=guest_data[0], name=guest_data[1], surname=guest_data[2], job_position=guest_data[3])
                guest_list.append(new_guest)

        document_list = []
        if meeting['documents']:
            for doc in meeting['documents'].split(','):
                document_list.append(doc.strip())

        task_list = []
        if meeting['tasks']:
            raw_tasks_list = meeting['tasks'].split(',')
            for raw_tasks in raw_tasks_list:
                task_data = raw_tasks.split(';')
                new_Task = Task(id=task_data[0], name=task_data[1], description=task_data[2])
                task_list.append(new_Task)

        meeting_agenda = Agenda()
        agendas = get_agendas()
        agenda_orders = []
        for agenda in agendas:
            if agenda['agenda_id'] == meeting['agenda_id']:
                meeting_agenda.id = agenda['agenda_id']
                meeting_agenda.name = agenda['agenda_name']
                agenda_orders.append(agenda['order_name'])
        meeting_agenda.order = agenda_orders

        
        for i in range(len(document_list)):
            document_list[i] = document_list[i]

        new_meeting = ExistedMeeting(
                id=meeting['meeting_id'],
                meeting_type=meeting['meeting_type'] or "unknownType",
                meeting_name=meeting['meeting_name'],
                start_date=meeting['start_date'].isoformat(),
                end_date=meeting['end_date'].isoformat(),
                meeting_address=meeting['meeting_address'],
                online_address=meeting['online_address'],
                guests=guest_list,
                tasksList=task_list,
                agenda=meeting_agenda,
                documents=document_list,
            )
        return new_meeting

def db_get_meeting(meeting_id: Number):
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        sql_query = """
        SELECT 
            meeting.id AS meeting_id,
            meeting.meeting_name,
            meeting.start_date,
            meeting.end_date,
            meeting.meeting_address,
            meeting.online_address,
            meeting_type.type_name AS meeting_type,
            meeting.agenda AS agenda_id,
            GROUP_CONCAT(DISTINCT guest.id, ';',  guest.name, ';', guest.surname, ';', guest.job_position) AS guests,
            GROUP_CONCAT(DISTINCT document.doc_address) AS documents,
            GROUP_CONCAT(DISTINCT task.id, ';', task.name, ';', task.description) AS tasks
        FROM 
            meeting
        LEFT JOIN meeting_type ON meeting.meeting_type = meeting_type.id
        LEFT JOIN guests_list ON meeting.id = guests_list.fk_meeting
        LEFT JOIN guest ON guests_list.fk_guest_id = guest.id
        LEFT JOIN documents_list ON meeting.id = documents_list.fk_meeting
        LEFT JOIN document ON documents_list.fk_document_id = document.id
        LEFT JOIN tasks_list ON meeting.id = tasks_list.fk_meeting
        LEFT JOIN task ON tasks_list.fk_task_id = task.id
        WHERE 
        meeting.id = %s
        GROUP BY 
            meeting.id, meeting.meeting_name, meeting.start_date, meeting.end_date, meeting.meeting_address, meeting.online_address, meeting_type.type_name, agenda_id;
        """
        cursor.execute(sql_query, (meeting_id,))
        meeting = cursor.fetchall()
        return meeting[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching meeting details: {str(e)}")
    finally:
        cursor.close()
        connection.close()

def db_get_meetings()-> List[ExistedMeeting]:
    # Połączenie z bazą danych
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        sql_query = """
        SELECT 
            meeting.id AS meeting_id,
            meeting.meeting_name,
            meeting.start_date,
            meeting.end_date,
            meeting.meeting_address,
            meeting.online_address,
            meeting_type.type_name AS meeting_type,
            meeting.agenda AS agenda_id,
            GROUP_CONCAT(DISTINCT guest.id, ';',  guest.name, ';', guest.surname, ';', guest.job_position) AS guests,
            GROUP_CONCAT(DISTINCT document.doc_address) AS documents,
            GROUP_CONCAT(DISTINCT task.id, ';', task.name, ';', task.description) AS tasks
        FROM 
            meeting
        LEFT JOIN meeting_type ON meeting.meeting_type = meeting_type.id
        LEFT JOIN guests_list ON meeting.id = guests_list.fk_meeting
        LEFT JOIN guest ON guests_list.fk_guest_id = guest.id
        LEFT JOIN documents_list ON meeting.id = documents_list.fk_meeting
        LEFT JOIN document ON documents_list.fk_document_id = document.id
        LEFT JOIN tasks_list ON meeting.id = tasks_list.fk_meeting
        LEFT JOIN task ON tasks_list.fk_task_id = task.id
        GROUP BY 
            meeting.id, meeting.meeting_name, meeting.start_date, meeting.end_date, meeting.meeting_address, meeting.online_address, meeting_type.type_name, agenda_id;
        """
        cursor.execute(sql_query)
        results = cursor.fetchall()
        meetings = []
        
        for row in results:
            meetings.append(db_map_meeting(row))
        return meetings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching meeting details: {str(e)}")
    finally:
        cursor.close()
        connection.close()
    
    
def db_add_agenda(agenda: Agenda)-> Number:
    # Połączenie z bazą danych
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        "INSERT INTO agenda (`name`) VALUES (%s)",
        (agenda.name,),
        )
    db_agenda_id = cursor.lastrowid
    connection.commit()

    try:
        for order in agenda.order:
            cursor.execute(
                "INSERT INTO orders (`order`) VALUES (%s)",
                (order,),
            )
            order_id = cursor.lastrowid

            cursor.execute(
                "INSERT INTO orders_list (fk_agenda, fk_order) VALUES (%s, %s)",
                (db_agenda_id, order_id),
            )
        
        connection.commit()
        print("Agenda and orders successfully added")
        return db_agenda_id
    except Exception as e:
        connection.rollback()
        print(f"Error while adding agenda: {str(e)}")
        raise
    finally:
        cursor.close()
        connection.close()
        
        
def db_add_meeting(meeting: ExistedMeeting)-> Number:
    # Połączenie z bazą danych
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        numeric_meeting_type = 0
        if meeting.meeting_type == MeetingType.BOARDMEETINGS:
            numeric_meeting_type = 1
        elif meeting.meeting_type == MeetingType.GENERALASSEMBLY:
            numeric_meeting_type = 2
        elif meeting.meeting_type == MeetingType.OTHER:
            numeric_meeting_type = 3
        else:
            numeric_meeting_type = 3
            print("Unknown meeting type")
        cursor.execute(
            "INSERT INTO meeting (meeting_type, meeting_name, start_date, end_date, meeting_address, online_address, agenda) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (numeric_meeting_type, meeting.meeting_name, meeting.start_date, meeting.end_date, meeting.meeting_address, meeting.online_address,  meeting.agenda.id if meeting.agenda is not None else None )
        )
        meeting_id = cursor.lastrowid
        connection.commit()
        print(f"Meeting #{meeting_id} successfully added")
        return meeting_id
    except Exception as e:
        connection.rollback()
        print(f"Error while adding agenda: {str(e)}")
        raise
    finally:
        cursor.close()
        connection.close()
        
def db_add_tasks(tasks: List[Task], meeting_id):
    # Połączenie z bazą danych
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        for task in tasks:
            cursor.execute(
                "INSERT INTO task (name, description) VALUES (%s, %s)",
                (task.name, task.description,)
            )
            task_id = cursor.lastrowid
            cursor.execute(
                "INSERT INTO tasks_list (fk_meeting, fk_task_id) VALUES (%s, %s)",
                (meeting_id, task_id,)
            )
            connection.commit()
    except Exception as e:
        connection.rollback()
        print(f"Error while adding tasks: {str(e)}")
        raise
    finally:
        cursor.close()
        connection.close()
    
def db_add_docs(docs: List[str], meeting_id):
    # Połączenie z bazą danych
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        for doc in docs:
            cursor.execute(
                "INSERT INTO document (doc_address) VALUES (%s)",
                (doc,)
            )
            doc_id = cursor.lastrowid
            cursor.execute(
                "INSERT INTO documents_list (fk_meeting, fk_document_id) VALUES (%s, %s)",
                (meeting_id, doc_id,)
            )
            connection.commit()
    except Exception as e:
        connection.rollback()
        print(f"Error while adding docs: {str(e)}")
        raise
    finally:
        cursor.close()
        connection.close()

# guests_list
def db_add_guests(guests: List[Guest], meeting_id): 
    # Połączenie z bazą danych
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        for guest in guests:
            cursor.execute(
                "INSERT INTO guests_list (fk_meeting, fk_guest_id) VALUES (%s, %s)",
                (meeting_id, guest.id,)
            )
            connection.commit()
    except Exception as e:
        connection.rollback()
        print(f"Error while adding docs: {str(e)}")
        raise
    finally:
        cursor.close()
        connection.close()

# frontEnd 
origins = ["http://localhost:4200"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

UPLOAD_DIRECTORY = "./meetings_docs"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@app.get(
    "/get-meetings/{page}/{pagesize}",
    response_model=PagedListMeetings,
    responses={
        404: {"description": "No meetings found", "model": ErrorResponse},
        400: {"description": "Invalid pagination parameters", "model": ErrorResponse},
    },
)
async def get_meetings_list(page: int, pagesize: int):
    meetings = db_get_meetings()
    if page <= 0 or pagesize <= 0:
        raise HTTPException(status_code=400, detail="Invalid pagination parameters")

    start_index = (page - 1) * pagesize
    end_index = start_index + pagesize
    if end_index > len(meetings):
        end_index = len(meetings)

    meetings_list: List[ShortMeeting] = []
    for i in range(start_index, end_index):
        short_meeting = map_short_meeting_to_send(meetings[i])
        meetings_list.append(short_meeting)

    total_length = len(meetings)
    response_data = {"meetings": meetings_list, "totalLength": total_length}
    return response_data

@app.get(
    "/meeting-details/{meeting_id}",
    response_model=ExternalExistedMeeting,
    responses={
        404: {"description": "Meeting not found", "model": ErrorResponse},
    },
)
async def getMeetingDetails(meeting_id: int):
    meetings = db_get_meetings()
    
    result_meeting: ExternalExistedMeeting = None
    if (
        meeting_id - 1 >= 0
        and meeting_id - 1 < len(meetings)
        and meetings[meeting_id - 1].id == meeting_id
    ):
        meeting = meetings[meeting_id - 1]
    if not result_meeting:
        for meeting in meetings:
            if meeting_id == meeting.id:
                result_meeting = map_meeting_to_send(meeting)
                break

    if result_meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")

    print(f"get_meetings_details #{meeting_id}")
    return result_meeting

@app.get("/get-people", response_model=list[ExternalGuest])
async def getPeopleList():
    external_guests = []
    guests = db_get_guests()
    if len(guests) > 0:
        for guest in guests:
            mapped_guest = map_people_to_send(guest)
            external_guests.append(mapped_guest)
    return external_guests


@app.get("/get-agendas", response_model=list[ExternalAgenda])
async def getAgendasList():
    agendas = map_agendas(get_agendas())
    externalAgendas = []
    for agenda in agendas:
        mappedAgenda = map_agenda_outgoing(agenda)
        externalAgendas.append(mappedAgenda)
    return externalAgendas


@app.post("/upload-files")
async def createUploadFiles(files: List[UploadFile] = File(...)):
    file_urls = []
    for file in files:
        filename = f"{uuid4()}${file.filename}"
        file_path = os.path.join(UPLOAD_DIRECTORY, filename)
        with open(file_path, "wb") as newFile:
            content = await file.read()
            newFile.write(content)
        file_urls.append(f"/files/{filename}")
    return {"file_urls": file_urls}


@app.get("/files/{file_name}")
async def get_file(file_name: str):
    file_path = os.path.join(UPLOAD_DIRECTORY, file_name)
    if os.path.exists(file_path):
        dollar_index = file_name.find("$") + 1
        new_file_name = file_name[dollar_index:] if dollar_index != 0 else file_name
        return FileResponse(
            path=file_path,
            filename=new_file_name,
            media_type='application/octet-stream'
        )
    else:
        raise HTTPException(status_code=404, detail="File not found")

@app.post("/new-meeting",
    responses={
        403: {
            "description": "Meeting need at least one meeting address or online address",
            "model": ErrorResponse,
        },
    },
)
async def add_meeting(meeting: ExternalBaseMeeting):
    if meeting.agenda.id == None and meeting.agenda.agendaName != None:
        meeting.agenda.id = db_add_agenda(map_agenda_incoming(meeting.agenda))
    if meeting.agenda.id == None and meeting.agenda.agendaName == None:
        meeting.agenda = None

    new_meeting = map_new_meeting_incoming(None, meeting)

    if not at_least_one_address(new_meeting.meeting_address, new_meeting.online_address):
        raise HTTPException(
            status_code=403,
            detail="Meeting need at least one meeting address or online address",
        )
    new_db_meeting_id = db_add_meeting(new_meeting)
    if(len(meeting.tasksList) > 0):
        db_add_tasks(meeting.tasksList, new_db_meeting_id)
    if(meeting.documents != None):
        db_add_docs(meeting.documents, new_db_meeting_id)
    if(meeting.guests != None and len(meeting.guests) > 0):
        print(meeting.guests)
        db_add_guests(meeting.guests, new_db_meeting_id)
    
    return {"message": f"Created new meeting with id# {new_db_meeting_id}"}


def filesNotInOriginal(
    editedMeetingsDocs: list[str], originalDocs: list[str]
) -> list[str]:
    if editedMeetingsDocs is None:
        editedMeetingsDocs = []
    if originalDocs is None:
        originalDocs = []

    notInEditedMeeting: list[str] = []
    for doc in originalDocs:
        if doc not in editedMeetingsDocs:
            notInEditedMeeting.append(doc)
    return notInEditedMeeting

def get_numeric_board_type(meeting_type: MeetingType)-> Number:
    numeric_meeting_type = 0
    if meeting_type == MeetingType.BOARDMEETINGS:
        numeric_meeting_type = 1
    elif meeting_type == MeetingType.GENERALASSEMBLY:
        numeric_meeting_type = 2
    elif meeting_type == MeetingType.OTHER:
        numeric_meeting_type = 3
    else:
        numeric_meeting_type = 3
        print("Unknown meeting type")
    return numeric_meeting_type

def db_update_meeting(updated_meeting: ExistedMeeting):
    connection = db_get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM meeting WHERE id = %s", (updated_meeting.id,))
        meeting_row = cursor.fetchone()
        if not meeting_row:
            raise HTTPException(
                status_code=404, detail=f"Meeting with id #{updated_meeting.id} not found"
            )

        # base meeting data
        cursor.execute(
            """
            UPDATE meeting
            SET 
                meeting_type = %s,
                meeting_name = %s,
                start_date = %s,
                end_date = %s,
                meeting_address = %s,
                online_address = %s,
                agenda = %s
            WHERE id = %s
            """,
            (
                get_numeric_board_type(updated_meeting.meeting_type),
                updated_meeting.meeting_name,
                updated_meeting.start_date,
                updated_meeting.end_date,
                updated_meeting.meeting_address,
                updated_meeting.online_address,
                updated_meeting.agenda.id if updated_meeting.agenda else None,
                updated_meeting.id,
            ),
        )

        # files / documents
        cursor.execute(
            """SELECT docs.id, docs.doc_address
            FROM document docs
            JOIN documents_list docs_list ON docs.id = docs_list.id
            WHERE docs_list.fk_meeting = %s""",
            (updated_meeting.id,)
        )
        db_docs_list = cursor.fetchall()
        db_doc_addresses = [doc['doc_address'] for doc in db_docs_list] if db_docs_list else []
        
        if updated_meeting.documents is None:
            updated_meeting.documents = []

        files_to_delete = filesNotInOriginal(updated_meeting.documents, db_doc_addresses)
        files_id_to_delete = [doc['id'] for doc in db_docs_list if doc['doc_address'] in files_to_delete]
        
        if len(files_id_to_delete) > 0:
            sql_query_delete_doc_list = "DELETE FROM documents_list WHERE fk_document_id IN (%s)"
            cursor.execute(sql_query_delete_doc_list, files_id_to_delete)
            
            sql_query_delete_doc = """
                DELETE FROM document 
                WHERE id IN (%s)
            """
            cursor.execute(sql_query_delete_doc, files_id_to_delete)
            deleteFiles(files_to_delete)

        files_to_add = filesNotInOriginal(db_doc_addresses, updated_meeting.documents)
        if files_to_add:
            for doc in files_to_add:
                cursor.execute("INSERT INTO document (doc_address) VALUES (%s)", (doc,))
                doc_id = cursor.lastrowid
                cursor.execute("INSERT INTO documents_list (fk_meeting, fk_document_id) VALUES (%s, %s)", (updated_meeting.id, doc_id))

        # tasks
        cursor.execute("""
            SELECT task.id 
            FROM task
            JOIN tasks_list ON task.id = tasks_list.fk_task_id
            WHERE tasks_list.fk_meeting = %s""", (updated_meeting.id,)
        )
        db_tasks = cursor.fetchall()
        
        if db_tasks:
            sql_query_delete_task_list = "DELETE FROM tasks_list WHERE fk_meeting = %s"
            cursor.execute(sql_query_delete_task_list, (updated_meeting.id,))
            
            sql_query_delete_tasks = """
                DELETE FROM task 
                WHERE id IN (
                    SELECT fk_task_id 
                    FROM tasks_list 
                    WHERE fk_meeting = %s
                )
            """
            cursor.execute(sql_query_delete_tasks, (updated_meeting.id,))
        
        if len(updated_meeting.tasksList) > 0:
            for task in updated_meeting.tasksList:
                cursor.execute("INSERT INTO task (name, description) VALUES (%s, %s)", (task.name, task.description,))
                task_id = cursor.lastrowid
                cursor.execute("INSERT INTO tasks_list (fk_meeting, fk_task_id) VALUES (%s, %s)", (updated_meeting.id, task_id))

        cursor.execute("""
            SELECT fk_guest_id 
            FROM guests_list 
            WHERE guests_list.fk_meeting = %s
        """, (updated_meeting.id,))
        db_guests_list = cursor.fetchall()
        
        # guests
        if db_guests_list:
            sql_query_delete_guests = "DELETE FROM guests_list WHERE fk_meeting = %s"
            cursor.execute(sql_query_delete_guests, (updated_meeting.id,))
        
        if len(updated_meeting.guests) > 0:
            for guest in updated_meeting.guests:
                cursor.execute("INSERT INTO guests_list (fk_meeting, fk_guest_id) VALUES (%s, %s)", (updated_meeting.id, guest.id))

        connection.commit()
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error when updating meeting: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.put(
    "/update-meeting",
    responses={
        403: {
            "description": "Meeting need at least one meeting address or online address",
            "model": ErrorResponse,
        },
        404: {"description": "Meeting not found", "model": ErrorResponse},
    },
)
async def update_meeting(edited_meeting: ExternalExistedMeeting):
    if edited_meeting.agenda.id == None and edited_meeting.agenda.agendaName != None:
        edited_meeting.agenda.id = db_add_agenda(map_agenda_incoming(edited_meeting.agenda))
    if edited_meeting.agenda.id == None and edited_meeting.agenda.agendaName == None:
        edited_meeting.agenda = None

    updated_meeting = map_existed_meeting_incoming(edited_meeting.id, edited_meeting)

    if not at_least_one_address(
        updated_meeting.meeting_address, updated_meeting.online_address
    ):
        raise HTTPException(
            status_code=403,
            detail="Meeting need at least one meeting address or online address",
        )
    meetingUpdated = False
    db_update_meeting(updated_meeting)

    return {"editedMeeting": f"Updated meeting with id #{updated_meeting.id}"}


@app.delete(
    "/delete-meeting/{meeting_id}",
    responses={
        404: {"description": "Meeting not found", "model": ErrorResponse},
    },
)
async def delete_meetings(meeting_id: int):
    meeting = db_get_meeting(meeting_id)
    mapped_meeting = db_map_meeting(meeting)
    if(db_delete_meeting(mapped_meeting)):
        if mapped_meeting.documents:
            deleteFiles(mapped_meeting.documents)
    # meetings.remove(mapped_meeting)
    return f"deleted meeting #{meeting_id}"

def deleteFiles(files: list[str]):
    for url in files:
        filename = url[7:]
        file_path = os.path.join(UPLOAD_DIRECTORY, filename)
        if file_path:
            try:
                os.remove(file_path)
                print(f"Deleted: {file_path}")
            except Exception as exception:
                print(f"Error when deleting: {file_path}: {exception}")
        else:
            print(f"File not found at: {file_path}")


@app.get("/get-project-info", response_model=ProjectDataExternal)
async def get_project_info():
    projectInfo = {
        "name": projectInfo1.name,
        "surname": projectInfo1.surname,
        "projectName": projectInfo1.project_name,
        "projectVersion": projectInfo1.project_version,
        "indexNumber": projectInfo1.index_number,
    }
    return projectInfo
