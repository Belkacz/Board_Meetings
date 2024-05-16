from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/get-agendas", response_model=list[Guest])
async def get_agendas_list():
    print("agendas")
    return agendas


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
        agenda=meeting.agenda
    )
    meetings.append(new_meeting)
    print(new_meeting)
    return {"message": "new-meeting"}

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
        agenda=edited_meeting.agenda
    )

    for index, meeting in enumerate(meetings):
        if(meeting.id == updated_meeting.id):
            meetings[index] = updated_meeting

    return {"edited meeting": "done"}


@app.delete("/delete-meeting/{meeting_id}")
async def delete_meetings(meeting_id: int):
    print(meeting_id)
    tempMeetings = meetings
    for meeting in tempMeetings:
        if meeting.meeting_id == meeting_id:
            meetings.remove(meeting)
