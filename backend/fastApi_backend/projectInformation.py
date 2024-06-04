from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ProjectData(BaseModel):
    name: str
    surname: str
    project_name: str
    project_version: str
    index_number: int

class ProjectDataExternal(BaseModel):
    name: str
    surname: str
    projectName: str
    projectVersion: str
    indexNumber: int


projectInfo1 = ProjectData(name="Łukasz", surname="Belka", project_name="Board Meetings", project_version="1.2", index_number=156162)
