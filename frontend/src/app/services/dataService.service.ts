import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Agenda, ExistedBoardMeetings, GuestInvited, Guest, Task, AttachedDocument } from '../shared/interfaces';
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
export class dataMapService {
  constructor(private restService: RestService) { }
  private actualMeetingsList$ = new BehaviorSubject<ExistedBoardMeetings[]>([]);
  private meetingGetError: Error | null = null;

  public setGlobalMeetingsList(meetingsList: ExistedBoardMeetings[]) {
    this.actualMeetingsList$.next(meetingsList);
  }

  public getGlobalMeetingsList(): Observable<ExistedBoardMeetings[]> {
    return this.actualMeetingsList$.asObservable();
  }

  public getGlobalMeetingsErrorMessage(): string | null {
    if(this.meetingGetError){
      return "Server communication error";
    } else {
      return null;
    }
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

  public mapMeetings = (response: ExistedBoardMeetings[]): ExistedBoardMeetings[] => {
    const meetingsList: ExistedBoardMeetings[] = [];
    if (response.length > 0) {
      response.forEach((meeting: any) => {

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
        const newAgenda = null;
        if (meeting.agenda) {
          const newAgenda: Agenda = {
            id: meeting.agenda.id,
            name: meeting.agenda.name,
            list: meeting.agenda.list,
          }
        }

        const newMeeting: ExistedBoardMeetings = {
          id: meeting.id,
          meetingType: meeting.meeting_type,
          meetingName: meeting.meeting_name,
          meetingAddress: meeting.meeting_address,
          onlineAddress: meeting.online_address,
          dateStart: meeting.start_date,
          dateEnd: meeting.end_date,
          chooseFile: null,
          addedDocuments: null,
          guests: newGuests,
          tasksList: newTasks,
          agenda: newAgenda,
          attachedDocuments: meeting.documents ? this.createDocumentsData(meeting.documents) : null
        }
        meetingsList.push(newMeeting);
      });
    }
    this.setGlobalMeetingsList(meetingsList);
    return meetingsList;
  }

  public getMeetingsService(): Subscription {
    const result = this.restService.receiveDataFromFastApi(urls.protocolBase, urls.localFastApi, urls.GETMEETINGS)
      .subscribe({
        next: (response: any) => {
          let meetingsList = this.mapMeetings(response);
          this.setGlobalMeetingsList(meetingsList);
        },
        error: (error: any) => {
          console.error("Error:", error);
        }
      });
    return result;
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