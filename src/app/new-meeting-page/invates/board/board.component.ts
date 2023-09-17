import { Component } from '@angular/core';
import { InviteService } from 'src/app/services/inviteService.service';
import { workerList } from 'src/app/shared/enums';
import { Gest } from 'src/app/shared/interfaces';

interface GestInvited extends Gest {
  invited: boolean;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent {
  public gestsList: GestInvited[];
  public wanted: string;
  public searchedList: GestInvited[];
  public allChecked: boolean;

  constructor(private inviteService: InviteService) {
    this.searchedList = [{ id: 0, name: "", surname: "", jobPosition: null, invited: false }]
    this.wanted = "";
    this.allChecked = false;
    this.gestsList = workerList.map(guest => ({ ...guest, invited: false }));
  }

  ngOnInit(): void {
    this.searchedList = workerList.map(guest => ({ ...guest, invited: false }));;
  }

  public search() {
    this.searchedList = this.gestsList.filter(wantedPerson =>
      (wantedPerson.name.toLowerCase().includes(this.wanted.toLowerCase()) || wantedPerson.surname.toLowerCase().includes(this.wanted.toLowerCase()))
    )
  }

  public handleCheckAll() {
    this.allChecked = !this.allChecked;
    this.searchedList.forEach(item => item.invited = this.allChecked);
    this.searchedList.forEach(serchedPop => {
      this.gestsList.forEach(guest => {
        if (guest.id === serchedPop.id) {
          guest.invited = this.allChecked
        }
      });
    });
    this.emitGestList();
    //this.gestsList.forEach(item => item.invited = this.allChecked);
  }

  public checkPerson(i: number) {
    this.searchedList[i].invited = !this.searchedList[i].invited;
    this.gestsList.forEach(pop => {
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
  //   this.searchedList = this.gestsList;
  // }

  private emitGestList() {
    this.inviteService.updateGestsList(this.gestsList)
  }
}
