import { Component, Input, SimpleChanges } from '@angular/core';
import { InviteService } from 'src/app/services/dataService.service';
import { Guest } from 'src/app/shared/interfaces';

interface GuestInvited extends Guest {
  invited: boolean;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent {
  @Input() initialPersonsList: Guest[] | null = null;
  @Input() invitedToEdited: Guest[] | null = null;
  public guestsList: GuestInvited[] = [];
  public wanted: string;
  public searchedList: GuestInvited[];
  public allChecked: boolean;

  constructor(private inviteService: InviteService) {
    this.searchedList = [{ id: 0, name: "", surname: "", jobPosition: null, invited: false }]
    this.wanted = "";
    this.allChecked = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialPersonsList) {
      this.guestsList = this.initialPersonsList.map(guest => ({
        ...guest,
        invited: this.invitedToEdited ? this.invitedToEdited.some(person => person.id === guest.id) : false
      }));
      this.searchedList = [...this.guestsList];
      this.inviteService.updateGuestsList(this.guestsList)
    }
  }

  public search() {
    this.searchedList = this.guestsList.filter(wantedPerson =>
      (wantedPerson.name.toLowerCase().includes(this.wanted.toLowerCase()) || wantedPerson.surname.toLowerCase().includes(this.wanted.toLowerCase()))
    )
  }

  public handleCheckAll() {
    this.allChecked = !this.allChecked;
    this.searchedList.forEach(item => item.invited = this.allChecked);
    this.searchedList.forEach(searchedPop => {
      this.guestsList.forEach(guest => {
        if (guest.id === searchedPop.id) {
          guest.invited = this.allChecked
        }
      });
    });
    this.emitGestList();
  }

  public checkPerson(i: number) {
    this.searchedList[i].invited = !this.searchedList[i].invited;
    this.guestsList.forEach(pop => {
      if (pop.id === this.searchedList[i].id) {
        pop.invited = this.searchedList[i].invited;
      }
    });
    
    let allSearchedCheck = true;
    this.searchedList.forEach(pop => {
      if(pop.invited === false){
        allSearchedCheck = false;
      }
    });
    if(allSearchedCheck){
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
