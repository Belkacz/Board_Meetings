import { FileType } from "./enums";

export interface DownloadFile {
    fileUrl: string;
    name: string;
}

export interface Guest {
    id: number;
    name: string;
    surname: string;
    jobPosition: string | null;
}

export interface GestInvited extends Guest {
    invited: boolean;
  }

export interface BoardMeetingData{
    meetingType: string;
    meetingName: string;
    meetingAddress: string | null;
    onlineAddress: string | null;
    dateStart: Date | null;
    dateEnd: Date | null;
    chooseFile: Array<FileType> | null;
    addedDocuments: Array<FileType> | null;
    guests: Array<Guest>
    tasksList: Array<Task>
    [key: string]: any
}

export interface Task{
    id: number;
    name: string;
    description?: string;
    priority?: number;
}