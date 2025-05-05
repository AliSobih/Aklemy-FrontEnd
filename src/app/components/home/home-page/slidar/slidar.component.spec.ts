import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidarComponent } from './slidar.component';

describe('SlidarComponent', () => {
  let component: SlidarComponent;
  let fixture: ComponentFixture<SlidarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlidarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
