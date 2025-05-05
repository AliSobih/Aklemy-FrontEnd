import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDescriptionMasterComponent } from './add-description-master.component';

describe('AddDescriptionMasterComponent', () => {
  let component: AddDescriptionMasterComponent;
  let fixture: ComponentFixture<AddDescriptionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDescriptionMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDescriptionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
