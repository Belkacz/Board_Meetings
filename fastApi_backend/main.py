from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI()

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
    meeting_type: str
    meeting_name: str
    start_date: datetime
    end_date: datetime
    meeting_address: str | None = None
    online_address: str | None = None
    guests: List[Guest] | None = None
    tasksList: List[Task] | None = None
    agenda: Agenda | None = None

@app.get("/get-meetings", response_model=List[Meeting])
async def get_meetings_list():
    meetings = [
        Meeting(
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
                id=1,
                name="agenda1",
                order=["make 1", "to do2", "talk about 3"]
            )
        )
    ]
    return meetings


@app.post("/new-meeting")
async def root():
    return {"message": "new-meeting"}



# class Item(BaseModel):
#     name: str
#     price: float
#     is_offer: Union[bool, None] = None


# @app.get("/")
# def read_root():
#     return {"Hello": "World"}


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}


# @app.put("/items/{item_id}")
# def update_item(item_id: int, item: Item):
#     return {"item_name": item.name, "item_id": item_id}