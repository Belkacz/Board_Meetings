import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
  @Output() tasksListOutput = new EventEmitter<string[]>();

  public tasksList: string[];

  constructor() {
    this.tasksList = []
  }

  ngOnInit(): void {
    this.tasksList = ["New task name 1", "New task name 2"]
    this.sendTasksList();
  }

  addTask() {
    const lastNumberRegex = /\d+$/;
    let maxNumber = 0;
    this.tasksList.forEach(task => {
      console.log(task)
      if (task !== '' && task) {
        const taskNumber = task.match(lastNumberRegex);
        console.log(taskNumber)
        if (taskNumber && parseInt(taskNumber[0], 10) > maxNumber) {
          maxNumber = (parseInt(taskNumber[0], 10));
        }
      }
    });
    maxNumber = maxNumber + 1;
    this.tasksList.push("New task name " + maxNumber)
    console.log('ADD TASK placeholder')
    alert("add task placeholder");
    this.sendTasksList();
  }

  editTask() {
    console.log('ADD TASK placeholder')
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
