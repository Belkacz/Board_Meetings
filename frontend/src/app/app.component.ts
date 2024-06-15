import { Component } from '@angular/core';
import { dataService } from './services/dataService.service';
import { PopUpService } from './services/pop-up.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopUp } from './shared/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Board-Meetings';
  private subscription: Subscription | undefined;

  constructor(private popUpService: PopUpService, private _snackBar: MatSnackBar,) {
  }

  ngOnInit() {
    this.subscription = this.popUpService.popUp$.subscribe((popUp: PopUp) => {
      this._snackBar.open(popUp.message, 'Close', {
        duration: 5000,
        verticalPosition: 'top'
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
