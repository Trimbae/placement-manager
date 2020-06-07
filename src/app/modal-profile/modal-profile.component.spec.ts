import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProfileComponent } from './modal-profile.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

describe('ModalProfileComponent', () => {
  let component: ModalProfileComponent;
  let fixture: ComponentFixture<ModalProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProfileComponent ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
