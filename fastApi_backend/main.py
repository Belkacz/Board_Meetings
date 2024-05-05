from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import ssl

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

class Guest(BaseModel):
    id: int
    name: str
    surname: str
    jobPosition: str

class Task(BaseModel):
    id: int
    name: str
    description: str
    order: str

class Agenda(BaseModel):
    id: int
    name: str
    order: List[str]

class BaseMeeting(BaseModel):
    meeting_type: str
    meeting_name: str
    start_date: datetime
    end_date: datetime
    meeting_address: str | None = None
    online_address: str | None = None
    guests: List[Guest] | None = None
    tasksList: List[Task] | None = None
    agenda: Agenda | None = None

class ExistedMeeting(BaseMeeting):
    meeting_id: int | None = None


meetings = [
    ExistedMeeting(
        meeting_id=1,
        meeting_type="boardMeeting",
        meeting_name="Meeting 1",
        start_date="2024-03-10T13:14:50.985Z",
        end_date="2024-03-10T15:16:50.985Z",
        meeting_address="park sledzia",
        online_address=None,
        guests=[
            Guest(id=1, name="Wade", surname="Warner", jobPosition="Chair of the board")
        ],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc", order="Cair of the board")
        ],
        agenda=Agenda(
            id=1,
            name="agenda1",
            order=["make 1", "to do2", "talk about 3"]
        )
    ),
    ExistedMeeting(
        meeting_id=2,
        meeting_type="boardMeeting",
        meeting_name="Meeting 2",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="park na jasienia",
        online_address=None,
        guests=[
            Guest(id=1, name="Wade", surname="Warner", jobPosition="Chair of the board")
        ],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc", order="Cair of the board")
        ],
        agenda=Agenda(
            id=2,
            name="agenda1",
            order=["make 1", "to do2", "talk about 3"]
        )
    ),
    ExistedMeeting(
    meeting_id=3,
    meeting_type="boardMeeting",
    meeting_name="Meeting 3",
    start_date="2024-04-10T13:14:50.985Z",
    end_date="2024-04-10T15:16:50.985Z",
    meeting_address="uczelnia",
    online_address=None,
    guests=[
        Guest(id=1, name="Wade", surname="Warner", jobPosition="Chair of the board")
    ],
    tasksList=[
        Task(id=1, name="task1", description="task1 desc", order="Cair of the board")
    ],
    agenda=Agenda(
        id=2,
        name="agenda1",
        order=["make 1", "to do2", "talk about 3"]
    )
)
]

@app.get("/get-meetings", response_model=List[ExistedMeeting])
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
    global meetings
    tempMeetings =  meetings
    for meeting in tempMeetings:
        if meeting.meeting_id == meeting_id:
            meetings.remove(meeting)
