import { FormBuilder, FormGroup } from '@angular/forms';
import { Directive, OnInit } from '@angular/core';

@Directive()
export abstract class BaseFormComponent {
  public form!: FormGroup;

  constructor(protected formBuilder: FormBuilder) {
    this.createFormControls();
  }

  protected abstract createFormControls(): void;
}
