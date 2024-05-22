import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { NewMeetingPageComponent } from '../new-meeting-page/new-meeting-page.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { AboutComponent } from '../about/about.component';
import { MeetingsListComponent } from '../meetings-list/meetings-list.component';
import { EditMeetingPageComponent } from '../edit-meeting-page/edit-meeting-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'new-meeting', component: NewMeetingPageComponent },
  { path: 'meetings-list', component: MeetingsListComponent },
  { path: 'edit-meeting/:id', component: EditMeetingPageComponent },
  {
    path: 'home',
    component: MainMenuComponent,
    children: [
      { path: 'about', component: AboutComponent, outlet: 'bottomOutlet' },
      // { path: 'meetings-list', component: MeetingsListComponent, outlet: 'bottomOutlet' }
    ]
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
