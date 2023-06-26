import { Injectable } from '@angular/core';
import { promiseData } from './promise';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() {}

  sendData(data: any): Promise<any> {
    return promiseData(data)
    .then(() => {
        console.log('Wysyłanie danych zakończone sukcesem');
      })
      .catch((error) => {
        console.error('Wystąpił błąd podczas wywyłania danych:', error);
      });
  }
}
