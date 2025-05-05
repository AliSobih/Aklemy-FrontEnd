import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReviewesComponent } from './all-reviewes.component';

describe('AllReviewesComponent', () => {
  let component: AllReviewesComponent;
  let fixture: ComponentFixture<AllReviewesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllReviewesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllReviewesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
