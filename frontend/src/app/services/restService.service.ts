import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BoardMeetingData, ExistedBoardMeetings, FileUploadResponse, Guest, backendGuest } from '../shared/interfaces';
import { urls } from '../shared/enums';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient, private router: Router) { }

  uploadFiles(files: File[], endpoint: string): Observable<FileUploadResponse> {
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file, file.name);
    }

    return new Observable<FileUploadResponse>((result) => {
      this.http.post(`${urls.protocolBase}/${urls.localFastApi}/${endpoint}`, formData)
        .subscribe({
          next: (response: any) => {
            console.log("Upload File Response:", response);
            result.next(response);
            result.complete();
          },
          error: (error: Error) => {
            console.error("Error uploading files:", error);
            result.error(false);
            result.complete();
          }
        });
    });
  }


  sendDataToFastApi(dataToSend: BoardMeetingData | ExistedBoardMeetings, endpoint: urls): Observable<boolean> {
    const attachedDocumentsUrls: string[] = [];
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
        };
        newGuests.push(newGuest);
      });
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
      agenda: dataToSend.agenda,
      documents: attachedDocumentsUrls.length > 0 ? attachedDocumentsUrls : null
    };

    return new Observable<boolean>((observer) => {
      if (endpoint === urls.UPDATEMEETING) {
        let updatePack = { ...packedText, id: dataToSend.id };
        this.http.put(`${urls.protocolBase}/${urls.localFastApi}/${endpoint}`, updatePack)
          .subscribe({
            next: response => {
              observer.next(true);
              observer.complete();
            },
            error: error => {
              console.error("Error:", error);
              observer.next(false);
              observer.complete();
            }
          });
      } else {
        this.http.post(`${urls.protocolBase}/${urls.localFastApi}/${endpoint}`, packedText)
          .subscribe({
            next: response => {
              observer.next(true);
              observer.complete();
            },
            error: error => {
              console.error("Error:", error);
              observer.next(false);
              observer.complete();
            }
          });
      }
    });
  }

  private combineUrl(protocol: urls, baseUrl: urls, endPoint: urls, param: urls | null | number = null, number1: number | null = null, number2: number | null = null) {
    let newUrl = protocol + baseUrl + '/' + endPoint;

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
    const deleteUrl = `${urls.protocolBase}/${urls.localFastApi}/${urls.DELETEMEETING}/${id}`;
    return this.http.delete(deleteUrl);
  }


}
