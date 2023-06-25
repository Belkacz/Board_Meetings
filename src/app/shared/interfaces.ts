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