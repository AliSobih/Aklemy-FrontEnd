import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResetPasswordTokenComponent } from './create-reset-password-token.component';

describe('CreateResetPasswordTokenComponent', () => {
  let component: CreateResetPasswordTokenComponent;
  let fixture: ComponentFixture<CreateResetPasswordTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateResetPasswordTokenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateResetPasswordTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
