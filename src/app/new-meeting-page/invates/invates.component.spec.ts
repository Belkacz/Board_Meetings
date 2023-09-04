import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvatesComponent } from './invates.component';
import { MatTabsModule } from '@angular/material/tabs';

describe('InvatesComponent', () => {
  let component: InvatesComponent;
  let fixture: ComponentFixture<InvatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvatesComponent],
      imports: [MatTabsModule],
    });
    fixture = TestBed.createComponent(InvatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
