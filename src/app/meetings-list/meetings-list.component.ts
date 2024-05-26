import { Component, OnDestroy, OnInit } from '@angular/core';
import { RestService } from '../services/restService.service';
import { urls } from '../shared/enums';
import { Guest, Task, Agenda, ExistedBoardMeetings } from "../shared/interfaces"
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { dataMapService } from '../services/dataService.service'

@Component({
  selector: 'app-meetings-list',
  templateUrl: './meetings-list.component.html',
  styleUrl: './meetings-list.component.css',
})
export class MeetingsListComponent implements OnInit, OnDestroy {

  public meetingsNotEmpty = false;
  public errorMessage: null | string = null;
  public meetingsList: ExistedBoardMeetings[] = [];
  public displayedColumns: string[] = ['meetingName', 'meetingType', 'dateStart', 'dateEnd', 'deleteButton', 'editButton'];
  private subscription: Subscription | undefined;

  constructor(private dataService: dataMapService, private restService: RestService, private _snackBar: MatSnackBar) {
    this.meetingsList = [];
  }

  ngOnInit(): void {
    this.subscription = this.dataService.getGlobalMeetingsList().subscribe(
      (meetings: ExistedBoardMeetings[]) => {
        this.meetingsList = meetings;
          if(this.meetingsList.length > 0){
            this.meetingsNotEmpty =  true;
          }
          this.errorMessage = this.dataService.getGlobalMeetingsErrorMessage();
      })
      this.dataService.getMeetingsService();
  }

  deleteMeeting(id: number) {
    if (id === null) {
      const returnMessage = "No object ID to delete";
      this._snackBar.open(returnMessage, 'Close', { duration: 3000 });
      throw new Error(returnMessage);
    } else {
      this.restService.deleteMeeting(id).subscribe({
        next: () => {
          this.dataService.getMeetingsService();
          this._snackBar.open("Deleted object of id" + id, 'Close', { duration: 3000 });
        },
        error: (error: any) => {
          console.error('Error: ', error);
          this._snackBar.open("Cannot delete object, check console for more information", 'Close', { duration: 3000 });
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
