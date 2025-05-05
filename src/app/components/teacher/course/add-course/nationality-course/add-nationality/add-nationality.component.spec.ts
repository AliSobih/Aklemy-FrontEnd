import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNationalityComponent } from './add-nationality.component';

describe('AddNationalityComponent', () => {
  let component: AddNationalityComponent;
  let fixture: ComponentFixture<AddNationalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNationalityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNationalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
