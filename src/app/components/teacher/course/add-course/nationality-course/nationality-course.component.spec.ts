import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalityCourseComponent } from './nationality-course.component';

describe('NationalityCourseComponent', () => {
  let component: NationalityCourseComponent;
  let fixture: ComponentFixture<NationalityCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NationalityCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalityCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
