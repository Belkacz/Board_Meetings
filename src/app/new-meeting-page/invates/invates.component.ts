import { Component, OnInit } from '@angular/core';
import { Gest } from 'src/app/shared/interfaces';

interface GestInvited extends Gest {
  invited: boolean;
}
const workerList: Gest[] = [{ id: 1, name: "Wade", surname: "Warner", jobPosition: "Cair of the board" },
{ id: 2, name: "Floyd", surname: "Miles", jobPosition: "Board memeber" }, { id: 3, name: "Brooklyn", surname: "Simmons", jobPosition: "Board member" },
{ id: 3, name: "Guy", surname: "Howkins", jobPosition: "Board secretary" }, { id: 4, name: "Darrell", surname: "Steward", jobPosition: "Board tresurer" },
{ id: 5, name: "Wade", surname: "Warner2", jobPosition: "dubler" }]

@Component({
  selector: 'app-invates',
  templateUrl: './invates.component.html',
  styleUrls: ['./invates.component.css']
})
export class InvatesComponent implements OnInit {

  guests: Gest[];
  gestsList: GestInvited[];
  wanted: string;
  searchedList: GestInvited[];
  allChecked: boolean;

  constructor() {
    this.guests = []
    this.searchedList = [{ id: 0, name: "", surname: "", jobPosition: null, invited: false }]
    this.wanted = "";
    this.allChecked = false;
    this.gestsList = workerList.map(guest => ({ ...guest, invited: false }));
  }

  ngOnInit(): void {
    this.guests = workerList;
    this.searchedList = workerList.map(guest => ({ ...guest, invited: false }));;
  }

  search() {
    this.searchedList = this.gestsList.filter(serchedPerson =>
      (serchedPerson.name.toLowerCase().includes(this.wanted.toLowerCase()) || serchedPerson.surname.toLowerCase().includes(this.wanted.toLowerCase()))
    )
  }

  hangleCheckekAll() {
    this.allChecked = !this.allChecked;
    this.searchedList.forEach(item => item.invited = this.allChecked);
    this.searchedList.forEach(serchedPop => {
      this.gestsList.forEach(guest => {
        if(guest.id === serchedPop.id){
          guest.invited = this.allChecked
        }
      });
    });
    //this.gestsList.forEach(item => item.invited = this.allChecked);
  }

  checkPerson(i: number){
    this.searchedList[i].invited = !this.searchedList[i].invited;
    this.gestsList.forEach(pop => {
      if(pop.id === this.searchedList[i].id){
        pop.invited = this.searchedList[i].invited;
      }
    });
  }

  resetList() {
    this.searchedList = this.gestsList;
  }

  print() {
    console.log(this.wanted)
  }
}
