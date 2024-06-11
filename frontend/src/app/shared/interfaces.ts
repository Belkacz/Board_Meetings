import { FileType } from "./enums";

export type newTaskVale = {
    name: string
}

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
export interface backendGuest {
    id: number;
    name: string;
    surname: string;
    job_position: string | null;
}

export interface IncomingGuest {
    id: number;
    name: string;
    surname: string;
    job_position: string | null;
}

export interface ProjectData {
    name: string;
    surname: string;
    projectName: string;
    projectVersion: string;
    indexNumber: number
}

export interface GuestInvited extends Guest {
    invited: boolean;
}
export interface AttachedDocument {
    fileName: string;
    originalUrl: string;
    fullUrl: string;
}
export interface BoardMeetingData {
    meetingType: string;
    meetingName: string;
    dateStart: Date | null;
    dateEnd: Date | null;
    meetingAddress: string | null;
    onlineAddress: string | null;
    chooseFile: Array<FileType> | null;
    guests?: Array<Guest>;
    tasksList?: Array<Task>;
    agenda?: Agenda | null;
    addedDocuments: Array<FileType> | null;
    attachedDocuments: Array<AttachedDocument> | null;
    [key: string]: any;
}

export interface ExistedBoardMeetings extends BoardMeetingData {
    id: number;
}
export interface ShortMetting {
    id: number;
    meetingType: string;
    meetingName: string;
    dateStart: Date | null;
    dateEnd: Date | null;
}

export interface Task {
    id: number;
    name: string;
    description: string;
    priority?: number;
}

export interface Agenda {
    id: number;
    name: string;
    list: string[];
}
