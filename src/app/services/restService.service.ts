import { Injectable } from '@angular/core';
import { promiseData } from './promise';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BoardMeetingData } from '../shared/interfaces';
import { urls } from '../shared/enums';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar) { }

  // public sendData(data: any): Promise<any> {
  //   return promiseData(data)
  //     .then(() => {
  //       console.log('Wysyłanie danych zakończone sukcesem');
  //     })
  //     .catch((error) => {
  //       console.error('Wystąpił błąd podczas wywyłania danych:', error);
  //     });
  // }


  // sendDataToPHP(dataToSend: BoardMeetingData) {
  //   console.log('Data to send:', dataToSend);
  //   let packedText = {
  //     meeting_type: dataToSend.meetingType,
  //     meeting_name: dataToSend.meetingName,
  //     start_date: dataToSend.dateStart,
  //     end_date: dataToSend.dateEnd,
  //     meeting_address: dataToSend.meetingAddress,
  //     online_address: dataToSend.onlineAddress,
  //     guests: dataToSend.guests,
  //     tasks: dataToSend.tasksList
  //   };
  //   this.http.post('http://localhost/meetings.php', packedText, { responseType: 'text' })
  //     .subscribe({
  //       next: response => {
  //         console.log("Response from PHP:", response);
  //       },
  //       error: error => {
  //         console.error("Error:", error);
  //       }
  //     });
  // }

  uploadFiles(files: File[], endpoint: string) {
    const formData = new FormData();
    
    for (const file of files) {
      formData.append('files', file, file.name);
    }
    
    return this.http.post(`${urls.protocolBase}/${urls.localFastApi}/${endpoint}`, formData);
  }

  sendDataToFastApi(dataToSend: BoardMeetingData, endpoint: urls ) {
    console.log('Data to send:', dataToSend);
    let packedText = {
      meeting_type: dataToSend.meetingType,
      meeting_name: dataToSend.meetingName,
      start_date: dataToSend.dateStart,
      end_date: dataToSend.dateEnd,
      meeting_address: dataToSend.meetingAddress,
      online_address: dataToSend.onlineAddress,
      guests: dataToSend.guests,
      tasks: dataToSend.tasksList,
      agenda: dataToSend.agenda,
      documents: dataToSend.attachedDocuments
    };
    if(endpoint === urls.UPDATEMEETING){
      let updatePack = {...packedText, id: dataToSend['id']}
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

  private combineUrl(protocol: urls, baseUrl: urls, endPoint: urls, param: urls | null | number = null) {
    let newUrl = protocol + baseUrl + '/' + endPoint;

    if (param !== null) {
      newUrl += param;
    }
    return newUrl;
  }


  receiveDataFromFastApi(protocol: urls, baseUrl: urls, endPoint: urls, param: urls | null = null) {
    return this.http.get(this.combineUrl(protocol, baseUrl, endPoint, param));
  }

  deleteMeeting(id: number): Observable<any> {
    const deleteUrl = `${urls.protocolBase}/${urls.localFastApi}/${urls.DELETEMEETING}/${id}`;
    return this.http.delete(deleteUrl);
  }


}
