import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BoardMeetingData, ExistedBoardMeetings, FileUploadResponse, Guest, GuestInvited, Task } from '../shared/interfaces';
import { InviteService, dataService } from '../services/dataService.service';
import { RestService } from '../services/restService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { urls } from '../shared/enums';
import { NewMeetingComponent } from '../new-meeting-page/new-meeting/new-meeting.component';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-meeting-page',
  templateUrl: './edit-meeting-page.component.html',
  styleUrls: ['./edit-meeting-page.component.css']
})
export class EditMeetingPageComponent implements OnInit, OnDestroy {

  editedMeetingId: number | null = null;
  public formDisabled: boolean = true;
  private subscription: Subscription | undefined;

  // @ViewChild(NewMeetingComponent, { static: false }) newMeetingComponent: NewMeetingComponent | undefined;

  private guestsList: GuestInvited[] = [];
  private tasksList: Task[] = [];
  private combinedData: BoardMeetingData;
  // draft option will be added in future to save draft data in local storage
  // private draft: BoardMeetingData;
  public editedMeeting: ExistedBoardMeetings | null = null;
  public editedTasks: Task[] | null = null;
  public invitedToEdited: Guest[] | null = null;
  public foundMeeting: boolean = false;
  public getMeetingError: string | null = null;
  public loadingMeeting: boolean = true;
  private newFiles: File[];

  constructor(
    private inviteService: InviteService,
    private restService: RestService,
    private route: ActivatedRoute,
    private dataService: dataService,
    private _snackBar: MatSnackBar,
    private router: Router
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
          console.error("Error occurred:", resolve);
          if (this.dataService.getErrorStatus(resolve) == 404) {
            this.getMeetingError = "The meeting with the specified ID cannot be found";
          } else {
            this.getMeetingError = "Server communication error";
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
      alert("Meeting type cannot be empty");
      return;
    }
    if (this.combinedData.meetingName === "") {
      alert("Meeting name cannot be empty");
      return;
    }
    if (!this.combinedData.dateStart || !this.combinedData.dateEnd) {
      alert("You need to choose a date");
      return;
    }
    if (!this.combinedData.onlineAddress && !this.combinedData.meetingAddress) {
      alert("You need to provide a location or choose an online option");
      return;
    }

    if (this.editedMeeting) {
      this.combinedData = { ...this.combinedData, id: this.editedMeeting.id };

      if (this.newFiles && this.newFiles.length > 0) {
        this.restService.uploadFiles(this.newFiles, urls.UPLOADFILES).subscribe({
          next: (response: FileUploadResponse) => {
            const responseUrls: string[] = response.file_urls.map((url: string) => `${url}`);
            this.combinedData.attachedDocuments = this.dataService.createDocumentsData(responseUrls);

            this.restService.sendDataToFastApi(this.combinedData, urls.UPDATEMEETING).subscribe({
              next: (apiResponse: boolean) => {
                if (apiResponse && this.editedMeeting) {
                  this._snackBar.open(`Successfully edited meeting ${this.editedMeeting.id}`, 'Close', { duration: 4000, verticalPosition: 'top' });
                  this.router.navigate(['/'])
                }
              },
              error: (error: Error) => {
                console.error("Error sending data to FastApi:", error);
                this._snackBar.open(`Error editing meeting: ${error.message}`, 'Close', { duration: 4000, verticalPosition: 'top' });
              }
            });
          },
          error: (error: Error) => {
            console.error("Error uploading files:", error);
            this._snackBar.open(`Error uploading files: ${error.message}`, 'Close', { duration: 4000, verticalPosition: 'top' });
          }
        });
      } else {
        this.restService.sendDataToFastApi(this.combinedData, urls.UPDATEMEETING).subscribe({
          next: (apiResponse: boolean) => {
            if (apiResponse && this.editedMeeting) {
              this._snackBar.open(`Successfully edited meeting ${this.editedMeeting.id}`, 'Close', { duration: 4000, verticalPosition: 'top' });
              this.router.navigate(['/'])
            }
          },
          error: (error: Error) => {
            console.error("Error sending data to FastApi:", error);
            this._snackBar.open(`Error editing meeting: ${error.message}`, 'Close', { duration: 4000, verticalPosition: 'top' });
          }
        });
      }
    }
  }

  public saveTasksList(tasksList: Task[]): void {
    this.tasksList = tasksList;
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
