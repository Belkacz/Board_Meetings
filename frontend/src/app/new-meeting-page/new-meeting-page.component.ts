import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NewMeetingComponent } from './new-meeting/new-meeting.component';
import { BoardMeetingData, ExistedBoardMeetings, FileUploadResponse, Guest, GuestInvited, Task } from '../shared/interfaces';
import { InviteService, dataService } from '../services/dataService.service';
import { RestService } from '../services/restService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { urls } from '../shared/enums';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-new-meeting-page',
  templateUrl: './new-meeting-page.component.html',
  styleUrls: ['./new-meeting-page.component.css'],
  providers: [NewMeetingComponent]
})
export class NewMeetingPageComponent implements OnInit, OnDestroy {

  public formDisabled: boolean;
  private subscription: Subscription | undefined;

  private guestsList: GuestInvited[];
  private tasksList: Task[];
  private combinedData: BoardMeetingData;
  // draft option will be added in future to save draft data in local storage
  // private draft: BoardMeetingData;
  public editedMeeting: ExistedBoardMeetings | null = null;
  public editedTasks: Task[] | null = null;
  public invitedToEdited: Guest[] | null = null;
  private newFiles: any;
  public activeHamburger: boolean = false;

  constructor(private inviteService: InviteService, private restService: RestService,
    private dataService: dataService, private breakpointObserver: BreakpointObserver
  ) {
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
    // draft option will be added in future to save draft data in local storage
    // this.draft = this.combinedData;

    this.formDisabled = this.editedMeeting ? false : true;

    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (result.matches) {
        this.activeHamburger = true
      } else {
        this.activeHamburger = false;
      }
    })
  }

  ngOnInit() {
    this.inviteService.inviteList$.subscribe(invited => {
      this.guestsList = invited;
      this.combinedData.guests = this.guestsList;
    })
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

    this.receiveForm;
    if (this.newFiles && this.newFiles.length > 0) {
      this.restService.uploadFiles(this.newFiles, urls.UPLOADFILES).subscribe({
        next: (response: FileUploadResponse) => {
          const responseUrls: string[] = response.file_urls.map((url: string) => `${url}`);
          this.combinedData.attachedDocuments = this.dataService.createDocumentsData(responseUrls);

          this.restService.sendDataToFastApi(this.combinedData, urls.NEWMEETING)
        },
        error: (error: Error) => {
          console.error("Error uploading files:", error);
        }
      });
    } else {
      this.restService.sendDataToFastApi(this.combinedData, urls.NEWMEETING)
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
