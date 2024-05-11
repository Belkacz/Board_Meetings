from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import ssl

from meetings import meetings, Guest, Task, Agenda, BaseMeeting, ExistedMeeting

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


@app.post("/new-meeting")
async def add_meeting(meeting: BaseMeeting):
    last_meeting = meetings[-1]
    new_meeting_id = last_meeting.meeting_id + 1
    new_meeting = ExistedMeeting(
        meeting_id=new_meeting_id,
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

@app.delete("/delete-meeting/{meeting_id}")
async def delete_meetings(meeting_id: int):
    print(meeting_id)
    tempMeetings = meetings
    for meeting in tempMeetings:
        if meeting.meeting_id == meeting_id:
            meetings.remove(meeting)
