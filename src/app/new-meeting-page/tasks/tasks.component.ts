import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit{
  public tasksList: string[];

  constructor() {
    this.tasksList = []
  }

  ngOnInit(): void {
    this.tasksList = ["New task name01", "New task name02"]
  }

  addTask(){
    console.log('ADD TASK placeholder')
    alert("add task placeholder");
  }


  clearInput(index: number) {
    this.tasksList.splice(index, 1);
  }

}
