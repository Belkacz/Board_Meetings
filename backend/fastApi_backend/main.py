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

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="meetingsAdmin",
        password="MeetTheAdmin123",
        database="db_meetings",
        port="3306"
    )

# @app.on_event("startup")
def get_guests():
    connection = get_db_connection()
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
    connection = get_db_connection()
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
    connection = get_db_connection()
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

def update_meetings():
    # Pobierz gości (dla późniejszego przypisania)
    guests_dict = get_guests()

    # Połączenie z bazą danych
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    sqlQuery = """
    SELECT 
        meeting.id AS meeting_id,
        meeting.meeting_name,
        meeting.start_date,
        meeting.end_date,
        meeting.meeting_address,
        meeting.online_address,
        meeting_type.type_name AS meeting_type,
        agenda.name AS agenda_name,
        GROUP_CONCAT(DISTINCT guest.id, ';',  guest.name, ';', guest.surname, ';', guest.job_position) AS guests,
        GROUP_CONCAT(DISTINCT document.doc_address) AS documents,
        GROUP_CONCAT(DISTINCT task.name) AS tasks,
        GROUP_CONCAT(DISTINCT orders.order) AS orders
    FROM 
        meeting
    LEFT JOIN meeting_type ON meeting.meeting_type = meeting_type.id
    LEFT JOIN agenda ON meeting.agenda = agenda.id
    LEFT JOIN guests_list ON meeting.id = guests_list.fk_meeting
    LEFT JOIN guest ON guests_list.fk_guest_id = guest.id
    LEFT JOIN documents_list ON meeting.id = documents_list.fk_meeting
    LEFT JOIN document ON documents_list.fk_document_id = document.id
    LEFT JOIN tasks_list ON meeting.id = tasks_list.fk_tasks
    LEFT JOIN task ON tasks_list.fk_task_id = task.id
    LEFT JOIN orders_list ON agenda.id = orders_list.fk_agenda
    LEFT JOIN orders ON orders_list.fk_order = orders.id
    GROUP BY 
        meeting.id, meeting.meeting_name, meeting.start_date, meeting.end_date, meeting.meeting_address, meeting.online_address, meeting_type.type_name, agenda.name;
    """
    cursor.execute(sqlQuery)
    results = cursor.fetchall()

    global meetings
    meetings = []
    
    for row in results:
        guest_list = []
        if row['guests']:
            raw_guest_list = row['guests'].split(',')
            for raw_guest in raw_guest_list:
                guest_data = raw_guest.split(';')
                new_guest = Guest(id=guest_data[0], name=guest_data[1], surname=guest_data[2], job_position=guest_data[3])  
                guest_list.append(new_guest)
            document_list = []
            if row['documents']:
                document_list = row['documents'].split(', ')

        # Parse tasks
        task_list = []
        if row['tasks']:
            task_list = [{"name": task.strip()} for task in row['tasks'].split(', ')]

        # Parse orders (optional)
        order_list = []
        if row['orders']:
            order_list = row['orders'].split(', ')
            
        print(document_list)
        
        for i in range(len(document_list)):
            document_list[i] = '/files/' + document_list[i]
        print(document_list)
        # Add parsed meeting
        meetings.append(
            ExistedMeeting(
                id=row['meeting_id'],
                meeting_type=row['meeting_type'] or "unknownType",
                meeting_name=row['meeting_name'],
                start_date=row['start_date'].isoformat(),
                end_date=row['end_date'].isoformat(),
                meeting_address=row['meeting_address'],
                online_address=row['online_address'],
                guests=guest_list,
                tasksList=task_list,
                agenda={"name": row['agenda_name']},
                documents=document_list,
            )
        )

    # Close connections
    cursor.close()
    connection.close()

    print("Updated meetings:", meetings)


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
    update_meetings()
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

    print(response_data)
    return response_data

@app.get(
    "/meeting-details/{meeting_id}",
    response_model=ExternalExistedMeeting,
    responses={
        404: {"description": "Meeting not found", "model": ErrorResponse},
    },
)
async def getMeetingDetails(meeting_id: int):
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
    guests = get_guests()
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
    print(file_name)
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
    if len(meetings) > 0:
        last_meeting = meetings[-1]
    else:
        last_meeting = 1

    new_meeting_id = last_meeting.id + 1

    if meeting.agenda.id == None and meeting.agenda.agendaName != None:
        meeting.agenda.id = create_agenda_id()
    if meeting.agenda.id == None and meeting.agenda.agendaName == None:
        meeting.agenda = None

    new_meeting = map_new_meeting_incoming(new_meeting_id, meeting)

    if not at_least_one_address(new_meeting.meeting_address, new_meeting.online_address):
        raise HTTPException(
            status_code=403,
            detail="Meeting need at least one meeting address or online address",
        )
    meetings.append(new_meeting)
    return {"message": f"Created new meeting with id# {new_meeting_id}"}


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
        edited_meeting.agenda.id = create_agenda_id(agendas)
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
    for index, meeting in enumerate(meetings):
        if meeting.id == updated_meeting.id:
            if meeting.documents is not None and len(meeting.documents) > 0:
                print(meeting.documents)
                if meeting.documents != None:
                    deleteFiles(
                        filesNotInOriginal(updated_meeting.documents, meeting.documents)
                    )
            meetings[index] = updated_meeting
            meetingUpdated = True
    if meetingUpdated == False:
        raise HTTPException(
            status_code=404, detail=f"Meeting with id #{edited_meeting.id} not found"
        )

    return {"editedMeeting": f"Updated meeting with id #{updated_meeting.id}"}


@app.delete(
    "/delete-meeting/{meeting_id}",
    responses={
        404: {"description": "Meeting not found", "model": ErrorResponse},
    },
)
async def delete_meetings(meeting_id: int):
    tempMeetings = meetings
    for meeting in tempMeetings:
        if meeting.id == meeting_id:
            if meeting.documents:
                deleteFiles(meeting.documents)
            meetings.remove(meeting)
            return f"deleted meeting #{meeting_id}"
    raise HTTPException(
        status_code=404, detail=f"Meeting with id #{meeting_id} not found"
    )


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
