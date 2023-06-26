import { FileType } from "./enums";

export interface DownloadFile {
    fileUrl: string;
    name: string;
}

export interface Gest {
    id: number;
    name: string;
    surname: string;
    jobPosition: string | null;
}

export interface GestInvited extends Gest {
    invited: boolean;
  }

export interface BoardMeetingData{
    meetingType: string;
    meetingName: string;
    meetingAdrress: string | null;
    onlineAddress: string | null;
    dateStart: Date | null;
    dateEnd: Date | null;
    chooseFile: Array<FileType>
    addedDocuments: Array<FileType>
    gests: Array<Gest>
    tasksList: Array<string>
    [key: string]: any
}