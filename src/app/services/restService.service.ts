import { Injectable } from '@angular/core';
import { promiseData } from './promise';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { BoardMeetingData } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient, private router: Router) { }

  public sendData(data: any): Promise<any> {
    return promiseData(data)
      .then(() => {
        console.log('Wysyłanie danych zakończone sukcesem');
      })
      .catch((error) => {
        console.error('Wystąpił błąd podczas wywyłania danych:', error);
      });
  }


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
          console.log('Response from PHP:', response);
        },
        error: error => {
          console.error('Error:', error);
        }
      });
  }
}
