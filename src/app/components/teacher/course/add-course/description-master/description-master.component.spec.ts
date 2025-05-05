import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionMasterComponent } from './description-master.component';

describe('DescriptionMasterComponent', () => {
  let component: DescriptionMasterComponent;
  let fixture: ComponentFixture<DescriptionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
