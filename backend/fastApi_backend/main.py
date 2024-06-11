import os
from fastapi import FastAPI, Form, File, UploadFile, HTTPException
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Union
from fastapi.staticfiles import StaticFiles
from uuid import uuid4
import ssl

from .meetings import meetings, guests, agendas, ExternalGuest, ExternalExistedMeeting, Guest, Agenda, BaseMeeting, ExistedMeeting, ShortMeeting, PagedListMeetings, ErrorResponse, ExternalShortMeeting, ExternalBaseMeeting
from .projectInformation import projectInfo1, ProjectDataExternal

app = FastAPI()

origins = [
    "http://localhost:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


def mapShortMeetingToSend(meeting: ShortMeeting) -> ExternalShortMeeting:
    return ExternalShortMeeting(
            id=meeting.id,
            meetingType=meeting.meeting_type,
            meetingName=meeting.meeting_name,
            startDate=meeting.start_date,
            endDate=meeting.end_date
        )

@app.get("/get-meetings/{page}/{pagesize}", response_model=PagedListMeetings, responses={
    404: {"description": "No meetings found", "model": ErrorResponse},
    400: {"description": "Invalid pagination parameters", "model": ErrorResponse}
})
async def get_meetings_list(page: int, pagesize: int):
    if page <= 0 or pagesize <= 0:
        raise HTTPException(status_code=400, detail="Invalid pagination parameters")

    start_index = (page - 1) * pagesize
    end_index = start_index + pagesize
    if end_index > len(meetings):
        end_index = len(meetings)

    meetings_list: List[ShortMeeting] = []
    for i in range(start_index, end_index):
        short_meeting = mapShortMeetingToSend(meetings[i])
        meetings_list.append(short_meeting)

    total_length = len(meetings)
    response_data = {
        "meetings": meetings_list,
        "total_length": total_length
    }

    if total_length <= 0:
        raise HTTPException(status_code=404, detail="No meetings found")

    print("get_meetings_list")
    return response_data

def mapGuestsToSend(meeting_guests: List[Guest]) -> list[ExternalGuest]:
    external_guests = []
    for guest in meeting_guests:
        external_guest = ExternalGuest(
            id=guest.id,
            name=guest.name,
            surname=guest.surname,
            jobPosition=guest.job_position
        )
        external_guests.append(external_guest)
    return external_guests

def mapMeetingToSend(meeting: ExistedMeeting) -> ExternalExistedMeeting:
    guests = mapGuestsToSend(meeting.guests)
    return ExternalExistedMeeting(
        id=meeting.id,
        meetingName=meeting.meeting_name,
        meetingType=meeting.meeting_type,
        startDate=meeting.start_date,
        endDate=meeting.end_date,
        meetingAddress=meeting.meeting_address,
        onlineAddress=meeting.online_address,
        guests=guests,
        tasksList=meeting.tasksList,
        agenda=meeting.agenda,
        documents=meeting.documents
    )

@app.get("/meeting-details/{meeting_id}", response_model=ExternalExistedMeeting, responses={
    404: {"description": "Meeting not found", "model": ErrorResponse},
})
async def get_meeting_detials(meeting_id: int):
    result_meeting:ExternalExistedMeeting = None
    if(meeting_id-1 >= 0 and meeting_id-1 < len(meetings) and meetings[meeting_id-1].id == meeting_id):
        meeting = meetings[meeting_id-1]
    if(not result_meeting):
        for meeting in meetings:
            if meeting_id == meeting.id:
                result_meeting = mapMeetingToSend(meeting)
                break

    if result_meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")

    print(f"get_meetings_details #{meeting_id}")
    return result_meeting

@app.get("/get-people", response_model=list[Guest])
async def get_people_list():
    print("people")
    return guests

@app.get("/get-agendas", response_model=list[Agenda])
async def get_agendas_list():
    print("agendas")
    return agendas

UPLOAD_DIRECTORY = "fastApi_backend/meetings_docs"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@app.post("/upload-files/")
async def create_upload_files(files: List[UploadFile] = File(...)):
    file_urls = []
    for file in files:
        filename = f"{uuid4()}${file.filename}"
        file_path = os.path.join(UPLOAD_DIRECTORY, filename)
        with open(file_path, "wb") as newFile:
            content = await file.read()
            newFile.write(content) 
        file_urls.append(f"/files/{filename}")
    return {"file_urls": file_urls}

app.mount("/files", StaticFiles(directory=UPLOAD_DIRECTORY), name="files")


def atLeastOneAddress(meeting_address: str, online_address: str) -> bool:
    if (meeting_address and len(meeting_address) > 0) or (online_address and len(online_address) > 0):
        return True
    else:
        return False

def mapGuestsIncoming(meeting_guests: list[ExternalGuest]) -> list[Guest]:
    guests = []
    for guest in meeting_guests:
        mapped_guest = Guest(
            id=guest.id,
            name=guest.name,
            surname=guest.surname,
            job_position=guest.jobPosition
        )
        guests.append(mapped_guest)
    return guests

def mapMeetingIncoming(new_id: int, meeting: Union[ExternalBaseMeeting, ExternalExistedMeeting]) -> Optional[ExistedMeeting]:
    guests = mapGuestsIncoming(meeting.guests)
    return ExistedMeeting(
        id=new_id,
        meeting_type=meeting.meetingType,
        meeting_name=meeting.meetingName,
        start_date=meeting.startDate,
        end_date=meeting.endDate,
        meeting_address=meeting.meetingAddress,
        online_address=meeting.onlineAddress,
        guests=guests,
        tasksList=meeting.tasksList,
        agenda=meeting.agenda,
        documents=meeting.documents
    )

def mapMeetingIncoming(new_id: int, meeting: ExternalExistedMeeting) -> Optional[ExistedMeeting]:
    guests = mapGuestsIncoming(meeting.guests)
    return ExistedMeeting(
        id=new_id,
        meeting_type=meeting.meetingType,
        meeting_name=meeting.meetingName,
        start_date=meeting.startDate,
        end_date=meeting.endDate,
        meeting_address=meeting.meetingAddress,
        online_address=meeting.onlineAddress,
        guests=guests,
        tasksList=meeting.tasksList,
        agenda=meeting.agenda,
        documents=meeting.documents
    )

@app.post("/new-meeting", responses={
    403: {"description": "Meeting need at least one meeting address or online address", "model": ErrorResponse},
})
async def add_meeting(meeting: ExternalBaseMeeting):
    if(len(meetings) > 0):
        last_meeting = meetings[-1]
    else:
        last_meeting = 1

    new_meeting_id = last_meeting.id + 1
    new_meeting = mapMeetingIncoming(new_meeting_id, meeting)

    if(not atLeastOneAddress(new_meeting.meeting_address, new_meeting.online_address)):
        raise HTTPException(status_code=403, detail="Meeting need at least one meeting address or online address")
    meetings.append(new_meeting)
    return {"message": f"Created new meeting with id# {new_meeting_id}"}

def filesNotInOriginal(editedMeetingsDocs: list[str], originalDocs: list[str]) -> list[str]:
    notInEditedMeeting: list[str] = []
    for doc in originalDocs:
        if doc not in editedMeetingsDocs:
            notInEditedMeeting.append(doc)
    return notInEditedMeeting

@app.put("/update-meeting", responses= {
    403: {"description": "Meeting need at least one meeting address or online address", "model": ErrorResponse},
    404: {"description": "Meeting not found", "model": ErrorResponse},
})
async def update_meeting(edited_meeting: ExternalExistedMeeting):
    
    updated_meeting = mapMeetingIncoming(edited_meeting.id, edited_meeting)
    print(updated_meeting.id)
    if(not atLeastOneAddress(updated_meeting.meeting_address, updated_meeting.online_address)):
        raise HTTPException(status_code=403, detail="Meeting need at least one meeting address or online address")
    meetingUpdated = False
    for index, meeting in enumerate(meetings):
        if(meeting.id == updated_meeting.id):
            if meeting.documents is not None and len(meeting.documents) > 0:
                deleteFiles(filesNotInOriginal(updated_meeting.documents, meeting.documents))
            meetings[index] = updated_meeting
            meetingUpdated = True
    if(meetingUpdated == False):
        raise HTTPException(status_code=404, detail=f"Meeting with id #{edited_meeting.id} not found")

    return {"edited meeting": f"updated meeting with id #{updated_meeting.id}"}



@app.delete("/delete-meeting/{meeting_id}", responses={
    404: {"description": "Meeting not found", "model": ErrorResponse},
})
async def delete_meetings(meeting_id: int):
    tempMeetings = meetings
    for meeting in tempMeetings:
        if meeting.id == meeting_id:
            if(meeting.documents):
                deleteFiles(meeting.documents)
            meetings.remove(meeting)
            return f"deleted meeting #{meeting_id}"
    raise HTTPException(status_code=404, detail=f"Meeting with id #{meeting_id} not found")

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
        "indexNumber": projectInfo1.index_number
    }
    return projectInfo
