import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogFormComponent } from 'src/app/dialog-form/dialog-form.component';
import { Task } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnDestroy, OnInit {
  @Input() initialTasks: Task[] | null = null;
  @Output() tasksListOutput = new EventEmitter<Task[]>();

  public tasksList: Task[];
  public dialogTitle: string;
  private dialogEditSub!: Subscription;
  private newTaskSubscription!: Subscription;

  public panelOpenStates: boolean[] = [];

  constructor(public dialog: MatDialog) {
    this.tasksList = [];
    this.dialogTitle = "New Task";
  }

  ngOnInit(): void {
    this.updateInitialTaskList();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateInitialTaskList();
  }

  private updateInitialTaskList() {
    if (!this.initialTasks) {
      this.tasksList = [
        { id: 1, name: "New task name 1", description: "New task description 1" },
        { id: 2, name: "New task name 2", description: "New task description 2" }
      ];
    } else {
      this.tasksList = this.initialTasks;
    }
    this.panelOpenStates = new Array(this.tasksList.length).fill(false);
    this.sendTasksList();
  }

  newTask(title: string): void {
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.data = [{ field: "Name", initData: '' }, { field: "Description", initData: '' }];

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const lastTask = this.tasksList[this.tasksList.length - 1];
        let newTask: Task = { id: 0, name: result.Name, description: result.Description || '' };
        newTask.id = lastTask ? lastTask.id + 1 : 1;
        this.tasksList.push(newTask);
        this.panelOpenStates.push(false);
        this.sendTasksList();
      }
    });
  }

  editTask(title: string, task: Task, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.data = [{ field: "Name", initData: task.name }, { field: "Description", initData: task.description }];

    this.dialogEditSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        task.name = result.Name;
        task.description = result.Description || '';
      }
    });
  }

  clearInput(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.tasksList.splice(index, 1);
    this.panelOpenStates.splice(index, 1);
    this.sendTasksList();
  }

  ngOnDestroy() {
    if (this.newTaskSubscription) {
      this.newTaskSubscription.unsubscribe();
    }
    if (this.dialogEditSub) {
      this.dialogEditSub.unsubscribe();
    }
  }

  sendTasksList() {
    const dataToSend = this.tasksList;
    this.tasksListOutput.emit(dataToSend);
  }
}
