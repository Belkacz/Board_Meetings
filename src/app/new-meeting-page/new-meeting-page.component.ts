import { Component, OnInit, ViewChild } from '@angular/core';
import { NewMeetingComponent } from './new-meeting/new-meeting.component';
import { BoardMeetingData, GestInvited, Task } from '../shared/interfaces';
import { InviteService } from '../services/dataService.service';
import { RestService } from '../services/restService.service';

@Component({
  selector: 'app-new-meeting-page',
  templateUrl: './new-meeting-page.component.html',
  styleUrls: ['./new-meeting-page.component.css'],
  providers: [NewMeetingComponent]
})
export class NewMeetingPageComponent implements OnInit {
  @ViewChild(NewMeetingComponent, { static: false }) newMeetingComponent: NewMeetingComponent;

  private guestsList: GestInvited[];
  private tasksList: Task[];
  //private agenda: Agenda;
  private combinedData: BoardMeetingData;
  private draft: BoardMeetingData;


  constructor(private newMeeting: NewMeetingComponent, private inviteService: InviteService, private restService: RestService) {
    this.newMeetingComponent = newMeeting;
    this.guestsList = [{ id: 0, name: "", surname: "", jobPosition: null, invited: false }]
    this.tasksList = []
    this.combinedData = {
      meetingType: '',
      meetingName: '',
      meetingAddress: null,
      onlineAddress: null,
      dateStart: null,
      dateEnd: null,
      chooseFile: [],
      addedDocuments: [],
      guests: [],
      tasksList: [],
      agenda: []
    }
    this.draft = this.combinedData;
  }

  ngOnInit() {
    this.inviteService.inviteList$.subscribe(invited => {
      this.guestsList = invited;
    })
  }

  public saveDraft(): void {
    console.log(this.newMeetingComponent.form.value);
    // this.draft = this.combinedData;
    // alert('Save as Draft Placeholder');
    // console.log(this.draft)
    // console.log("draft Saved");
    // this.draft = {
    //   meetingType:"boardMeeting",
    //   meetingName:"spotkanie",
    //   dateStart: new Date("2024-03-10T13:14:50.985Z"),
    //   dateEnd: new Date("2024-03-10T15:16:50.985Z"),
    //   meetingAddress:"park sledzia",
    //   onlineAddress:null,
    //   guests:[
    //     {id:1,name :"Wade",surname:"Warner",jobPosition:"Cair of the board"},
    //     {id:2,name:"Floyd",surname:"Miles",jobPosition:"Board member"},
    //     {id:3,name:"Brooklyn",surname:"Simmons",jobPosition:"Board member"}],
    //   tasksList: [{"id":1,"name":"New task name 1"},{"id":2,"name":"New task name 2"}],
    //   chooseFile: null,
    //   addedDocuments: null
    // }
    // this.dataService.sendDataToPHP(this.draft)
  }

  public saveAndPublish(): void {
    const formValue = this.newMeetingComponent.form.value;
    for (const key in formValue) {
      if (key in this.combinedData) {
        this.combinedData = { ...this.combinedData, [key]: formValue[key] };
      }
    }
    this.combinedData.meetingType = this.newMeetingComponent.form.value.selectedMeetingType;
    this.combinedData.guests = this.guestsList;
    this.combinedData.tasksList = this.tasksList;

    if (this.combinedData.meetingType === "") {
      alert("meeting type cannot be empty")
    } else if (this.combinedData.meetingName === "") {
      alert("meeting name cannot be empty")
    } else if ((this.newMeetingComponent.dateStartControl.pristine || this.newMeetingComponent.dateEndControl.pristine)) {
      alert("You need to chose date")
    } else if (!this.combinedData.onlineAddress && !this.combinedData.meetingAddress) {
      alert("You need to provide a location or choose an online option")
    } else {
      alert('Save And Publish Placeholder, open console for more details')
      // this.restService.sendData(this.combinedData)
      this.restService.sendDataToPHP(this.combinedData);
    }
  }

  public saveTasksList(tasksList: Task[]): void {
    this.tasksList = tasksList;
  }

  public formNotReady(): boolean {
    // return this.newMeetingComponent.selectedMeetingType.value &&
    //   this.newMeetingComponent.meetingName.value !== null &&
    //   this.newMeetingComponent.selectedMeetingType.value !== null &&
    //   (this.newMeetingComponent.meetingAddress.value || this.newMeetingComponent.onlineAddress.value) &&
    //   !this.newMeetingComponent.dateStartControl.pristine && !this.newMeetingComponent.dateEndControl.pristine;
    const formStatus = this.newMeetingComponent.form.status === 'VALID' ? true : false
    // console.log(this.newMeetingComponent.form)
    return formStatus && !this.newMeetingComponent.dateStartControl.pristine && !this.newMeetingComponent.dateEndControl.pristine
  }
}
