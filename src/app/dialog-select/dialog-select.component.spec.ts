import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectComponent } from './dialog-select.component';

describe('DialogSelectComponent', () => {
  let component: DialogSelectComponent;
  let fixture: ComponentFixture<DialogSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
