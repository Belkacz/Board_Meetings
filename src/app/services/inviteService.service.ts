import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GestInvited } from '../shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class InviteService {
    inviteList$ = new BehaviorSubject<GestInvited[]>([]);

    public updateGestsList(gestsList: GestInvited[]) {
        const invitedGuests: GestInvited[] = gestsList.filter(guest => guest.invited === true);
        this.inviteList$.next(invitedGuests);
    }
}