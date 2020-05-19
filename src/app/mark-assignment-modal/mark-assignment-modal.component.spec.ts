import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAssignmentModalComponent } from './mark-assignment-modal.component';

describe('MarkAssignmentModalComponent', () => {
  let component: MarkAssignmentModalComponent;
  let fixture: ComponentFixture<MarkAssignmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkAssignmentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAssignmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
