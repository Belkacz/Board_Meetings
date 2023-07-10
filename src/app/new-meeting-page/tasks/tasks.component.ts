import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/dialog-form/dialog-form.component';
import { Task } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
  @Output() tasksListOutput = new EventEmitter<Task[]>();

  public tasksList: Task[];
  public showTaskMenu: boolean;
  public dialogTitle: string;

  constructor( public dialog: MatDialog ) {
    this.tasksList = [];
    this.showTaskMenu = false;
    this.dialogTitle = "New Task"
  }

  ngOnInit(): void {
    this.tasksList = [{id: 1, name: "New task name 1"}, {id: 1, name: "New task name 1"}]
    this.sendTasksList();
  }

  // addTask() {
  //   const lastNumberRegex = /\d+$/;
  //   let maxNumber = 0;
  //   this.tasksList.forEach(task => {
  //     if (task !== '' && task) {
  //       const taskNumber = task.match(lastNumberRegex);
  //       if (taskNumber && parseInt(taskNumber[0], 10) > maxNumber) {
  //         maxNumber = (parseInt(taskNumber[0], 10));
  //       }
  //     }
  //   });
  //   maxNumber = maxNumber + 1;
  //   this.tasksList.push("New task name " + maxNumber)
  //   console.log('Add task placeholder')
  //   alert("add task placeholder");
  //   this.sendTasksList();
  // }

  showOrHideTaskDialog(title: string, fields: string[]) {
    this.showTaskMenu = !this.showTaskMenu;
    const dialogRef = this.dialog.open(DialogFormComponent)
    dialogRef.componentInstance.title = title
    //dialogRef.componentInstance.fields = [title, 'priority', 'time']
    fields.forEach(field => {
      dialogRef.componentInstance.fields = [field]
    });
    
    dialogRef.afterClosed().subscribe(result =>  {
      this.sendTasksList();
    })
  }

  editTask() {
    console.log('Edit task placeholder')
    alert("add task placeholder");
    this.sendTasksList();
  }

  clearInput(index: number) {
    this.tasksList.splice(index, 1);
    this.sendTasksList();
  }

  sendTasksList() {
    const dataToSend = this.tasksList;
    this.tasksListOutput.emit(dataToSend);
  }
}
