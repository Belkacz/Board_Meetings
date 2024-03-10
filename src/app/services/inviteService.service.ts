import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GestInvited } from '../shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class InviteService {
    inviteList$ = new BehaviorSubject<GestInvited[]>([]);

    public updateGuestsList(guestsList: GestInvited[]) {
        const invitedGuests: GestInvited[] = guestsList.filter(guest => guest.invited === true);
        this.inviteList$.next(invitedGuests);
    }
}