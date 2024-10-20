import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { NewMeetingPageComponent } from '../new-meeting-page/new-meeting-page.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { AboutComponent } from '../about/about.component';
import { MeetingsListComponent } from '../meetings-list/meetings-list.component';
import { EditMeetingPageComponent } from '../edit-meeting-page/edit-meeting-page.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'new-meeting', component: NewMeetingPageComponent },
  { path: 'meetings-list', component: MeetingsListComponent },
  { path: 'edit-meeting/:id', component: EditMeetingPageComponent },
  {
    path: '',
    component: MainMenuComponent,
    children: [
      { path: 'about', component: AboutComponent, outlet: 'bottomOutlet' },
    ]
  },
  { path: '**', component: PageNotFoundComponent },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
