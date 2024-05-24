import os
from fastapi import FastAPI, Form, File, UploadFile
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from fastapi.staticfiles import StaticFiles
from uuid import uuid4
import ssl

from meetings import meetings, guests, agendas, Guest, Task, Agenda, BaseMeeting, ExistedMeeting

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

@app.get("/get-meetings", response_model=list[ExistedMeeting])
async def get_meetings_list():
    print("get_meetings_list")
    return meetings

@app.get("/get-people", response_model=list[Guest])
async def get_people_list():
    print("people")
    return guests

@app.get("/get-agendas", response_model=list[Agenda])
async def get_agendas_list():
    print("agendas")
    return agendas

UPLOAD_DIRECTORY = "meetings_docs"
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

@app.post("/new-meeting")
async def add_meeting(meeting: BaseMeeting):
    last_meeting = meetings[-1]
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
    meetings.append(new_meeting)
    print(new_meeting)
    return {"message": "new-meeting"}

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

    for index, meeting in enumerate(meetings):
        if(meeting.id == updated_meeting.id):
            deleteFiles(filesNotInOriginal(updated_meeting.documents, meeting.documents))
            meetings[index] = updated_meeting

    return {"edited meeting": "done"}


@app.delete("/delete-meeting/{meeting_id}")
async def delete_meetings(meeting_id: int):
    tempMeetings = meetings
    for meeting in tempMeetings:
        if meeting.id == meeting_id:
            if(meeting.documents):
                deleteFiles(meeting.documents)
            meetings.remove(meeting)

def deleteFiles(files: list[str]):
    print(files)
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
