import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewMeetingComponent } from './new-meeting/new-meeting.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BaseFormComponent } from './base-form/base-form.component';
import { TimepickerComponent } from './timepicker/timepicker.component';



@NgModule({
  declarations: [
    AppComponent,
    NewMeetingComponent,
    TimepickerComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    DatepickerComponent,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatButtonModule, 
    MatDividerModule, 
    MatIconModule,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonToggleModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
