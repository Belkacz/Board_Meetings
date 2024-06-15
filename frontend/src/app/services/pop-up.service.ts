import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PopUp } from '../shared/interfaces';
import { PupUpTypes } from '../shared/enums';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  PuUpList$ = new Subject<PopUp[]>();
  private popUpSubject = new Subject<PopUp>();

  constructor() {
  }

  public popUp$ = this.popUpSubject.asObservable();

  public showPopUp(message: string, type: PupUpTypes = PupUpTypes.Neutral): void {
    const popUp: PopUp = { message, type };
    this.popUpSubject.next(popUp);
  }
}
