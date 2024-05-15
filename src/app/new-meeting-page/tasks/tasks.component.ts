import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogFormComponent } from 'src/app/dialog-form/dialog-form.component';
import { Task, newTaskVale } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit, OnDestroy {
  @Input() initialTasks: Task[] | null = null;
  @Output() tasksListOutput = new EventEmitter<Task[]>();

  public tasksList: Task[];
  public showTaskMenu: boolean;
  public dialogTitle: string;
  private dialogEditSub!: Subscription;
  private newTaskSub!: Subscription

  constructor(public dialog: MatDialog) {
    this.tasksList = [];
    this.showTaskMenu = false;
    this.dialogTitle = "New Task"
  }

  ngOnInit(): void {
    if(!this.initialTasks){
      this.tasksList = [{ id: 1, name: "New task name 1" }, { id: 2, name: "New task name 2" }]
    } else {
      this.tasksList = this.initialTasks
    }
    
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


  newTask(title: string, fields: string[]): void {
    this.showTaskMenu = !this.showTaskMenu;
    const dialogRef = this.dialog.open(DialogFormComponent)
    //const dialogRef = this.dialog.open(DialogFormComponent, { title: title })
    dialogRef.componentInstance.title = title
    //dialogRef.componentInstance.fields = [title, 'priority', 'time']
    fields.forEach(field => {
      dialogRef.componentInstance.fields = [field]
    });
    this.newTaskSub = dialogRef.componentInstance.formSubmit.subscribe((formValue: newTaskVale) => {
      const lastTask = this.tasksList[this.tasksList.length - 1];
      let newTask: Task = { id: 0, name: formValue.name };
      if (lastTask != undefined) {
        newTask.id = lastTask.id + 1;
      } else {
        newTask.id = 1;
      }
      this.tasksList.push(newTask)
      this.sendTasksList();
    });
  }

  editTask(title: string, task: Task, fields: string[]): void {
    this.showTaskMenu = !this.showTaskMenu;
    const dialogRef = this.dialog.open(DialogFormComponent)
    dialogRef.componentInstance.title = title
    fields.forEach(field => {
      dialogRef.componentInstance.fields = [field]
    });
    this.dialogEditSub = dialogRef.componentInstance.formSubmit.subscribe((formValue: newTaskVale) => {
      task.name = formValue.name
    });

  }

  ngOnDestroy() {
    if (this.newTaskSub) {
      this.newTaskSub.unsubscribe();
    }
    if (this.dialogEditSub) {
      this.dialogEditSub.unsubscribe();
    }
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
