import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeacherRequestComponent } from './add-teacher-request.component';

describe('AddTeacherRequestComponent', () => {
  let component: AddTeacherRequestComponent;
  let fixture: ComponentFixture<AddTeacherRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTeacherRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTeacherRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
