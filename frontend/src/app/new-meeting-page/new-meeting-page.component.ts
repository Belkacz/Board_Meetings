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

  @ViewChild(NewMeetingComponent, { static: false }) newMeetingComponent: NewMeetingComponent;

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

  constructor(private newMeeting: NewMeetingComponent, private inviteService: InviteService, private restService: RestService,
    private dataService: dataService, private breakpointObserver: BreakpointObserver
  ) {
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
    })
  }

  ngAfterViewInit() {
    this.subscription = this.newMeetingComponent.form.statusChanges.subscribe(status => {
      this.formDisabled = status !== 'VALID';
    });
  }

  // draft option will be added in future to save draft data in local storage
  //
  // public saveDraft(): void {
  // }

  private mapFormToCombinedData(): void {
    const formValue = this.newMeetingComponent.form.value;
    for (const key in formValue) {
      if (key in this.combinedData) {
        this.combinedData = { ...this.combinedData, [key]: formValue[key] };
      }
    }
    this.combinedData.meetingType = this.newMeetingComponent.form.value.selectedMeetingType;
    this.combinedData.guests = this.guestsList;
    this.combinedData.tasksList = this.tasksList;
    this.combinedData.agenda = this.newMeetingComponent.form.value.agenda

    this.newFiles = this.newMeetingComponent.form.get('addedDocuments')?.value;
  }

  public saveAndPublish(): void {
    this.mapFormToCombinedData();
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
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
