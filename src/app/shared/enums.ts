import { Guest } from "./interfaces";

export enum TimeType {
    Start = "start",
    End = "end"
}

export enum FileType {
    ChooseFile = "Choose File",
    AddDocument = "Add Document"
}

export const workerList: Guest[] = [{ id: 1, name: "Wade", surname: "Warner", jobPosition: "Cair of the board" },
{ id: 2, name: "Floyd", surname: "Miles", jobPosition: "Board memeber" }, { id: 3, name: "Brooklyn", surname: "Simmons", jobPosition: "Board member" },
{ id: 3, name: "Guy", surname: "Howkins", jobPosition: "Board secretary" }, { id: 4, name: "Darrell", surname: "Steward", jobPosition: "Board tresurer" },
{ id: 5, name: "Wade", surname: "Warner2", jobPosition: "dubler" }]


export enum urls {
    protocolBase = "http://",
    protocolHttps = "https://",
    protocolHttp = "http://",
    LOCALFASTAPI = "127.0.0.1:8000",
    GETMEETINGS = "get-meetings",
    DELETEMEETING = "delete-meeting",
    NEWMEETING = "new-meeting"
}