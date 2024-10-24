import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { dataService } from '../services/dataService.service';
import { ProjectData } from '../shared/interfaces';
import { RestService } from '../services/restService.service';
import { urls } from '../shared/enums';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {

  private subscription: Subscription | undefined;
  public projectInfo: ProjectData | null;
  public projectInfoError: string | null;
  public isHomePage: boolean;

  constructor(private dataService: dataService, private restService: RestService, private router: Router) {
    this.projectInfo = null;
    this.projectInfoError = null;
    this.isHomePage = this.router.url === '/home'
  }

  ngOnInit(): void {
    this.subscription = this.restService.receiveDataFromFastApi(urls.GETPROJECTINFO)
      .subscribe({
        next: (response: any) => {
          this.projectInfo = this.dataService.mapProjectData(response);
          this.projectInfoError = null;
        },
        error: (error: any) => {
          console.error("Error:", error);
          this.projectInfoError = "Server communication error";
        }
      });
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/home';
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
