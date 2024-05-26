import { AfterViewInit, Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BoardMeetingData, ExistedBoardMeetings, Guest, GuestInvited, Task } from '../shared/interfaces';
import { InviteService, MapListsService } from '../services/dataService.service';
import { RestService } from '../services/restService.service';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { urls } from '../shared/enums';
import { NewMeetingComponent } from '../new-meeting-page/new-meeting/new-meeting.component';

@Component({
  selector: 'app-edit-meeting-page',
  templateUrl: './edit-meeting-page.component.html',
  styleUrls: ['./edit-meeting-page.component.css'],
  providers: [NewMeetingComponent]
})

export class EditMeetingPageComponent implements OnInit, OnDestroy {

  editedMeetingId: number | null = null;
  editedMeting: ExistedBoardMeetings | null = null;
  public formDisabled: boolean;
  private subscription: Subscription | undefined;

  @ViewChild(NewMeetingComponent, { static: false }) newMeetingComponent: NewMeetingComponent;

  private guestsList: GuestInvited[];
  private tasksList: Task[];
  //private agenda: Agenda;
  private combinedData: BoardMeetingData;
  private draft: BoardMeetingData;
  public editedMeeting: ExistedBoardMeetings | null = null;
  public editedTasks: Task[] | null = null;
  public invitedToEdited: Guest[] | null = null;

  constructor(private newMeeting: NewMeetingComponent, private inviteService: InviteService, private restService: RestService,
    private route: ActivatedRoute, private dataService: MapListsService
  ) {

    const params = this.route.snapshot.params;
    if (params['id']) {
      this.editedMeetingId = parseInt(params['id'], 10);
    }

    this.dataService.actualList$.subscribe(meetings => {
      meetings.forEach(element => {
        if (element.id === this.editedMeetingId) {
          this.editedMeeting = element;
        }
      });
    });

    if (this.editedMeeting && this.editedMeeting.guests) {
      const editedInvitedGuests: GuestInvited[] = [];
      this.editedMeeting.guests.forEach(guest => {
        const invitedGuest: GuestInvited = {
          id: guest.id,
          name: guest.name,
          surname: guest.surname,
          jobPosition: guest.jobPosition,
          invited: true
        }
        editedInvitedGuests.push(invitedGuest);
      });
      this.inviteService.updateGuestsList(editedInvitedGuests)
    }

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
      agenda: null,
      attachedDocuments: null
    }
    this.draft = this.combinedData;

    this.formDisabled = this.editedMeeting ? false : true;
  }

  ngOnInit() {
    if (this.editedMeeting && this.editedMeeting.tasksList) {
      this.editedTasks = this.editedMeeting.tasksList
    }
    if (this.editedMeeting && this.editedMeeting.guests) {
      this.invitedToEdited = this.editedMeeting.guests
    }

    this.inviteService.inviteList$.subscribe(invited => {
      this.guestsList = invited;
    })

  }

  ngAfterViewInit() {
    this.subscription = this.newMeetingComponent.form.statusChanges.subscribe(status => {
      this.formDisabled = status !== 'VALID';
    });
  }

  public saveDraft(): void {
    this.draft = this.combinedData;
    alert('Save as Draft Placeholder');
    this.draft = {
      meetingType: "boardMeeting",
      meetingName: "spotkanie",
      dateStart: new Date("2024-03-10T13:14:50.985Z"),
      dateEnd: new Date("2024-03-10T15:16:50.985Z"),
      meetingAddress: "park sledzia",
      onlineAddress: null,
      guests: [
        { id: 1, name: "Wade", surname: "Warner", jobPosition: "Cair of the board" },
        { id: 2, name: "Floyd", surname: "Miles", jobPosition: "Board member" },
        { id: 3, name: "Brooklyn", surname: "Simmons", jobPosition: "Board member" }],
      tasksList: [{ "id": 1, "name": "New task name 1" }, { "id": 2, "name": "New task name 2" }],
      chooseFile: null,
      addedDocuments: null,
      agenda: null,
      attachedDocuments: null
    }
    console.log(this.combinedData)
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
    this.combinedData.addedDocuments = this.newMeetingComponent.form.get('addedDocuments')?.value;

    const files = this.newMeetingComponent.form.get('addedDocuments')?.value;

    if (!this.combinedData.agenda?.name) {
      this.combinedData.agenda = null;
    }

    if (this.combinedData.meetingType === "") {
      alert("meeting type cannot be empty")
    } else if (this.combinedData.meetingName === "") {
      alert("meeting name cannot be empty")
    } else if ((!this.newMeetingComponent.dateStartControl || !this.newMeetingComponent.dateEndControl)) {
      alert("You need to chose date")
    } else if (!this.combinedData.onlineAddress ? false : true || !this.combinedData.meetingAddress ? false : true) {
      alert("You need to provide a location or choose an online option");
    } else {
      alert('Save And Publish Placeholder, open console for more details')
    }

    if (this.editedMeeting) {
      this.combinedData = { ...this.combinedData, id: this.editedMeeting.id }
      if (files && files.length > 0) {
        const responseUrls: string[] = []
        this.restService.uploadFiles(files, urls.UPLOADFILES).subscribe({
          next: (response: any) => {
            console.log("Response from FastApi:", response);
            response.file_urls.forEach((url: string) => {
              const fullUrl = `${url}`;
              responseUrls.push(fullUrl);
            });
            this.combinedData['attachedDocuments'] = this.dataService.createDocumentsData(responseUrls);
            this.restService.sendDataToFastApi(this.combinedData, urls.UPDATEMEETING);
          },
          error: error => {
            console.error("Error:", error);
          }
        });
      } else {
        this.restService.sendDataToFastApi(this.combinedData, urls.UPDATEMEETING);
      }
    }
    // const files = this.newMeetingComponent.addedDocuments.value;

    // if (files.length > 0) {
    //   const responseUrls: string[] = []
    //   this.restService.uploadFiles(files, urls.UPLOADFILES).subscribe({
    //     next: (response: any) => {
    //       console.log("Response from FastApi:", response);
    //       response.file_urls.forEach((url: string) => {
    //         const fullUrl = `${urls.protocolBase}${urls.localFastApi}${url}}`;
    //         responseUrls.push(fullUrl);

    //       });
    //       // this.combinedData.addedDocuments = responseUrls;
    //     },
    //     error: error => {
    //       console.error("Error:", error);
    //     }
    //   });
    // }

    // if (this.editedMeeting) {
    //   this.combinedData = { ...this.combinedData, id: this.editedMeeting.id }
    //   this.restService.sendDataToFastApi(this.combinedData, urls.UPDATEMEETING);
    // } else {
    //   this.restService.sendDataToFastApi(this.combinedData, urls.NEWMEETING);
    // }

    // console.log(this.combinedData.addedDocuments)
    // if (this.combinedData.meetingType === "") {
    //   alert("meeting type cannot be empty")
    // } else if (this.combinedData.meetingName === "") {
    //   alert("meeting name cannot be empty")
    // } else if ((!this.newMeetingComponent.dateStartControl || !this.newMeetingComponent.dateEndControl)) {
    //   alert("You need to chose date")
    // } else if (!this.combinedData.onlineAddress ? false : true || !this.combinedData.meetingAddress ? false : true) {
    //   alert("You need to provide a location or choose an online option");
    // } else {
    //   alert('Save And Publish Placeholder, open console for more details')
    // }
    // console.log(this.combinedData)


  }

  public saveTasksList(tasksList: Task[]): void {
    this.tasksList = tasksList;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
