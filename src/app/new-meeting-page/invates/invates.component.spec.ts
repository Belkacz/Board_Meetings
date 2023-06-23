import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvatesComponent } from './invates.component';

describe('InvatesComponent', () => {
  let component: InvatesComponent;
  let fixture: ComponentFixture<InvatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvatesComponent]
    });
    fixture = TestBed.createComponent(InvatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
