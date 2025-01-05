from enum import Enum
from typing_extensions import Annotated
from pydantic import BaseModel, StringConstraints
from datetime import datetime


class ErrorResponse(BaseModel):
    detail: str


class Guest(BaseModel):
    id: int
    name: str
    surname: str
    job_position: str


class ExternalGuest(BaseModel):
    id: int
    name: str
    surname: str
    jobPosition: str


class Task(BaseModel):
    id: int
    name: str
    description: str


class Agenda(BaseModel):
    id: int | None = None
    name: str | None = None
    order: list[str] | None = None


class ExternalAgenda(BaseModel):
    id: int | None = None
    agendaName: str | None = None
    order: list[str] | None = None


class MeetingType(Enum):
    BOARDMEETINGS = "boardMeeting"
    GENERALASSEMBLY = "generalAssembly"
    OTHER = "other"


class ShortMeeting(BaseModel):
    id: int | None = None
    meeting_type: MeetingType
    meeting_name: Annotated[str, StringConstraints(min_length=1)]
    start_date: datetime
    end_date: datetime


class ExternalShortMeeting(BaseModel):
    id: int | None = None
    meetingType: MeetingType
    meetingName: Annotated[str, StringConstraints(min_length=1)]
    startDate: datetime
    endDate: datetime


class PagedListMeetings(BaseModel):
    meetings: list[ExternalShortMeeting]
    totalLength: int


class BaseMeeting(BaseModel):
    meeting_type: MeetingType
    meeting_name: Annotated[str, StringConstraints(min_length=1)]
    start_date: datetime
    end_date: datetime
    meeting_address: str | None = None
    online_address: str | None = None
    guests: list[Guest] | None = None
    tasksList: list[Task] | None = None
    agenda: Agenda | None = None
    documents: list[str] | None = None


class ExternalBaseMeeting(BaseModel):
    meetingType: MeetingType
    meetingName: Annotated[str, StringConstraints(min_length=1)]
    startDate: datetime
    endDate: datetime
    meetingAddress: str | None = None
    onlineAddress: str | None = None
    guests: list[ExternalGuest] | None = None
    tasksList: list[Task] | None = None
    agenda: ExternalAgenda | None = None
    documents: list[str] | None = None


class ExistedMeeting(BaseMeeting):
    id: int | None = None


class ExternalExistedMeeting(ExternalBaseMeeting):
    id: int | None = None


guests = [
    Guest(id=1, name="Wade", surname="Warner", job_position="Chair of the board"),
    Guest(id=2, name="Floyd", surname="Miles", job_position="Board memeber"),
    Guest(id=3, name="Guy", surname="Howkins", job_position="Board secretary"),
    Guest(id=4, name="Darrell", surname="Steward", job_position="Board tresurer"),
    Guest(id=5, name="Wade", surname="Warner2", job_position="dubler"),
]

agendas = [
    Agenda(id=1, name="agenda1", order=["make 1", "to do2", "talk about 3"]),
    Agenda(id=2, name="agenda2", order=["make 1", "to do2", "talk about 3"]),
]

meetings = [
    ExistedMeeting(
        id=1,
        meeting_type="boardMeeting",
        meeting_name="Meeting 1",
        start_date="2024-03-10T13:14:50.985Z",
        end_date="2024-03-10T15:16:50.985Z",
        meeting_address="park staromiejski",
        online_address=None,
        guests=[guests[0], guests[1]],
        tasksList=[Task(id=1, name="task1", description="task1 desc")],
        agenda=agendas[0],
        documents=["/files/123$testFile3.txt", "/files/123$testFile4.txt"],
    ),
    ExistedMeeting(
        id=2,
        meeting_type="boardMeeting",
        meeting_name="Meeting 2",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="park na jasienia",
        online_address=None,
        guests=[guests[1], guests[2], guests[3]],
        tasksList=[Task(id=1, name="task1", description="task1 desc")],
        agenda=agendas[1],
        documents=None,
    ),
    ExistedMeeting(
        id=4,
        meeting_type="boardMeeting",
        meeting_name="Meeting 4",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="uczelnia",
        online_address=None,
        guests=[guests[0], guests[3], guests[4]],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc"),
            Task(id=2, name="task2", description="task2 desc"),
        ],
        agenda=agendas[1],
        documents=["/files/123$testFile1.txt", "/files/123$testFile2.txt"],
    ),
    ExistedMeeting(
        id=5,
        meeting_type="boardMeeting",
        meeting_name="Meeting 5",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="uczelnia",
        online_address=None,
        guests=[guests[0], guests[3], guests[4]],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc"),
            Task(id=2, name="task2", description="task2 desc"),
        ],
        agenda=agendas[1],
        documents=None,
    ),
    ExistedMeeting(
        id=6,
        meeting_type="boardMeeting",
        meeting_name="Meeting 6",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="uczelnia",
        online_address=None,
        guests=[guests[0], guests[3], guests[4]],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc"),
            Task(id=2, name="task2", description="task2 desc"),
        ],
        agenda=agendas[1],
        documents=None,
    ),
    ExistedMeeting(
        id=7,
        meeting_type="boardMeeting",
        meeting_name="Meeting 7",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="uczelnia",
        online_address=None,
        guests=[guests[0], guests[3], guests[4]],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc"),
            Task(id=2, name="task2", description="task2 desc"),
        ],
        agenda=agendas[1],
        documents=None,
    ),
    ExistedMeeting(
        id=8,
        meeting_type="boardMeeting",
        meeting_name="Meeting 8",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="uczelnia",
        online_address=None,
        guests=[guests[0], guests[3], guests[4]],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc"),
            Task(id=2, name="task2", description="task2 desc"),
        ],
        agenda=agendas[1],
        documents=None,
    ),
    ExistedMeeting(
        id=9,
        meeting_type="boardMeeting",
        meeting_name="Meeting 9",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="uczelnia",
        online_address=None,
        guests=[guests[0], guests[3], guests[4]],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc"),
            Task(id=2, name="task2", description="task2 desc"),
        ],
        agenda=agendas[1],
        documents=None,
    ),
    ExistedMeeting(
        id=10,
        meeting_type="boardMeeting",
        meeting_name="Meeting 10",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="uczelnia",
        online_address=None,
        guests=[guests[0], guests[3], guests[4]],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc"),
            Task(id=2, name="task2", description="task2 desc"),
        ],
        agenda=agendas[1],
        documents=None,
    ),
    ExistedMeeting(
        id=11,
        meeting_type="boardMeeting",
        meeting_name="Meeting 11",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="uczelnia",
        online_address=None,
        guests=[guests[0], guests[3], guests[4]],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc"),
            Task(id=2, name="task2", description="task2 desc"),
        ],
        agenda=agendas[1],
        documents=None,
    ),
    ExistedMeeting(
        id=12,
        meeting_type="boardMeeting",
        meeting_name="Meeting 12",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="uczelnia",
        online_address=None,
        guests=[guests[0], guests[3], guests[4]],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc"),
            Task(id=2, name="task2", description="task2 desc"),
        ],
        agenda=agendas[1],
        documents=None,
    ),
    ExistedMeeting(
        id=13,
        meeting_type="boardMeeting",
        meeting_name="Meeting 13",
        start_date="2024-04-10T13:14:50.985Z",
        end_date="2024-04-10T15:16:50.985Z",
        meeting_address="uczelnia",
        online_address=None,
        guests=[guests[0], guests[3], guests[4]],
        tasksList=[
            Task(id=1, name="task1", description="task1 desc"),
            Task(id=2, name="task2", description="task2 desc"),
        ],
        agenda=agendas[1],
        documents=None,
    ),
]
