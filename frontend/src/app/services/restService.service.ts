import { Injectable } from '@angular/core';
import { promiseData } from './promise';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BoardMeetingData, backendGuest } from '../shared/interfaces';
import { urls } from '../shared/enums';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar) { }

  uploadFiles(files: File[], endpoint: string) {
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file, file.name);
    }

    return this.http.post(`${urls.protocolBase}/${urls.localFastApi}/${endpoint}`, formData);
  }

  sendDataToFastApi(dataToSend: BoardMeetingData, endpoint: urls) {
    const attachedDocumentsUrls: string[] = []
    if (dataToSend.attachedDocuments) {
      dataToSend.attachedDocuments.forEach(docs => {
        attachedDocumentsUrls.push(docs.originalUrl);
      });
    }
    const newGuests: backendGuest[] = [];
    if (dataToSend.guests != undefined) {
      dataToSend.guests.forEach(guest => {
        const newGuest = {
          id: guest.id,
          name: guest.name,
          surname: guest.surname,
          job_position: guest.jobPosition
        }
        newGuests.push(newGuest);
      });
    }

    let packedText = {
      meeting_type: dataToSend.meetingType,
      meeting_name: dataToSend.meetingName,
      start_date: dataToSend.dateStart,
      end_date: dataToSend.dateEnd,
      meeting_address: dataToSend.meetingAddress,
      online_address: dataToSend.onlineAddress,
      guests: newGuests,
      tasks: dataToSend.tasksList,
      agenda: dataToSend.agenda,
      documents: attachedDocumentsUrls ? attachedDocumentsUrls : null
    };
    if (endpoint === urls.UPDATEMEETING) {
      let updatePack = { ...packedText, id: dataToSend['id'] }
      this.http.put(`${urls.protocolBase}/${urls.localFastApi}/${endpoint}`, updatePack)
        .subscribe({
          next: response => {
            console.log("Response from FastApi:", response);
          },
          error: error => {
            console.error("Error:", error);
          }
        });
    } else {
      this.http.post(`${urls.protocolBase}/${urls.localFastApi}/${endpoint}`, packedText)
        .subscribe({
          next: response => {
            console.log("Response from FastApi:", response);
          },
          error: error => {
            console.error("Error:", error);
          }
        });
    }
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
