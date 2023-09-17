import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitesComponent } from './invites.component';
import { MatTabsModule } from '@angular/material/tabs';

describe('InvitesComponent', () => {
  let component: InvitesComponent;
  let fixture: ComponentFixture<InvitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvitesComponent],
      imports: [MatTabsModule],
    });
    fixture = TestBed.createComponent(InvitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
