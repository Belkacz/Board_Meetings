import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NewMeetingComponent } from './new-meeting/new-meeting.component';
import { BoardMeetingData, GestInvited } from '../shared/interfaces';
import { InviteService } from '../services/inviteService.service';

@Component({
  selector: 'app-new-meeting-page',
  templateUrl: './new-meeting-page.component.html',
  styleUrls: ['./new-meeting-page.component.css'],
  providers: [NewMeetingComponent]
})
export class NewMeetingPageComponent implements OnInit {
  @ViewChild(NewMeetingComponent, { static: false }) newMeetingComponent: NewMeetingComponent;

  private combinedDataList!: any[]
  private gestsList: GestInvited[];
  private tasksList: string[]
  private combinedData: BoardMeetingData;


  constructor(private newMeeting: NewMeetingComponent, private inviteService: InviteService) {
    this.newMeetingComponent = newMeeting;
    this.gestsList = [{ id: 0, name: "", surname: "", jobPosition: null, invited: false }]
    this.tasksList = []
    this.combinedData = {
      meetingType: '',
      meetingName: '',
      meetingAdrress: null,
      onlineAddress: null,
      dateStart: null,
      dateEnd: null,
      chooseFile: [],
      addedDocuments: [],
      gests: [],
      tasksList: []
    }
  }

  ngOnInit() {
    this.inviteService.inviteList$.subscribe(invited => {
      this.gestsList = invited;
    })
  }

  saveDraft(): void {
    alert('Save as Draft Placeholder')
    console.log("draft Saved")
  }

  saveAndPublish(): void {
    const formValue = this.newMeetingComponent.form.value;
    for (const key in formValue) {
      if (key in this.combinedData) {
        this.combinedData = { ...this.combinedData, [key]: formValue[key] };
      }
    }
    this.combinedData.meetingType = this.newMeetingComponent.form.value.selectedMeetingType;
    this.combinedData.gests = this.gestsList;
    this.combinedData.tasksList = this.tasksList;
    //console.log(this.combinedData.meetingType)
    console.log(this.newMeetingComponent.dateStartControl.dirty);
  
    if (this.combinedData.meetingType === "") {
      alert("meeting type cannot be empty")
    } else if (this.combinedData.meetingName === "") {
      alert("meeting name cannot be empty")
    } else if((this.newMeetingComponent.dateStartControl.pristine || this.newMeetingComponent.dateEndControl.pristine)){
      alert("You need to chose date")
    } else {
      alert('Save And Publish Placeholder')
      console.log("saved and published")
      console.log(this.combinedData)
    }
  }

  goback(): void {
    alert('Go back Placeholder')
    console.log("go back")
  }
  saveTasksList(tasksList: string[]): void {
    this.tasksList = tasksList;
  }

  formNotReady():boolean{
    return this.newMeetingComponent.meetingName.value !== null && this.newMeetingComponent.selectedMeetingType.value !== null ;
  }
}
