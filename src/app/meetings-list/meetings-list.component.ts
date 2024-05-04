import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/restService.service';
import { urls } from '../shared/enums';
import { BoardMeetingData, Guest, Task, Agenda } from "../shared/interfaces"

@Component({
  selector: 'app-meetings-list',
  templateUrl: './meetings-list.component.html',
  styleUrl: './meetings-list.component.css'
})
export class MeetingsListComponent implements OnInit {

  public meetingsNotEmpty = false;
  public errorMessage: null | string = null;
  public meetingsList: BoardMeetingData[] = [];
  displayedColumns: string[] = ['meetingName', 'meetingType', 'dateStart', 'dateEnd'];

  constructor(private restService: RestService){
    this.meetingsList = [];
  }


  ngOnInit(): void {
    this.restService.receiveDataFromFastApi(urls.protocolHttps, urls.LOCALFASTAPI, urls.GETMEETINGS)
      .subscribe({
        next: (response: any) => {
          if(response.length > 0){
            response.forEach((meeting: any) => {

              const newGuests: Array<Guest> = []
              meeting.guests.forEach((guest: Guest) => {
                const newGuest: Guest = {
                  id: guest.id,
                  name: guest.name,
                  surname: guest.surname,
                  jobPosition: guest.jobPosition,
                }
                newGuests.push(newGuest);
              })

              const newTasks: Array<Task> = []
              meeting.tasksList.forEach((task: Task) => {
                const newTask: Task = {
                  id: task.id,
                  name: task.name,
                  description: task.description,
                  priority: task.priority,
                }
                newTasks.push(newTask);
              })

              const newAgenda: Agenda = {
                  id: meeting.agenda.id,
                  name: meeting.agenda.name,
                  list: meeting.agenda.list,
                }

              const newMeeting: BoardMeetingData = {
                meetingType: meeting.meeting_type,
                meetingName: meeting.meeting_name,
                meetingAddress: meeting.meeting_address,
                onlineAddress: meeting.online_address,
                dateStart: meeting.start_date,
                dateEnd: meeting.end_date,
                chooseFile: null,
                addedDocuments: null,
                guests: newGuests,
                tasksList: newTasks,
                agenda: newAgenda
              }
              this.meetingsList.push(newMeeting);
            });
          }

          this.meetingsNotEmpty = true;
        },
        error: (error: any) => {
          console.error("Error:", error);
          this.errorMessage = "Server communication error";
        }
      });
  }
}
