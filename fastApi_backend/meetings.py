from pydantic import BaseModel
from datetime import datetime

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
    order: list[str]

class BaseMeeting(BaseModel):
    meeting_type: str
    meeting_name: str
    start_date: datetime
    end_date: datetime
    meeting_address: str | None = None
    online_address: str | None = None
    guests: list[Guest] | None = None
    tasksList: list[Task] | None = None
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