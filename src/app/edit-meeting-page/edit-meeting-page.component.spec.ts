import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeetingPageComponent } from './edit-meeting-page.component';

describe('EditMeetingPageComponent', () => {
  let component: EditMeetingPageComponent;
  let fixture: ComponentFixture<EditMeetingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMeetingPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMeetingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
