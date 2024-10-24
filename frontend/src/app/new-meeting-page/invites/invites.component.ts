import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/restService.service';
import { urls } from 'src/app/shared/enums';
import { Guest, GuestInvited } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css'],
})
export class InvitesComponent implements OnInit, OnDestroy {
  @Input() invitedToEdited: Guest[] | null = null;
  public initialPersonsList: Guest[] | null = [];

  public errorMessage: null | string = null;
  private subscription: Subscription | undefined;

  constructor(private restService: RestService) { }

  ngOnInit() {
    this.subscription = this.getPeople();
  }

  private getPeople(): Subscription {
    const result = this.restService.receiveDataFromFastApi(urls.GETPEOPLE)
      .subscribe({
        next: (response: any) => {
          const newPersonList: Guest[] = []
          response.forEach((person: any) => {
            const newPerson: Guest = {
              id: person.id,
              name: person.name,
              surname: person.surname,
              jobPosition: person.jobPosition
            };
            newPersonList.push(newPerson);
          });
          if (newPersonList.length > 0) {
            this.initialPersonsList = newPersonList;
          }

        },
        error: (error: any) => {
          console.error("Error:", error);
          this.errorMessage = "Server communication error";
        }
      });
    return result;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

