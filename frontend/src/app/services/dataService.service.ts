import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Agenda, ExistedBoardMeetings, GuestInvited, Guest, Task, AttachedDocument, IncomingGuest, ProjectData, ShortMetting } from '../shared/interfaces';
import { urls } from '../shared/enums';
import { RestService } from './restService.service';

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
  constructor(private restService: RestService) { }
  private actualMeetingsList$ = new BehaviorSubject<ShortMetting[]>([]);
  private actualShortMeetingsList$ = new BehaviorSubject<ShortMetting[]>([]);
  private meetingGetError: Error | null = null;

  public setGlobalMeetingsList(meetingsList: ShortMetting[]) {
    this.actualMeetingsList$.next(meetingsList);
  }

  public getGlobalMeetingsList(): Observable<ShortMetting[]> {
    return this.actualMeetingsList$.asObservable();
  }

  public getGlobalMeetingsErrorMessage(): string | null {
    if (this.meetingGetError) {
      return "Server communication error";
    } else {
      return null;
    }
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

  public mapAgendas = (response: Agenda[]): Agenda[] => {
    const agendas: Agenda[] = [];
    response.forEach((agenda: any) => {
      const newAgenda: Agenda = {
        id: agenda.id,
        name: agenda.name,
        list: agenda.order
      }
      agendas.push(newAgenda);
    })
    return agendas;
  }

  public mapShortMeeting = (response: ShortMetting[]): ShortMetting[] => {  
    const meetingsList: ShortMetting[] = [];
    if (response.length > 0) {
      response.forEach((meeting: any) => {
        const newMeeting: ShortMetting = {
          id: meeting.id,
          meetingType: meeting.meeting_type,
          meetingName: meeting.meeting_name,
          dateStart: meeting.start_date,
          dateEnd: meeting.end_date,
        }
        meetingsList.push(newMeeting);
      })
    }
    return meetingsList;
  }

  public mapMeetingDetails = (meeting: any): ExistedBoardMeetings | null => {
  let restultMeeting: ExistedBoardMeetings | null = null;
  if (meeting) {
      const newGuests: Array<Guest> = []
      if (meeting.guests) {
        meeting.guests.forEach((guest: IncomingGuest) => {
          const newGuest: Guest = {
            id: guest.id,
            name: guest.name,
            surname: guest.surname,
            jobPosition: guest.job_position,
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
      let newAgenda = null;
      if (meeting.agenda) {
        newAgenda = {
          id: meeting.agenda.id,
          name: meeting.agenda.name,
          list: meeting.agenda.order,
        }
      }
      const newMeeting: ExistedBoardMeetings = {
        id: meeting.id,
        meetingType: meeting.meeting_type,
        meetingName: meeting.meeting_name,
        dateStart: meeting.start_date,
        dateEnd: meeting.end_date,
        meetingAddress: meeting.meeting_address,
        onlineAddress: meeting.online_address,
        chooseFile: null,
        addedDocuments: null,
        guests: newGuests,
        tasksList: newTasks,
        agenda: newAgenda,
        attachedDocuments: meeting.documents ? this.createDocumentsData(meeting.documents) : null
      }
      restultMeeting = newMeeting;
  }
  return restultMeeting;
  }

  public mapMeetings = (response: ExistedBoardMeetings[]): ShortMetting[] => {
    const meetingsList: ShortMetting[] = [];
    if (response.length > 0) {
      response.forEach((meeting: any) => {
        const newMeeting: ShortMetting = {
          id: meeting.id,
          meetingType: meeting.meeting_type,
          meetingName: meeting.meeting_name,
          dateStart: meeting.start_date,
          dateEnd: meeting.end_date,

        }
        meetingsList.push(newMeeting);
      });
    }
    return meetingsList;
  }

  public getMeetingsService(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.restService.receiveDataFromFastApi(urls.protocolBase, urls.localFastApi, urls.GETMEETINGS)
        .subscribe({
          next: (response: any) => {
            let meetingsList = this.mapMeetings(response);
            this.setGlobalMeetingsList(meetingsList);
            resolve(true);
          },
          error: (error: any) => {
            this.meetingGetError = error;
            console.error("Error:", error);
            resolve(false);
          }
        });
    });
  }


  public getMeetingDetailService(id: number): Promise<ExistedBoardMeetings | Error | null> {
    return new Promise<ExistedBoardMeetings | Error | null>((resolve) => {
      this.restService.receiveDataFromFastApi(urls.protocolBase, urls.localFastApi, urls.GETMEETINGDETAILS, null, id)
        .subscribe({
          next: (response: any) => {
            let metting = this.mapMeetingDetails(response);
            if(!metting){
              resolve(null);
            } else {
              resolve(metting);
            }

          },
          error: (error: any) => {
            console.error("Error:", error);
            resolve(error);
          }
        });
    });
  }

  public createDocumentsData = (filesUrls: Array<string>): Array<AttachedDocument> => {
    const attachedDocuments: Array<AttachedDocument> = [];
    filesUrls.forEach(url => {
      const newAttachedDocument: AttachedDocument = {
        fileName: url.slice(7),
        originalUrl: url,
        fullUrl: `${urls.protocolBase}${urls.localFastApi}${url}`,
      }
      attachedDocuments.push(newAttachedDocument);
    });
    return attachedDocuments;
  }
}