import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.css']
})
export class DialogFormComponent {
  @Input() title: string;
  @Input() fields: string[];
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.title = 'title';
    this.fields = [];
    this.form = new FormGroup({})
  }

  ngOnInit() {
    this.form = this.fb.group({});
    for (let field of this.fields) {
      this.form.addControl(field, new FormControl('', Validators.required));
    }
  }

  onSubmit() {
    console.log('sumbit')
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}
