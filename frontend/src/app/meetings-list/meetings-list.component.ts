import { Component, OnDestroy, OnInit } from '@angular/core';
import { RestService } from '../services/restService.service';
import { urls } from '../shared/enums';
import { Guest, Task, Agenda, ExistedBoardMeetings, ShortMeeting } from "../shared/interfaces"
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { dataService } from '../services/dataService.service'
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-meetings-list',
  templateUrl: './meetings-list.component.html',
  styleUrl: './meetings-list.component.css',
})
export class MeetingsListComponent implements OnInit, OnDestroy {

  public meetingsNotEmpty = false;
  public errorMessage: null | string = null;
  public meetingsList: ShortMeeting[] = [];
  public displayedColumns: string[] = ['id', 'meetingName', 'meetingType', 'dateStart', 'dateEnd', 'infoButton', 'deleteButton', 'editButton'];
  private subscription: Subscription | undefined;
  public page: number;
  public recordsNumber: number;
  public loading = true;

  constructor(private dataService: dataService, private restService: RestService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.meetingsList = [];
    this.page = 1;
    this.recordsNumber = 0;
  }

  ngOnInit(): void {
    this.fetchMeetings();
  }

  private fetchMeetings(): void {
    this.dataService.getMeetingsService(this.page).then((response) => {
      if (response.result) {
        this.subscription = this.dataService.getGlobalMeetingsList().subscribe(
          (meetings: ShortMeeting[]) => {
            this.meetingsList = meetings;
            if (this.meetingsList.length > 0) {
              this.meetingsNotEmpty = true;
            }
            if ('length' in response) {
              this.recordsNumber = response.length;
            }
            this.loading = false;
          })
      } else {
        if ('error' in response) {
          this.errorMessage = response.error;
          this.loading = false
        }
      }
    });
  }

  handlePageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.fetchMeetings();
  }

  deleteMeeting(id: number) {
    if (id === null) {
      const returnMessage = "No object ID to delete";
      this._snackBar.open(returnMessage, 'Close', { duration: 3000, verticalPosition: 'top' });
      throw new Error(returnMessage);
    } else {
      this.restService.deleteMeeting(id).subscribe({
        next: () => {
          this.fetchMeetings();
          this._snackBar.open("Deleted object of id" + id, 'Close', { duration: 3000, verticalPosition: 'top' });
        },
        error: (error: any) => {
          console.error('Error: ', error);
          this._snackBar.open("Cannot delete object, check console for more information", 'Close', { duration: 3000, verticalPosition: 'top' });
        }
      });
    }
  }

  meetingInfo(meetingId: number): void {
    this.dataService.getMeetingDetailService(meetingId)
      .then((resolve) => {
        if (this.dataService.isError(resolve)) {
          console.error("Error occurred:", resolve);
        } else {
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
