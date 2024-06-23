import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BoardMeetingData, ExistedBoardMeetings, FileUploadResponse, Guest, GuestInvited, Task } from '../shared/interfaces';
import { InviteService, dataService } from '../services/dataService.service';
import { RestService } from '../services/restService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { urls } from '../shared/enums';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-edit-meeting-page',
  templateUrl: './edit-meeting-page.component.html',
  styleUrls: ['./edit-meeting-page.component.css']
})
export class EditMeetingPageComponent implements OnInit, OnDestroy {

  public editedMeetingId: number | null = null;
  public formDisabled: boolean = true;
  private subscription: Subscription | undefined;

  private guestsList: GuestInvited[] = [];
  private tasksList: Task[] = [];
  private combinedData: BoardMeetingData;
  // draft option will be added in future to save draft data in local storage
  // private draft: BoardMeetingData;
  public editedMeeting: ExistedBoardMeetings | null = null;
  public editedTasks: Task[] | null = null;
  public invitedToEdited: Guest[] | null = null;
  public foundMeeting: boolean = false;
  public meetingError: string | null = null;
  public loadingMeeting: boolean = true;
  private newFiles: File[];
  private sidenav: MatSidenav | undefined;
  public activeHamburger: boolean = false;

  constructor(
    private inviteService: InviteService,
    private restService: RestService,
    private route: ActivatedRoute,
    private dataService: dataService,
    private breakpointObserver: BreakpointObserver
  ) {
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
    this.newFiles = [];
    // draft option will be added in future to save draft data in local storage
    // this.draft = this.combinedData;

    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (result.matches) {
        this.activeHamburger = true
      } else {
        this.activeHamburger = false;
      }
    })
  }

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  ngOnInit() {
    this.updateDataEditedMeeting();
  }

  private updateDataEditedMeeting(): void {
    const params = this.route.snapshot.params;
    if (params['id']) {
      this.editedMeetingId = parseInt(params['id'], 10);
      this.loadMeetingData(this.editedMeetingId);
    }
  }

  private loadMeetingData(id: number): void {
    this.loadingMeeting = true;
    this.dataService.getMeetingDetailService(id)
      .then((resolve) => {
        if (this.dataService.isError(resolve)) {
          if (this.dataService.getErrorStatus(resolve) == 404) {
            this.meetingError = "The meeting with the specified ID cannot be found";
          } else {
            this.meetingError = "Server communication error";
          }
          this.loadingMeeting = false;

        } else {
          if (resolve !== null && !(resolve instanceof Error)) {
            this.editedMeeting = resolve;
            this.loadingMeeting = false;
            this.mapMeetingData();
            this.formDisabled = false;
          } else {
            console.error("Null response received");
          }
        }
      });
  }

  private mapMeetingData(): void {
    if (this.editedMeeting && this.editedMeeting.guests) {
      const editedInvitedGuests: GuestInvited[] = [];
      this.editedMeeting.guests.forEach(guest => {
        const invitedGuest: GuestInvited = {
          id: guest.id,
          name: guest.name,
          surname: guest.surname,
          jobPosition: guest.jobPosition,
          invited: true
        };
        editedInvitedGuests.push(invitedGuest);
      });
      this.inviteService.updateGuestsList(editedInvitedGuests);
    }

    if (this.editedMeeting && this.editedMeeting.tasksList) {
      this.editedTasks = this.editedMeeting.tasksList;
    }
    if (this.editedMeeting && this.editedMeeting.guests) {
      this.invitedToEdited = this.editedMeeting.guests;
    }

    this.inviteService.inviteList$.subscribe(invited => {
      this.guestsList = invited;
    });
  }

  // draft option will be added in future to save draft data in local storage
  //
  // public saveDraft(): void {
  // }


  public saveAndPublish(): void {
    if (this.combinedData.meetingType === "") {
      alert("meeting type cannot be empty");
    } else if (this.combinedData.meetingName === "") {
      alert("meeting name cannot be empty");
    } else if ((!this.combinedData.dateStart) || !this.combinedData.dateEnd) {
      alert("You need to choose a date");
    } else if (!this.combinedData.onlineAddress ? false : true || !this.combinedData.meetingAddress ? false : true) {
      alert("You need to provide a location or choose an online option");
    }
    if (this.editedMeeting) {
      this.combinedData = { ...this.combinedData, id: this.editedMeeting.id };
      if (this.newFiles && this.newFiles.length > 0) {
        const responseUrls: string[] = [];
        this.restService.uploadFiles(this.newFiles, urls.UPLOADFILES).subscribe({
          next: (response: FileUploadResponse) => {
            response.file_urls.forEach((url: string) => {
              const fullUrl = `${url}`;
              responseUrls.push(fullUrl);
            });
            if (this.combinedData.attachedDocuments) {
              this.combinedData.attachedDocuments = this.combinedData.attachedDocuments.concat(this.dataService.createDocumentsData(responseUrls));
            } else {
              this.dataService.createDocumentsData(responseUrls)
            }
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
  }


  public saveTasksList(tasksList: Task[]): void {
    // this.tasksList = tasksList;
    this.combinedData.tasksList = this.tasksList;
  }

  public receiveForm(form: any): void {
    this.combinedData.meetingName = form.value.meetingName;
    this.combinedData.meetingType = form.value.selectedMeetingType;
    this.combinedData.dateStart = form.value.dateStart;
    this.combinedData.dateEnd = form.value.dateEnd;
    this.combinedData.meetingAddress = form.get('meetingAddress')?.value;
    this.combinedData.onlineAddress = form.get('onlineAddress')?.value;
    this.combinedData.guests = this.guestsList;
    this.combinedData.tasksList = this.tasksList;
    this.combinedData.agenda = form.value.agenda
    this.combinedData.attachedDocuments = form.get('attachedDocuments')?.value;
    this.newFiles = form.get('addedDocuments')?.value;
    this.formDisabled = form.status !== 'VALID';
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
