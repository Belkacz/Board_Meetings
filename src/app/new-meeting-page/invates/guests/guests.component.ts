import { Component, OnInit } from '@angular/core';
import { InviteService } from 'src/app/services/inviteService.service';
import { GestInvited } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css']
})
export class GuestsComponent implements OnInit {

  guestsList!: GestInvited[];

  constructor(private inviteService: InviteService) {
  }

  ngOnInit() {
    this.inviteService.inviteList$.subscribe(invited => {
      this.guestsList = invited;
    })
  }
}
