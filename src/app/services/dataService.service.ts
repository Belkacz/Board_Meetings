import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Agenda, GestInvited } from '../shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class InviteService {
    inviteList$ = new BehaviorSubject<GestInvited[]>([]);
    agenda$ = new Subject<Agenda>();

    public updateGuestsList(guestsList: GestInvited[]) {
        const invitedGuests: GestInvited[] = guestsList.filter(guest => guest.invited === true);
        this.inviteList$.next(invitedGuests);
    }

    public updateAgenda(newAgenda: Agenda) {
        this.agenda$.next(newAgenda);
    }
}