import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from 'src/app/base-form/base-form.component';

@Component({
  selector: 'app-tasks-form',
  templateUrl: './tasks-form.component.html',
  styleUrls: ['./tasks-form.component.css']
})
export class TasksFormComponent extends BaseFormComponent{
  constructor() {
    super();
  }

  createFormControls(): void {

  }

  addTask(){
    console.log('ADD TASK')
  }
}
