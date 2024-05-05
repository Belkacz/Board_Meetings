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

class Meeting(BaseModel):
    meeting_id: int
    meeting_type: str
    meeting_name: str
    start_date: datetime
    end_date: datetime
    meeting_address: str | None = None
    online_address: str | None = None
    guests: List[Guest] | None = None
    tasksList: List[Task] | None = None
    agenda: Agenda | None = None


meetings = [
    Meeting(
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
    Meeting(
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
    Meeting(
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

@app.get("/get-meetings", response_model=List[Meeting])
async def get_meetings_list():
    print("get_meetings_list")
    return meetings


@app.post("/new-meeting")
async def root():
    return {"message": "new-meeting"}

@app.delete("/delete-meeting/{meeting_id}")
async def delete_meetings(meeting_id: int):
    print(meeting_id)
    global meetings
    tempMeetings =  meetings
    for meeting in tempMeetings:
        if meeting.meeting_id == meeting_id:
            meetings.remove(meeting)
