import os
from fastapi import FastAPI, Form, File, UploadFile, HTTPException
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from fastapi.staticfiles import StaticFiles
from uuid import uuid4
import ssl

from .meetings import meetings, guests, agendas, Guest, Task, Agenda, BaseMeeting, ExistedMeeting, ShortMeeting, PagedListMeetings
from .projectInformation import projectInfo1, ProjectData, ProjectDataExternal

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

@app.get("/get-meetings/{page}/{pagesize}", response_model=PagedListMeetings)
async def get_meetings_list(page: int, pagesize: int):
    start_index = ((page * pagesize) - pagesize)
    end_index = start_index + pagesize -1
    if(end_index > len(meetings)):
        end_index = len(meetings)

    meetings_list: list[ShortMeeting] = []
    for i in range(start_index, end_index):
        short_meeting = ShortMeeting(
            id = meetings[i].id,
            meeting_type = meetings[i].meeting_type,
            meeting_name = meetings[i].meeting_name,
            start_date = meetings[i].start_date,
            end_date = meetings[i].end_date
        )
        meetings_list.append(short_meeting)
    total_lenght = len(meetings) + 1
    response_data = {
        "meetings": meetings_list,
        "total_lenght": total_lenght
    }
    print("get_meetings_list")
    return response_data

@app.get("/meeting-details/{meeting_id}", response_model=ExistedMeeting)
async def get_meeting_detials(meeting_id: int):
    result_meeting:ExistedMeeting = None
    if(meeting_id-1 >= 0 and meeting_id-1 < len(meetings) and meetings[meeting_id-1].id == meeting_id):
        meeting = meetings[meeting_id-1]
    if(not result_meeting):
        for meeting in meetings:
            if(meeting_id == meeting.id):
                result_meeting = meeting
                break
    if result_meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    print("get_meetings_list")
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

@app.post("/new-meeting")
async def add_meeting(meeting: BaseMeeting):
    if(len(meetings) > 0):
        last_meeting = meetings[-1]
    else:
        last_meeting = 1

    new_meeting_id = last_meeting.id + 1
    new_meeting = ExistedMeeting(
        id=new_meeting_id,
        meeting_type=meeting.meeting_type,
        meeting_name=meeting.meeting_name,
        start_date=meeting.start_date,
        end_date=meeting.end_date,
        meeting_address=meeting.meeting_address,
        online_address=meeting.online_address,
        guests=meeting.guests,
        tasksList=meeting.tasksList,
        agenda=meeting.agenda,
        documents=meeting.documents
    )
    if(not atLeastOneAddress(new_meeting.meeting_address, new_meeting.online_address)):
        raise HTTPException(status_code=404, detail="Meeting need at least one meeting address or online address")
    meetings.append(new_meeting)
    return {"message": f"Created new meeting with id# {new_meeting_id}"}

def filesNotInOriginal(editedMeetingsDocs: list[str], originalDocs: list[str]) -> list[str]:
    notInEditedMeeting: list[str] = []
    for doc in originalDocs:
        if doc not in editedMeetingsDocs:
            notInEditedMeeting.append(doc)
    return notInEditedMeeting

@app.put("/update-meeting")
async def update_meeting(edited_meeting: ExistedMeeting):
    updated_meeting = ExistedMeeting(
        id=edited_meeting.id,
        meeting_type=edited_meeting.meeting_type,
        meeting_name=edited_meeting.meeting_name,
        start_date=edited_meeting.start_date,
        end_date=edited_meeting.end_date,
        meeting_address=edited_meeting.meeting_address,
        online_address=edited_meeting.online_address,
        guests=edited_meeting.guests,
        tasksList=edited_meeting.tasksList,
        agenda=edited_meeting.agenda,
        documents=edited_meeting.documents
    )
    if(not atLeastOneAddress(updated_meeting.meeting_address, updated_meeting.online_address)):
        raise HTTPException(status_code=404, detail="Meeting need at least one meeting address or online address")
    meetingUpdated = False
    for index, meeting in enumerate(meetings):
        if(meeting.id == updated_meeting.id):
            deleteFiles(filesNotInOriginal(updated_meeting.documents, meeting.documents))
            meetings[index] = updated_meeting
            meetingUpdated = True
    if(meetingUpdated == False):
        raise HTTPException(status_code=404, detail=f"Meeting with id #{edited_meeting.id} not found")

    return {"edited meeting": f"updated meeting with id #{updated_meeting.id}"}



@app.delete("/delete-meeting/{meeting_id}")
async def delete_meetings(meeting_id: int):
    tempMeetings = meetings
    for meeting in tempMeetings:
        if meeting.id == meeting_id:
            if(meeting.documents):
                deleteFiles(meeting.documents)
            meetings.remove(meeting)

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