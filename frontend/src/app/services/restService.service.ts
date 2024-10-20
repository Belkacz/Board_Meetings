import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BoardMeetingData, CreateMeetingResponse, EditedMeetingResponse, ExistedBoardMeetings, FileUploadResponse, Guest, backendGuest } from '../shared/interfaces';
import { urls } from '../shared/enums';
import { Observable } from 'rxjs';
import { PopUpService } from './pop-up.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient, private router: Router, private popUpService: PopUpService) { }

  uploadFiles(files: File[], endpoint: string): Observable<FileUploadResponse> {
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file, file.name);
    }

    return new Observable<FileUploadResponse>((result) => {
      this.http.post(`${urls.protocolBase}/${urls.localFastApi}/${endpoint}`, formData)
        .subscribe({
          next: (response: any) => {
            this.popUpService.showPopUp("Successfully uploaded files");
            result.next(response);
            result.complete();
          },
          error: (error: Error) => {
            console.error("Error when uploading files");
            this.popUpService.showPopUp("Error uploading files");
            result.error(false);
            result.complete();
          }
        });
    });
  }


  sendDataToFastApi(dataToSend: BoardMeetingData | ExistedBoardMeetings, endpoint: urls) {
    const attachedDocumentsUrls: string[] = []
    if (dataToSend.attachedDocuments) {
      dataToSend.attachedDocuments.forEach(docs => {
        attachedDocumentsUrls.push(docs.originalUrl);
      });
    }
    const newGuests: Guest[] = [];
    if (dataToSend.guests != undefined) {
      dataToSend.guests.forEach(guest => {
        const newGuest = {
          id: guest.id,
          name: guest.name,
          surname: guest.surname,
          jobPosition: guest.jobPosition
        }
        newGuests.push(newGuest);
      });
    }

    let newAgenda = null;

    if (dataToSend.agenda) {
      newAgenda = {
        id: dataToSend.agenda.id,
        agendaName: dataToSend.agenda.name,
        order: dataToSend.agenda.order,
      }
    }

    let packedText = {
      id: dataToSend.id,
      meetingType: dataToSend.meetingType,
      meetingName: dataToSend.meetingName,
      startDate: dataToSend.dateStart,
      endDate: dataToSend.dateEnd,
      meetingAddress: dataToSend.meetingAddress,
      onlineAddress: dataToSend.onlineAddress,
      guests: newGuests,
      tasksList: dataToSend.tasksList,
      agenda: newAgenda,
      documents: attachedDocumentsUrls.length > 0 ? attachedDocumentsUrls : null
    };
    if (endpoint === urls.UPDATEMEETING) {
      let updatePack = { ...packedText, id: dataToSend.id }
      this.http.put<EditedMeetingResponse>(`/api/${endpoint}`, updatePack)
        .subscribe({
          next: response => {
            this.popUpService.showPopUp(response.editedMeeting);
            this.router.navigate(['/'])
          },
          error: error => {
            this.popUpService.showPopUp(`Error when edited meeting # ${dataToSend.id}`);
            console.error("Error:", error);
          }
        });
    } else {
      this.http.post<CreateMeetingResponse>(`/api/${endpoint}`, packedText)
        .subscribe({
          next: response => {
            this.popUpService.showPopUp(response.message);
            this.router.navigate(['/'])
          },
          error: error => {
            console.error("Error:", error);
          }
        });
    }
  }

  private combineUrl(protocol: urls, baseUrl: urls, endPoint: urls, param: urls | null | number = null, number1: number | null = null, number2: number | null = null) {
    let newUrl = '/api/' + endPoint;

    if (param !== null) {
      newUrl += param;
    }
    if (number1 !== null) {
      newUrl += `/${number1}`
    }
    if (number2 !== null) {
      newUrl += `/${number2}`
    }
    return newUrl;
  }

  receiveDataFromFastApi(protocol: urls, baseUrl: urls, endPoint: urls, param: urls | null = null, number1: number | null = null, number2: number | null = null) {
    return this.http.get(this.combineUrl(protocol, baseUrl, endPoint, param, number1, number2));
  }

  deleteMeeting(id: number): Observable<any> {
    const deleteUrl = `/${urls.DELETEMEETING}/${id}`;
    return this.http.delete(deleteUrl);
  }

}
