import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllExamComponent } from './all-exam.component';

describe('AllExamComponent', () => {
  let component: AllExamComponent;
  let fixture: ComponentFixture<AllExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllExamComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
