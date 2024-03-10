import { Component } from '@angular/core';
import { InviteService } from 'src/app/services/inviteService.service';
import { workerList } from 'src/app/shared/enums';
import { Guest } from 'src/app/shared/interfaces';

interface GestInvited extends Guest {
  invited: boolean;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent {
  public guestsList: GestInvited[];
  public wanted: string;
  public searchedList: GestInvited[];
  public allChecked: boolean;

  constructor(private inviteService: InviteService) {
    this.searchedList = [{ id: 0, name: "", surname: "", jobPosition: null, invited: false }]
    this.wanted = "";
    this.allChecked = false;
    this.guestsList = workerList.map(guest => ({ ...guest, invited: false }));
  }

  ngOnInit(): void {
    this.searchedList = workerList.map(guest => ({ ...guest, invited: false }));;
  }

  public search() {
    this.searchedList = this.guestsList.filter(wantedPerson =>
      (wantedPerson.name.toLowerCase().includes(this.wanted.toLowerCase()) || wantedPerson.surname.toLowerCase().includes(this.wanted.toLowerCase()))
    )
  }

  public handleCheckAll() {
    this.allChecked = !this.allChecked;
    this.searchedList.forEach(item => item.invited = this.allChecked);
    this.searchedList.forEach(serchedPop => {
      this.guestsList.forEach(guest => {
        if (guest.id === serchedPop.id) {
          guest.invited = this.allChecked
        }
      });
    });
    this.emitGestList();
    //this.guestsList.forEach(item => item.invited = this.allChecked);
  }

  public checkPerson(i: number) {
    this.searchedList[i].invited = !this.searchedList[i].invited;
    this.guestsList.forEach(pop => {
      if (pop.id === this.searchedList[i].id) {
        pop.invited = this.searchedList[i].invited;
      }
    });
    
    let allSerchedCheck = true;
    this.searchedList.forEach(pop => {
      if(pop.invited === false){
        allSerchedCheck = false;
      }
    });
    if(allSerchedCheck){
      this.allChecked = true;
    } else{
      this.allChecked = false;
    }
    this.emitGestList();
  }

  // resetList() {
  //   this.searchedList = this.guestsList;
  // }

  private emitGestList() {
    this.inviteService.updateGuestsList(this.guestsList)
  }
}
