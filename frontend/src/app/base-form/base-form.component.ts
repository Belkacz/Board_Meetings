import { FormBuilder, FormGroup } from '@angular/forms';
import { Directive, OnInit } from '@angular/core';

@Directive()
export abstract class BaseFormComponent implements OnInit {
  public form!: FormGroup;

  constructor(protected formBuilder: FormBuilder) {
    this.createFormControls();
  }

  ngOnInit() {
  }

  protected abstract createFormControls(): void;
}
