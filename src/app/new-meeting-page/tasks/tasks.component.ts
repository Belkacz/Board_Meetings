import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/dialog-form/dialog-form.component';
import { Task } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit, OnDestroy {
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
    this.tasksList = [{id: 1, name: "New task name 1"}, {id: 2, name: "New task name 2"}]
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
    //const dialogRef = this.dialog.open(DialogFormComponent, { title: title })
    dialogRef.componentInstance.title = title
    dialogRef.componentInstance.fields = [title, 'priority', 'time']
    fields.forEach(field => {
      dialogRef.componentInstance.fields = [field]
    });
    dialogRef.componentInstance.formSubmit.subscribe((formValue: any) => {
      const lastTask = this.tasksList[this.tasksList.length - 1];
      let newTask: Task = { id: 0, name: formValue.name };
      if(lastTask != undefined){
        newTask.id = lastTask.id + 1;
      } else {
        newTask.id = 1;
      }
      this.tasksList.push(newTask)
      console.log(newTask.id)
      this.sendTasksList();
    });
    //dialogRef.componentInstance.formSubmit.unsubscribe


    // dialogRef.afterClosed().subscribe(result =>  {
    //   console.log("Dialog output:", result)
    //   this.sendTasksList();
    // })
  }

  ngOnDestroy(){

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
