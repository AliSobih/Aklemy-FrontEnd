import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAnswerComponent } from './show-answer.component';

describe('ShowAnswerComponent', () => {
  let component: ShowAnswerComponent;
  let fixture: ComponentFixture<ShowAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAnswerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
