import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePreviewComponent } from './course-preview.component';

describe('CoursePreviewComponent', () => {
  let component: CoursePreviewComponent;
  let fixture: ComponentFixture<CoursePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
