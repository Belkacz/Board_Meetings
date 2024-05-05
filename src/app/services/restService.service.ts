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


  sendDataToPHP(dataToSend: BoardMeetingData) {
    console.log('Data to send:', dataToSend);
    let packedText = {
      meeting_type: dataToSend.meetingType,
      meeting_name: dataToSend.meetingName,
      start_date: dataToSend.dateStart,
      end_date: dataToSend.dateEnd,
      meeting_address: dataToSend.meetingAddress,
      online_address: dataToSend.onlineAddress,
      guests: dataToSend.guests,
      tasks: dataToSend.tasksList
    };
    this.http.post('http://localhost/meetings.php', packedText, { responseType: 'text' })
      .subscribe({
        next: response => {
          console.log("Response from PHP:", response);
        },
        error: error => {
          console.error("Error:", error);
        }
      });
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
    const deleteUrl = `${urls.protocolBase}/${urls.LOCALFASTAPI}/${urls.DELETEMEETING}/${id}`;
    return this.http.delete(deleteUrl);
  }

  deleteDataFromFastApi(protocol: urls, baseUrl: urls, endPoint: urls, id: number | null = null) {
    if (id === null) {
        const returnMessage = "No object ID to delete";
        this._snackBar.open(returnMessage, 'Close', { duration: 3000 });
        throw new Error(returnMessage);
    } else {
        const newUrl = this.combineUrl(protocol, baseUrl, endPoint, id);
        this.http.delete(newUrl).subscribe({
            next: () => {
                const returnMessage = "Deleted object of id" + id;
                this._snackBar.open(returnMessage, 'Close', { duration: 3000 });
            },
            error: (error) => {
                const returnMessage = "Cannot delete object, check console for more information";
                console.error("Error:", error);
                this._snackBar.open(returnMessage, 'Close', { duration: 3000 });
            }
        });
    }
  }
}
