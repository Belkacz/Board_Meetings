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
import { PopUpService } from '../services/pop-up.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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


  constructor(
    private dataService: dataService,
    private restService: RestService,
    private popUpService: PopUpService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    this.meetingsList = [];
    this.page = 1;
    this.recordsNumber = 0;

    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      if (result.matches) {
        this.displayedColumns = ['id', 'meetingName', 'infoButton', 'deleteButton', 'editButton'];
      } else {
        this.displayedColumns = ['id', 'meetingName', 'meetingType', 'dateStart', 'dateEnd', 'infoButton', 'deleteButton', 'editButton'];
      }
    });
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
            } else {
              this.meetingsNotEmpty = false;
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

  performDeleteMeeting(id: number) {
    this.restService.deleteMeeting(id).subscribe({
      next: () => {
        this.fetchMeetings();
        this.popUpService.showPopUp("Deleted object of id " + id);
      },
      error: (error: any) => {
        console.error('Error: ', error);
        this.popUpService.showPopUp("Cannot delete object, check console for more information");
      }
    });
  }

  deleteMeeting(id: number) {
    if (id === null) {
      const returnMessage = "No object ID to delete";
      this.popUpService.showPopUp(returnMessage);
      throw new Error(returnMessage);
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          question: "Are you sure you want to delete this meeting?",
          confirmFn: () => this.performDeleteMeeting(id)
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
