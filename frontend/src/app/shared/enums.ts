import { Guest } from "./interfaces";

export enum TimeType {
    Start = "start",
    End = "end"
}

export enum FileType {
    ChooseFile = "Choose File",
    AddDocument = "Add Document"
}

export enum urls {
    protocolBase = "http://",
    protocolHttps = "https://",
    protocolHttp = "http://",
    localFastApi = "127.0.0.1:8000",
    GETMEETINGS = "get-meetings",
    DELETEMEETING = "delete-meeting",
    NEWMEETING = "new-meeting",
    UPDATEMEETING = "update-meeting",
    GETPEOPLE = "get-people",
    GETAGENDAS = "get-agendas",
    UPLOADFILES = "upload-files",
    GETPROJECTINFO = "get-project-info",
    GETMEETINGDETAILS = "meeting-details"
}