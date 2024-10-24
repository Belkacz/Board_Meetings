import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Agenda, ExistedBoardMeetings, GuestInvited, Guest, Task, AttachedDocument, IncomingGuest, ProjectData, ShortMeeting, ExternalAgenda } from '../shared/interfaces';
import { urls } from '../shared/enums';
import { RestService } from './restService.service';
import { PopUpService } from './pop-up.service';

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  inviteList$ = new BehaviorSubject<GuestInvited[]>([]);
  agenda$ = new Subject<Agenda>();

  public updateGuestsList(guestsList: GuestInvited[]) {
    const invitedGuests: GuestInvited[] = guestsList.filter(guest => guest.invited === true);
    this.inviteList$.next(invitedGuests);
  }

  public updateAgenda(newAgenda: Agenda) {
    this.agenda$.next(newAgenda);
  }
}

@Injectable({
  providedIn: 'root'
})
export class dataService {
  constructor(private restService: RestService, private popUpService: PopUpService) { }
  private actualMeetingsList$ = new BehaviorSubject<ShortMeeting[]>([]);

  public setGlobalMeetingsList(meetingsList: ShortMeeting[]) {
    this.actualMeetingsList$.next(meetingsList);
  }

  public getGlobalMeetingsList(): Observable<ShortMeeting[]> {
    return this.actualMeetingsList$.asObservable();
  }

  public mapProjectData = (response: ProjectData): ProjectData => {
    let projectData: ProjectData = {
      name: response.name,
      surname: response.surname,
      projectName: response.projectName,
      projectVersion: response.projectVersion,
      indexNumber: response.indexNumber
    };
    return projectData;
  }

  private mapAgenda(agenda: ExternalAgenda): Agenda {
    let newAgenda: Agenda;

    if (agenda) {
      newAgenda = {
        id: agenda.id,
        name: agenda.agendaName,
        order: agenda.order
      };
    } else {
      newAgenda = {
        id: null,
        name: null,
        order: null
      };
    }

    return newAgenda;
  }

  public mapAgendas = (response: ExternalAgenda[]): Agenda[] => {
    const agendas: Agenda[] = [];
    response.forEach((agenda: any) => {
      const newAgenda: Agenda = this.mapAgenda(agenda)
      agendas.push(newAgenda);
    })
    return agendas;
  }

  public mapMeetingDetails = (meeting: any): ExistedBoardMeetings | null => {
    let resultMeeting: ExistedBoardMeetings | null = null;
    if (meeting) {
      const newGuests: Array<Guest> = []
      if (meeting.guests) {
        meeting.guests.forEach((guest: Guest) => {
          const newGuest: Guest = {
            id: guest.id,
            name: guest.name,
            surname: guest.surname,
            jobPosition: guest.jobPosition,
          }
          newGuests.push(newGuest);
        })
      }


      const newTasks: Array<Task> = []
      if (meeting.tasksList) {
        meeting.tasksList.forEach((task: Task) => {
          const newTask: Task = {
            id: task.id,
            name: task.name,
            description: task.description,
            priority: task.priority,
          }
          newTasks.push(newTask);
        })
      }
      let mappedAgenda = this.mapAgenda(meeting.agenda)

      const newMeeting: ExistedBoardMeetings = {
        id: meeting.id,
        meetingType: meeting.meetingType,
        meetingName: meeting.meetingName,
        dateStart: meeting.startDate,
        dateEnd: meeting.endDate,
        meetingAddress: meeting.meetingAddress,
        onlineAddress: meeting.onlineAddress,
        chooseFile: null,
        addedDocuments: null,
        guests: newGuests,
        tasksList: newTasks,
        agenda: mappedAgenda,
        attachedDocuments: meeting.documents ? this.createDocumentsData(meeting.documents) : null
      }
      resultMeeting = newMeeting;
    }
    return resultMeeting;
  }

  public mapMeetings = (response: ExistedBoardMeetings[]): ShortMeeting[] => {
    const meetingsList: ShortMeeting[] = [];
    if (response.length > 0) {
      response.forEach((meeting: any) => {
        const newMeeting: ShortMeeting = {
          id: meeting.id,
          meetingType: meeting.meetingType,
          meetingName: meeting.meetingName,
          dateStart: meeting.startDate,
          dateEnd: meeting.endDate,
        }
        meetingsList.push(newMeeting);
      });
    }
    return meetingsList;
  }

  public getMeetingsService(page: number = 0, pageSize = 10): Promise<{ result: boolean, length: number } | { result: boolean, error: string }> {
    return new Promise<{ result: boolean, length: number } | { result: boolean, error: string }>((resolve) => {
      this.restService.receiveDataFromFastApi(urls.GETMEETINGS, null, page, pageSize)
        .subscribe({
          next: (response: any) => {
            let meetingsList = this.mapMeetings(response.meetings);
            this.setGlobalMeetingsList(meetingsList);
            resolve({ result: true, length: response.totalLength });
          },
          error: (error: any) => {
            console.error("Error:", error);
            resolve({ result: false, error: "Server communication error" });
          }
        });
    });
  }


  public getMeetingDetailService(id: number): Promise<ExistedBoardMeetings | Error | null> {
    return new Promise<ExistedBoardMeetings | Error | null>((resolve) => {
      this.restService.receiveDataFromFastApi(urls.GETMEETINGDETAILS, null, id)
        .subscribe({
          next: (response: any) => {
            let meeting = this.mapMeetingDetails(response);
            if (!meeting) {
              return resolve(null);
            } else {
              return resolve(meeting);
            }

          },
          error: (error: Error) => {
            this.popUpService.showPopUp("Cannot get meeting details, check console for more information");
            return resolve(error);
          }
        });
    });
  }


  public createDocumentsData = (filesUrls: Array<string>): Array<AttachedDocument> => {

    const protocol = window.location.protocol;
    const host = window.location.host;
    const baseUrl = `${protocol}//${host}`;
    const attachedDocuments: Array<AttachedDocument> = [];
    filesUrls.forEach(url => {
      const dollarIndex = url.indexOf('$') + 1;
      const newAttachedDocument: AttachedDocument = {
        fileName: url.slice(dollarIndex),
        originalUrl: url,
        fullUrl: `${baseUrl}/api${url}`,
      }
      attachedDocuments.push(newAttachedDocument);
    });
    return attachedDocuments;
  }

  public isError(obj: any): boolean {
    if (obj.status > 400) {
      return true;
    } else {
      return false;
    }
  }

  public getErrorStatus(obj: any): number {
    if (obj.status) {
      return obj.status;
    } else {
      return 0;
    }
  }
}