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
    meetingAddress: string | null;
    onlineAddress: string | null;
    dateStart: Date | null;
    dateEnd: Date | null;
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

export interface Task {
    id: number;
    name: string;
    description?: string;
    priority?: number;
}

export interface Agenda {
    id: number;
    name: string;
    list: string[];
}