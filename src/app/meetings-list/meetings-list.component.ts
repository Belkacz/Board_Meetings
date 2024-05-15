import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/restService.service';
import { urls } from '../shared/enums';
import { Guest, Task, Agenda, ExistedBoardMeetings } from "../shared/interfaces"
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { meetingsListService } from '../services/dataService.service'

@Component({
  selector: 'app-meetings-list',
  templateUrl: './meetings-list.component.html',
  styleUrl: './meetings-list.component.css',
})
export class MeetingsListComponent implements OnInit {

  public meetingsNotEmpty = false;
  public errorMessage: null | string = null;
  public meetingsList: ExistedBoardMeetings[] = [];
  public displayedColumns: string[] = ['meetingName', 'meetingType', 'dateStart', 'dateEnd', 'deleteButton', 'editButton'];
  private subscription: Subscription | undefined;

  constructor(private restService: RestService, private meetingsListService: meetingsListService, private _snackBar: MatSnackBar) {
    this.meetingsList = [];
  }

  ngOnInit(): void {
    this.subscription = this.getMeetings();
  }

  private getMeetings(): Subscription {
    const result = this.restService.receiveDataFromFastApi(urls.protocolBase, urls.localFastApi, urls.GETMEETINGS)
      .subscribe({
        next: (response: any) => {
          this.meetingsList = this.meetingsListService.mapMeetings(response);
          if(this.meetingsList.length > 0){
            this.meetingsNotEmpty =  true;
          }
        },
        error: (error: any) => {
          console.error("Error:", error);
          this.errorMessage = "Server communication error";
        }
      });
    return result;
  }

  // private mapMeetings = (response: ExistedBoardMeetings[]) => {
  //   this.meetingsList = [];
  //   if (response.length > 0) {
  //     response.forEach((meeting: any) => {

  //       const newGuests: Array<Guest> = []
  //       if(meeting.guests){
  //         meeting.guests.forEach((guest: Guest) => {
  //           const newGuest: Guest = {
  //             id: guest.id,
  //             name: guest.name,
  //             surname: guest.surname,
  //             jobPosition: guest.jobPosition,
  //           }
  //           newGuests.push(newGuest);
  //         })
  //       }

  //       const newTasks: Array<Task> = []
  //       if(meeting.tasksList){
  //         meeting.tasksList.forEach((task: Task) => {
  //           const newTask: Task = {
  //             id: task.id,
  //             name: task.name,
  //             description: task.description,
  //             priority: task.priority,
  //           }
  //           newTasks.push(newTask);
  //         })
  //       }
  //       const newAgenda = null;
  //       if(meeting.agenda){
  //         const newAgenda: Agenda = {
  //           id: meeting.agenda.id,
  //           name: meeting.agenda.name,
  //           list: meeting.agenda.list,
  //         }
  //       }
 
  //       const newMeeting: ExistedBoardMeetings = {
  //         id: meeting.meeting_id,
  //         meetingType: meeting.meeting_type,
  //         meetingName: meeting.meeting_name,
  //         meetingAddress: meeting.meeting_address,
  //         onlineAddress: meeting.online_address,
  //         dateStart: meeting.start_date,
  //         dateEnd: meeting.end_date,
  //         chooseFile: null,
  //         addedDocuments: null,
  //         guests: newGuests,
  //         tasksList: newTasks,
  //         agenda: newAgenda
  //       }
  //       this.meetingsList.push(newMeeting);
  //     });
  //   }
  //   this.meetingsNotEmpty = true;
  //   this.meetingsListService.setGlobalMeetingsList(this.meetingsList)
  // }

  deleteMeeting(id: number) {
    if (id === null) {
      const returnMessage = "No object ID to delete";
      this._snackBar.open(returnMessage, 'Close', { duration: 3000 });
      throw new Error(returnMessage);
    } else {
      this.restService.deleteMeeting(id).subscribe({
        next: () => {
          this.subscription = this.getMeetings();
          this._snackBar.open("Deleted object of id" + id, 'Close', { duration: 3000 });
        },
        error: (error: any) => {
          console.error('Error: ', error);
          this._snackBar.open("Cannot delete object, check console for more information", 'Close', { duration: 3000 });
        }
      });
    }
  }

  private ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
