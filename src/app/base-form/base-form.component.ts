import { OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';


export abstract class BaseFormComponent {
  public form!: FormGroup;

  constructor() {
    this.createFormControls();
  }

  protected abstract createFormControls(): void;
}
