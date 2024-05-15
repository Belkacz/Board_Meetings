import { Component, OnInit } from '@angular/core';
import { InviteService } from 'src/app/services/dataService.service';
import { GuestInvited } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css']
})
export class GuestsComponent implements OnInit {

  guestsList!: GuestInvited[];

  constructor(private inviteService: InviteService) {
  }

  ngOnInit() {
    this.inviteService.inviteList$.subscribe(invited => {
      this.guestsList = invited;
    })
  }
}
