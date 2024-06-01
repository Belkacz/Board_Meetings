import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogFormComponent } from 'src/app/dialog-form/dialog-form.component';
import { Task, newTaskVale } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnDestroy {
  @Input() initialTasks: Task[] | null = null;
  @Output() tasksListOutput = new EventEmitter<Task[]>();

  public tasksList: Task[];
  public showTaskMenu: boolean;
  public dialogTitle: string;
  private dialogEditSub!: Subscription;
  private newTaskSubscription!: Subscription

  public panelOpenState = false;

  constructor(public dialog: MatDialog) {
    this.tasksList = [];
    this.showTaskMenu = false;
    this.dialogTitle = "New Task"
  }


  ngOnChanges(changes: SimpleChanges) {
    this.updateInitialTaskList();
  }

  private updateInitialTaskList() {
    if (!this.initialTasks) {
      this.tasksList = [{ id: 1, name: "New task name 1" }, { id: 2, name: "New task name 2" }]
    } else {
      this.tasksList = this.initialTasks
    }
    this.sendTasksList();
  }

  newTask(title: string, fields: string[]): void {
    const dialogRef = this.dialog.open(DialogFormComponent)
    dialogRef.componentInstance.title = title
    dialogRef.componentInstance.fields = fields

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        const lastTask = this.tasksList[this.tasksList.length - 1];
        let newTask: Task = { id: 0, name: result.Name };
        if (lastTask != undefined) {
          newTask.id = lastTask.id + 1;
        } else {
          newTask.id = 1;
        }
        if (result.Description) {
          newTask = { ...newTask, description: result.Description };
        }
        this.tasksList.push(newTask)
        this.sendTasksList();
      }
    })
  }

  editTask(title: string, task: Task, fields: string[]): void {
    this.showTaskMenu = !this.showTaskMenu;
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.fields = fields;
    this.dialogEditSub = dialogRef.afterClosed().subscribe(result => {
      task.name = result.Name;
      if (result.Description) {
        task.description = result.Description;
      }
    });
  }

  ngOnDestroy() {
    if (this.newTaskSubscription) {
      this.newTaskSubscription.unsubscribe();
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
