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
    id: int | None = None

guests = [
    Guest(id=1, name="Wade", surname="Warner", jobPosition="Chair of the board"),
    Guest(id=2, name="Floyd", surname="Miles", jobPosition="Board memeber"),
    Guest(id=3, name="Guy", surname="Howkins", jobPosition="Board secretary"),
    Guest(id=4, name="Darrell", surname="Steward", jobPosition="Board tresurer"),
    Guest(id=5, name="Wade", surname="Warner2", jobPosition="dubler")
]

agendas = [
    Agenda(id=1, name="agenda1", order=["make 1", "to do2", "talk about 3"]),
    Agenda(id=2, name="agenda1", order=["make 1", "to do2", "talk about 3"]),
]

meetings = [
    ExistedMeeting(
        id=1,
        meeting_type="boardMeeting",
        meeting_name="Meeting 1",
        start_date="2024-03-10T13:14:50.985Z",
        end_date="2024-03-10T15:16:50.985Z",
        meeting_address="park sledzia",
        online_address=None,
        guests=[
            guests[0],
            guests[1]
        ],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc", order="Cair of the board")
        ],
        agenda=agendas[1]
    ),
    ExistedMeeting(
        id=2,
        meeting_type="boardMeeting",
        meeting_name="Meeting 2",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="park na jasienia",
        online_address=None,
        guests=[
            guests[1],
            guests[2],
            guests[3]
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
    id=3,
    meeting_type="boardMeeting",
    meeting_name="Meeting 3",
    start_date="2024-04-10T13:14:50.985Z",
    end_date="2024-04-10T15:16:50.985Z",
    meeting_address="uczelnia",
    online_address=None,
    guests=[
        guests[0],
        guests[3],
        guests[4]
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