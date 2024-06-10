import { Component, OnDestroy, OnInit } from '@angular/core';
import { RestService } from '../services/restService.service';
import { urls } from '../shared/enums';
import { Guest, Task, Agenda, ExistedBoardMeetings, ShortMetting } from "../shared/interfaces"
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { dataService } from '../services/dataService.service'
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';

@Component({
  selector: 'app-meetings-list',
  templateUrl: './meetings-list.component.html',
  styleUrl: './meetings-list.component.css',
})
export class MeetingsListComponent implements OnInit, OnDestroy {

  public meetingsNotEmpty = false;
  public errorMessage: null | string = null;
  public meetingsList: ShortMetting[] = [];
  public displayedColumns: string[] = ['meetingName', 'meetingType', 'dateStart', 'dateEnd', 'infoButton', 'deleteButton', 'editButton'];
  private subscription: Subscription | undefined;

  constructor(private dataService: dataService, private restService: RestService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.meetingsList = [];
  }

  ngOnInit(): void {
    this.fetchMeetings();
  }

  private fetchMeetings(): void {
    this.dataService.getMeetingsService().then((success) => {
      if (success) {
        this.subscription = this.dataService.getGlobalMeetingsList().subscribe(
          (meetings: ShortMetting[]) => {
            this.meetingsList = meetings;
            if (this.meetingsList.length > 0) {
              this.meetingsNotEmpty = true;
            }
            this.errorMessage = this.dataService.getGlobalMeetingsErrorMessage();
          })
      } else {
        this.errorMessage = this.dataService.getGlobalMeetingsErrorMessage();
      }
    });
  }

  deleteMeeting(id: number) {
    if (id === null) {
      const returnMessage = "No object ID to delete";
      this._snackBar.open(returnMessage, 'Close', { duration: 3000 });
      throw new Error(returnMessage);
    } else {
      this.restService.deleteMeeting(id).subscribe({
        next: () => {
          this.fetchMeetings();
          this._snackBar.open("Deleted object of id" + id, 'Close', { duration: 3000 });
        },
        error: (error: any) => {
          console.error('Error: ', error);
          this._snackBar.open("Cannot delete object, check console for more information", 'Close', { duration: 3000 });
        }
      });
    }
  }

  meetingInfo(meetingId: number): void {
    this.dataService.getMeetingDetailService(meetingId)
      .then((resolve) => {
        if (resolve instanceof Error) {
          console.error("Error occurred:", resolve);
        } else {
          console.log("Meeting details:", resolve);
          const dialogRef = this.dialog.open(DialogInfoComponent, {
            data: resolve
          });
        }
      })
      .catch((error) => {
        console.error("Promise rejected:", error);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
