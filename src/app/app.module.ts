import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NewMeetingComponent } from './new-meeting-page/new-meeting/new-meeting.component';
import { DatepickerComponent } from './shared/datepicker/datepicker.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TimepickerComponent } from './shared/timepicker/timepicker.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NewMeetingPageComponent } from './new-meeting-page/new-meeting-page.component';
import { TasksComponent } from './new-meeting-page/tasks/tasks.component';
import { InvatesComponent } from './new-meeting-page/invates/invates.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BoardComponent } from './new-meeting-page/invates/board/board.component';
import { GuestsComponent } from './new-meeting-page/invates/guests/guests.component';
import { AppRoutingModule } from './shared/app-routing.module';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    NewMeetingComponent,
    TimepickerComponent,
    NewMeetingPageComponent,
    TasksComponent,
    InvatesComponent,
    BoardComponent,
    GuestsComponent,
    MainMenuComponent,
    AboutComponent
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
    MatButtonToggleModule,
    MatCardModule,
    MatListModule,
    MatTabsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
